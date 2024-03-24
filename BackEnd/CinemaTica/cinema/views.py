from rest_framework import status
from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from unicodedata import name
import qrcode
from io import BytesIO
from django.core.files import File
from django.shortcuts import get_object_or_404
from django.template.loader import get_template
from xhtml2pdf import pisa
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.core.mail import EmailMessage
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND
from rest_framework.authtoken.models import Token
from django.shortcuts import render
import razorpay
from django.conf import settings
from django.http import JsonResponse
from django.http import HttpResponseRedirect
from datetime import datetime
from django.db.models import Sum
from .forms import MovieDetailsForm, ShowDetailsForm, ScreenDetailsForm, BookingsForm, SlotDetailsForm, CreationForm
from .serializers import MovieSerializer, ShowSerializer, SlotSerializer, ScreenSerializer, BookingSerializer
from .models import MovieDetails, ScreenDetails, ShowDetails, SlotDetails, Bookingsdetails
IMAGE_FILE_TYPES = ['png', 'jpg', 'jpeg']

razorpay_client = razorpay.Client(auth=(settings.RAZOR_KEY_ID, settings.RAZOR_KEY_SECRET))

@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated,])
def paymentportal(request):
    print("0")
    if request.method == "POST":
        show=request.data['show']
        date=request.data['date']
        ticket=int(request.data['ticket'])
        tktcnt=int(request.data['tktcnt'])
        amount = ticket*100*100
        user_id= request.data['user']
        products = ShowDetails.objects.get(pk=show)
        serializer = ShowSerializer(products)
        movie=serializer.data['name']
        screen=serializer.data['screen']
        slot=serializer.data['slot']
        mov=MovieDetails.objects.get(pk=movie)
        scrn=ScreenDetails.objects.get(pk=screen)
        time=SlotDetails.objects.get(pk=slot)
        print("2")
        if(scrn.screen==1):
            seat=f"AUDI 1 from {tktcnt+1} to {tktcnt+ticket}"
        elif(scrn.screen==2):
            seat=f"AUDI 2 from {tktcnt+1} to {tktcnt+ticket}"
        elif(scrn.screen==3):
            seat=f"AUDI 3 from {tktcnt+1}-{tktcnt+ticket}"
        else:
            seat="AUDI ***"
        seat=str(seat)
        data={'user_mail':user_id,
              'slotdetails':time.time,
              'movie_name':mov.name,
              'date':date,
              'screen':scrn.screen,
              'tktcount':ticket,
              'amount':amount/100,
              'payment_status':0,
              'language':mov.language,
              'image':mov.image,
              'seat':'seat',
              'booking_qr':'default_qr_value',
              'booking_pdf':'default_pdf_value'}
        book=BookingsForm(data=data)
        booking= book.save()
        booking_id=booking.id
        new_order_response = razorpay_client.order.create({
            "amount": amount,
            "currency": "INR",
            "payment_capture": "1"
        })

        response_data = {
            "callback_url": f"http://127.0.0.1:8000/cinema/confirmbooking/{booking_id}",
            "razorpay_key": "rzp_test_KCf8boYap3lfLr",
            "order": new_order_response
        }

        return JsonResponse(response_data)


@csrf_exempt
def confirmbooking(request,pk):
    if request.method == "POST":
        if "razorpay_signature" in request.POST:
            payment_verification = razorpay_client.utility.verify_payment_signature(request.POST)
            booking=Bookingsdetails.objects.get(pk=pk)
            if payment_verification:
                booking.payment_status=1
                booking.save()
                frontend_url = f"http://localhost:3000/mybookings/{pk}"
                qr = qrcode.make(frontend_url)
                qr_image = BytesIO()
                qr.save(qr_image, format='PNG')
                booking.booking_qr.save(f'Booking_qr_code{pk}.png', File(qr_image))
                template = get_template('product_pdf.html')
                html = template.render({'booking': booking})
                buffer = BytesIO()
                pisa_status = pisa.CreatePDF(html, dest=buffer)
                booking.booking_pdf.save(f'BookingPdf{pk}.pdf', File(buffer))
                subject = f"CINEMATICA: {booking.movie_name}"
                from_email = "cinematica@gmail.com"
                recipient_list = ["your_mailtrap_inbox@mailtrap.io"]
                html_message = render_to_string('product_email.html', {'booking': booking})
                plain_message = strip_tags(html_message)
                pdf_content = buffer.getvalue()
                email = EmailMessage(
                    subject,
                    plain_message,
                    from_email,
                    recipient_list,
                )
                email.attach_file(booking.booking_pdf.path, 'application/pdf')
                email.send()
                return HttpResponseRedirect(frontend_url)
            else:
                booking.delete()
                frontend_url = 'http://localhost:3000'
                return HttpResponseRedirect(frontend_url)


@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny],)
def signup(request):
    form = CreationForm(data=request.data)
    if form.is_valid():
        user = form.save()
        return Response("Account created successfully", status=status.HTTP_201_CREATED)
    return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(["POST"])
@permission_classes((AllowAny,))
def login(request):
    username = request.data.get("email")
    email_ver = request.data.get("email")
    password_ver = request.data.get("password")
    if email_ver is None or password_ver is None:
        return Response({'error': 'Please provide both email and password'}, status=HTTP_400_BAD_REQUEST)
    user = authenticate(username=username, email=email_ver,
                        password=password_ver)
    if not user:
        return Response({'error': 'Invalid Credentials'}, status=HTTP_404_NOT_FOUND)
    token, _ = Token.objects.get_or_create(user=user)
    return Response({'token': token.key}, status=HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated,])
def logout(request):
    request.auth.delete()
    return Response(status=status.HTTP_200_OK)

# For Movies.....


@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated,])
def Add_Movies(request):
    form = MovieDetailsForm(request.data, request.FILES)
    if form.is_valid():
        product = form.save(commit=False)
        product.image = request.FILES['image']
        file_type = product.image.url.split('.')[-1]
        file_type = file_type.lower()
        if file_type not in IMAGE_FILE_TYPES:
            return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)
        product.save()
        return Response({'id': product.id}, status=status.HTTP_201_CREATED)

    return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([AllowAny,])
def List_Movies(request):
    products = MovieDetails.objects.all()
    serializer = MovieSerializer(products, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny,])
def List_Movie(request, pk):
    selected = get_object_or_404(MovieDetails, pk=pk)
    serializer = MovieSerializer(selected)
    return Response(serializer.data)


@csrf_exempt
@api_view(['PUT'])
@permission_classes([IsAuthenticated,])
def Update_Movie(request, pk):
    product = get_object_or_404(MovieDetails, pk=pk)
    form = MovieDetailsForm(request.data, instance=product)
    if form.is_valid():
        form.save()
        serializer = MovieSerializer(product)
        return Response(serializer.data, status=HTTP_200_OK)
    else:
        return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(['DELETE'])
@permission_classes([IsAuthenticated,])
def Delete_Movie(request, pk):
    try:
        product = MovieDetails.objects.get(pk=pk)
    except MovieDetails.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if(product.is_active==1):
       
       product.is_active = 0
    else:
       product.is_active = 1
    product.save()
    return Response("Status changed successfully")

 
# For Slot.....


@api_view(['GET'])
@permission_classes([IsAuthenticated,])
def List_Slots(request, pk):
    products = SlotDetails.objects.all(pk=pk)
    serializer = SlotSerializer(products, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated,])
def List_Slotssss(request):
    products = SlotDetails.objects.all()
    serializer = SlotSerializer(products, many=True)
    return Response(serializer.data)


@csrf_exempt
@api_view(['PUT'])
@permission_classes([IsAuthenticated,])
def Update_Slots(request, pk):
    product = get_object_or_404(SlotDetails, pk=pk)
    form = SlotDetailsForm(request.data, instance=product)
    if form.is_valid():
        form.save()
        serializer = SlotSerializer(product)
        return Response(serializer.data, status=HTTP_200_OK)
    else:
        return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(['DELETE'])
@permission_classes([IsAuthenticated,])
def Delete_Slots(request, pk):
    try:
        product = SlotDetails.objects.get(pk=pk)
    except SlotDetailsForm.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    product.delete()
    return Response("Deleted successfully")

# For Show......


@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated,])
def Add_Shows(request):
    form = ShowDetailsForm(request.data)
    if form.is_valid():
        product = form.save()
        return Response(status=status.HTTP_201_CREATED)
    return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated,])
def List_Show(request, pk):
    products = ShowDetails.objects.filter(name=pk)
    serializer = ShowSerializer(products, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated,])
def List_Shows(request):
    products = ShowDetails.objects.all()
    serializer = ShowSerializer(products, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated,])
def Book_Shows(request, pk):
    products = ShowDetails.objects.filter(pk=pk)
    serializer = ShowSerializer(products, many=True)
    return Response(serializer.data)


@csrf_exempt
@api_view(['PUT'])
@permission_classes([IsAuthenticated,])
def Update_Shows(request, pk):
    product = get_object_or_404(ShowDetails, pk=pk)
    form = ShowDetailsForm(request.data, instance=product)
    if form.is_valid():
        form.save()
        serializer = ShowSerializer(product)
        return Response(serializer.data, status=HTTP_200_OK)
    else:
        return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(['DELETE'])
@permission_classes([IsAuthenticated,])
def Delete_Shows(request, pk):
    try:
        product = ShowDetails.objects.get(pk=pk)
    except ShowDetailsForm.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    product.is_active = "False"
    product.save()
    return Response("Deleted successfully")

# For Screen......


@api_view(['GET'])
@permission_classes([IsAuthenticated,])
def List_Screens(request):
    products = ScreenDetails.objects.all()
    serializer = ScreenSerializer(products, many=True)
    return Response(serializer.data)


# For Booking.....

@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated,])
def Add_Bookings(request):
    form = BookingsForm(request.data)
    if form.is_valid():
        product = form.save()
        return Response({'id': product.id}, status=status.HTTP_201_CREATED)
    return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated,])
def List_Bookings(request,mail_str):
    products = Bookingsdetails.objects.filter(user_mail=mail_str).order_by('-id')
    serializer = BookingSerializer(products, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny,])
def Show_Booking(request,pk):
    products = Bookingsdetails.objects.filter(pk=pk)
    serializer = BookingSerializer(products, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny,])
def Check_Availability(request,date_str,pk):
    date_obj = datetime.strptime(date_str, '%Y-%m-%d').date()
    show = get_object_or_404(ShowDetails, pk=pk)
    serializer= ShowSerializer(show)
    movie=serializer.data['name']
    screen=serializer.data['screen']
    slot=serializer.data['slot']
    mov=MovieDetails.objects.get(pk=movie).name
    scrn=ScreenDetails.objects.get(pk=screen).screen
    capacity=ScreenDetails.objects.get(pk=screen).capacity
    time=SlotDetails.objects.get(pk=slot).time
    total = Bookingsdetails.objects.filter(date=date_obj, screen=scrn, slotdetails=time, movie_name=mov).aggregate(total=Sum('tktcount'))
    total_count = total['total'] if total['total'] else 0
    tkt_left=capacity-total_count
    return Response({'total':total_count,'tktleft':tkt_left})
