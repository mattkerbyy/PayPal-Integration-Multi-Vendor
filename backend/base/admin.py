from django.contrib import admin
from .models import *
from .models import UserProfile
# Register your models here.

admin.site.register(Product)
admin.site.register(Review)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(ShippingAddress)
admin.site.register(Contact)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'merchant_id']

admin.site.register(UserProfile, UserProfileAdmin)


