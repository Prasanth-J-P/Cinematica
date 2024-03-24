from rest_framework import serializers
from .models import MovieDetails , ScreenDetails, ShowDetails, SlotDetails, Bookingsdetails

class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = MovieDetails
        fields = '__all__'

class ScreenSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScreenDetails
        fields = '__all__'

class SlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = SlotDetails
        fields = '__all__'

class ShowSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShowDetails
        fields = '__all__'

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bookingsdetails
        fields = '__all__'