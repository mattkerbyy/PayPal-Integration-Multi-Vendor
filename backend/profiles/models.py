from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save  
from django.dispatch import receiver
# Create your models here.

class Profile(models.Model):
    user = models.ForeignKey(User, related_name='profile', on_delete=models.CASCADE)
    merchant_id = models.CharField(max_length=100, null=True)
    
    def __str__(self):
        return self.user.username
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)