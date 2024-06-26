# Generated by Django 4.2.7 on 2024-03-04 11:14

import datetime
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='MovieDetails',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=60)),
                ('description', models.CharField(max_length=500)),
                ('language', models.CharField(default='', max_length=20)),
                ('rel_date', models.DateField()),
                ('image', models.ImageField(default='demo_image.jpg', upload_to='')),
                ('duration', models.PositiveIntegerField(default=0)),
                ('trailer', models.CharField(default='', max_length=300)),
            ],
        ),
        migrations.CreateModel(
            name='ScreenDetails',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('screen', models.PositiveIntegerField()),
                ('capacity', models.PositiveIntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='SlotDetails',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('slot', models.CharField(default='', max_length=10)),
                ('time', models.TimeField(default=datetime.time(9, 30))),
            ],
        ),
        migrations.CreateModel(
            name='ShowDetails',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('From', models.DateField(default='')),
                ('To', models.DateField(default='')),
                ('comp_capacity', models.PositiveIntegerField(default=0)),
                ('name', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='cinema.moviedetails')),
                ('screen', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='cinema.screendetails')),
                ('slot', models.ForeignKey(default='', on_delete=django.db.models.deletion.CASCADE, to='cinema.slotdetails')),
            ],
        ),
        migrations.AddField(
            model_name='screendetails',
            name='slot',
            field=models.ForeignKey(default='', on_delete=django.db.models.deletion.SET_DEFAULT, to='cinema.slotdetails'),
        ),
  
    ]
