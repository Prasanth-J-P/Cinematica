from django import forms
from .models import MovieDetails, ShowDetails, ScreenDetails, Bookingsdetails ,SlotDetails
from django.core.validators import MinValueValidator, URLValidator
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User

class CreationForm(UserCreationForm):
     class Meta:
         model = User
         fields = ['first_name','email','password1','password2']
         widget = {
             'email':forms.EmailInput(attrs={'unique': True})
            }

class MovieDetailsForm(forms.ModelForm):
    duration = forms.IntegerField(validators=[MinValueValidator(0)])
    trailer = forms.URLField(validators=[URLValidator()])
    class Meta:
        model = MovieDetails
        fields = '__all__'
        widgets = {
            'rel_date': forms.DateInput(
                format=('%d/%m/%Y'))           
                }        

class ScreenDetailsForm(forms.ModelForm):
    screen = forms.IntegerField(validators=[MinValueValidator(1)]) 
    capacity = forms.IntegerField(validators=[MinValueValidator(1)])
    class Meta:
        model = ScreenDetails
        fields = '__all__'
        widgets = {
            'From': forms.DateInput(
                format=('%d/%m/%Y')),
             'To' :  forms.DateInput(
                format=('%d/%m/%Y')),
                } 
        
class ShowDetailsForm(forms.ModelForm): 
    class Meta:
        model = ShowDetails
        fields = '__all__'

class SlotDetailsForm(forms.ModelForm):
    class Metsa:
        model = SlotDetails
        fields = '__all__'

class BookingsForm(forms.ModelForm):
    amount = forms.IntegerField(validators=[MinValueValidator(1)])
    tktcount = forms.IntegerField(validators=[MinValueValidator(1)])
    class Meta:
        model = Bookingsdetails
        fields = '__all__'
        widgets = {
            'date'    : forms.DateInput(
                format=('%d/%m/%Y'))
                }
 