from django.db import models
from django.contrib.auth.models import User
import datetime
from django.utils import timezone

def upload_to(instance,filename):
    return 'posts/{filename}'.format(filename=filename)
class MovieDetails(models.Model):
    name = models.CharField(max_length=60)
    description = models.CharField(max_length=500)
    language =models.CharField(max_length=20, default="")
    rel_date = models.DateField()
    image = models.ImageField(upload_to=upload_to , default="demo_image.png")
    duration = models.PositiveIntegerField(default=0)
    trailer = models.CharField(max_length=300, default="")
    is_active = models.BooleanField(default="True")

class SlotDetails(models.Model):
    slot = models.CharField(max_length=10, default="")
    time = models.TimeField(default=datetime.time(9, 30))

class ScreenDetails(models.Model):
    screen = models.PositiveIntegerField()
    capacity = models.PositiveIntegerField()



class ShowDetails(models.Model):
    screen = models.ForeignKey(ScreenDetails,on_delete=models.CASCADE)
    slot = models.ForeignKey(SlotDetails,on_delete=models.CASCADE,default="")
    name = models.ForeignKey(MovieDetails,on_delete=models.CASCADE)
    From = models.DateField(default="")
    To = models.DateField(default="")
    comp_capacity = models.PositiveIntegerField(default=0)
    def save(self, *args, **kwargs):
        if self.comp_capacity > self.screen.capacity:
            raise ValueError("No more tickets available for this show.")
        super().save(*args, **kwargs)


class Bookingsdetails(models.Model):
    date = models.DateField(default=timezone.now)
    screen = models.PositiveIntegerField()
    tktcount = models.PositiveIntegerField()
    amount = models.PositiveIntegerField()
    booking_qr = models.ImageField(upload_to=upload_to ,default='demo_image.png')
    user_mail= models.CharField(default="google@gmail.com", max_length=30)
    payment_status=models.BooleanField(default="False")
    seat=models.CharField(max_length=10,default='')
    language=models.CharField(max_length=20, default="")
    image=models.CharField(max_length=50,default="")
    movie_name=models.CharField(max_length=60,default="")
    slotdetails= models.TimeField(default=timezone.now)
    booking_pdf=models.FileField(max_length=50,default="demo_pdf.pdf")




    

