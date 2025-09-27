
from django.db import models
from django.contrib.auth.models import User

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=110, unique=True)
    def __str__(self): return self.name

class Product(models.Model):
    title = models.CharField(max_length=200)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="products")
    price = models.DecimalField(max_digits=10, decimal_places=2)
    rating = models.DecimalField(max_digits=2, decimal_places=1, default=4.5)
    thumbnail = models.URLField(blank=True)
    def __str__(self): return self.title

class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="orders")
    created_at = models.DateTimeField(auto_now_add=True)
    full_name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=30)
    line1 = models.CharField(max_length=200)
    city = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    zip = models.CharField(max_length=20)
    total_cents = models.PositiveIntegerField(default=0)
    status = models.CharField(max_length=20, default="created") # created|paid|failed

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    qty = models.PositiveIntegerField(default=1)
    price_cents = models.PositiveIntegerField(default=0)

class PaymentIntent(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    gateway = models.CharField(max_length=30) # stripe|paypal
    amount_cents = models.PositiveIntegerField()
    currency = models.CharField(max_length=10, default="usd")
    client_secret = models.CharField(max_length=200, blank=True)
    status = models.CharField(max_length=20, default="requires_confirmation")
    external_id = models.CharField(max_length=100, blank=True)
