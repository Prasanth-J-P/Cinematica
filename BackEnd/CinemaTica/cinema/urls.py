from django.urls import path
from cinema import views

urlpatterns = [
    path('signup', views.signup, name='signupapi'),
    path('login', views.login, name='loginapi'),
    path('create', views.Add_Movies, name='createapi'),
    path('', views.List_Movies, name='retrieveapi'),
    path('<int:pk>', views.List_Movie, name='retrieveapibyid'),
    path('update/<int:pk>', views.Update_Movie, name='updateapi'),
    path('delete/<int:pk>', views.Delete_Movie, name='deleteapi'),
    path('logout', views.logout, name='logoutapi'),
    path('slots/<int:pk>', views.List_Slots, name='listslotsapi'),
    path('listslots', views.List_Slotssss, name='listslotssssapi'),
    path('listscreen', views.List_Screens, name='listscreenapi'),
    path('addshow', views.Add_Shows, name='addshowapi'),
    path('listshows', views.List_Shows, name='addshowapi'),
    path('listshow/<int:pk>', views.List_Show, name='listshowapi'),
    # path('listshow/<int:mov_id>', views.List_Show, name='listshowapi'),    
    # path('listshow/<int:mov_id>/<int:scrn_id>', views.List_Show, name='listshowapi'),
    # path('listshow/<int:mov_id>/<int:scrn_id>/<int:slot_id>', views.List_Show, name='listshowapi'),
    path('listbooking', views.List_Bookings, name='listbookingapi'),
    path('addbooking', views.Add_Bookings, name='addbookingapi'),
    path('listshow/bookshow/<int:pk>', views.Book_Shows, name='listshowapi'),
    path('paymentportal', views.paymentportal, name='paymenthandler'),
    path('confirmbooking/<int:pk>', views.confirmbooking, name='confirmbooking'),
    path('mybooking/<int:pk>', views.Show_Booking, name='showbooking'),
    path('mybookings/<str:mail_str>', views.List_Bookings, name='listbooking'),
    path('checkavailability/<str:date_str>/<int:pk>', views.Check_Availability, name='ckeckavailability'),

]
