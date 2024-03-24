from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('cinema/', include('cinema.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
