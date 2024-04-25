from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from base.models import Contact
from rest_framework.views import APIView
from base.serializer import ContactSerializer, UserSerializer, UserSerializerWithToken, MyTokenObtainPairSerializer
from django.contrib.auth.models import Group
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from base.serializer import SellerCheckSerializer
from base.serializer import AdminCheckSerializer

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

@api_view(['GET'])
def getUserProfile(request):
    user = request.user
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUserProfile(request):
    user = request.user
    serializer = UserSerializerWithToken(user, many=False)
    data = request.data
    print(data)
    user.first_name = data['name']
    user.email = data['email']
    

    if data['password'] != '':
        user.password = make_password(data['password'])
    user.save()
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUsers(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def registerUser(request):
    data = request.data
    print("Request Data:", data)  # Log request data to check if user_type is present
    try:
        user = User.objects.create(
            first_name=data.get('name'),
            username=data.get('email'),
            email=data.get('email'),
            password=make_password(data.get('password')),
        )

        # Check if the user is a seller and add them to the Seller group
        if data.get('user_type') == 'seller':
            seller_group, _ = Group.objects.get_or_create(name='Seller')
            user.groups.add(seller_group)
            print("User added to Seller group:", user.username)  # Log if user is added to Seller group

        serializer = UserSerializerWithToken(user, many=False)
        return Response(serializer.data)
    except Exception as e:
        print("Error:", e)  # Log any exceptions that occur during user creation
        message = {'detail': 'User with this email already exists'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)

class CheckSellerGroupAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        is_seller = request.user.groups.filter(name='Seller').exists()
        serializer = SellerCheckSerializer({'is_seller': is_seller})
        return Response(serializer.data)
    
class CheckAdminGroupAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        is_admin = request.user.groups.filter(name='Admin').exists()
        serializer = AdminCheckSerializer({'is_admin': is_admin})
        return Response(serializer.data)
