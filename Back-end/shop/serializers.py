
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Category, Product, Order, OrderItem, PaymentIntent

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id","username","email"]

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = ["id","username","email","password"]
    def create(self, validated_data):
        return User.objects.create_user(
            username=validated_data["username"],
            email=validated_data.get("email"),
            password=validated_data["password"]
        )

class CategorySerializer(serializers.ModelSerializer):
    class Meta: model = Category; fields = ["id","name","slug"]

class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    price = serializers.FloatField()
    class Meta: model = Product; fields = ["id","title","category","price","rating","thumbnail"]

class OrderItemInputSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    qty = serializers.IntegerField(min_value=1)

class AddressSerializer(serializers.Serializer):
    fullName = serializers.CharField(max_length=200)
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=30)
    line1 = serializers.CharField(max_length=200)
    city = serializers.CharField(max_length=100)
    country = serializers.CharField(max_length=100)
    zip = serializers.CharField(max_length=20)

class OrderCreateSerializer(serializers.Serializer):
    items = OrderItemInputSerializer(many=True)
    address = AddressSerializer()

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    class Meta: model = OrderItem; fields = ["product","qty","price_cents"]

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    class Meta:
        model = Order
        fields = ["id","created_at","full_name","email","phone","line1","city","country","zip","total_cents","status","items"]
