from django.urls import path
from base.views.user_views import *
from base.views.user_views import CheckSellerGroupAPIView
from base.views.user_views import CheckAdminGroupAPIView

urlpatterns = [
    path('login/', MyTokenObtainPairView.as_view(), name='login'),
    path('profile/', getUserProfile, name='user-profile'),
    path('', getUsers, name='users'),
    path('register/', registerUser, name='register'),
    path('profile/update/', updateUserProfile, name='user-profile-update'),
    path('api/check-seller-group/', CheckSellerGroupAPIView.as_view(), name='check_seller_group'),
    path('api/check-admin-group/', CheckAdminGroupAPIView.as_view(), name='check_admin_group'),
]