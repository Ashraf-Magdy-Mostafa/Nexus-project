
from rest_framework import generics
from django.contrib.auth.models import User
from rest_framework import viewsets, mixins, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.db.models import Q
from django.utils.crypto import get_random_string
from decimal import Decimal
from .models import Category, Product, Order, OrderItem, PaymentIntent
from .serializers import CategorySerializer, ProductSerializer, OrderCreateSerializer, OrderSerializer, RegisterSerializer


@api_view(["GET"])
@permission_classes([AllowAny])
def health(request):
    return Response({"status": "ok"})


class CategoryViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = Category.objects.all().order_by("name")
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]


class ProductViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = Product.objects.select_related("category").all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        qs = super().get_queryset()
        search = self.request.query_params.get("search")
        category = self.request.query_params.get("category")
        sortBy = self.request.query_params.get("sortBy")
        sortDir = self.request.query_params.get("sortDir", "asc")
        if search:
            qs = qs.filter(Q(title__icontains=search) |
                           Q(category__name__icontains=search))
        if category and category.lower() != "all":
            qs = qs.filter(category__name__iexact=category)
        if sortBy in ["price", "rating"]:
            order = "" if sortDir == "asc" else "-"
            qs = qs.order_by(f"{order}{sortBy}", "id")
        else:
            qs = qs.order_by("-id")
        return qs


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]


class OrderViewSet(mixins.CreateModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    queryset = Order.objects.prefetch_related("items__product").all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]  # 🔒 Only logged-in users

    def create(self, request, *args, **kwargs):
        s = OrderCreateSerializer(data=request.data)
        s.is_valid(raise_exception=True)
        data = s.validated_data
        addr = data["address"]
        items = data["items"]
        if not items:
            return Response({"detail": "No items"}, status=400)
        order = Order.objects.create(
            user=request.user,
            full_name=addr["fullName"], email=addr["email"], phone=addr["phone"],
            line1=addr["line1"], city=addr["city"], country=addr["country"], zip=addr["zip"],
            status="created"
        )
        total = 0
        for it in items:
            try:
                p = Product.objects.get(id=it["product_id"])
            except Product.DoesNotExist:
                order.delete()
                return Response({"detail": f"Invalid product {it['product_id']}"}, status=400)
            qty = it["qty"]
            price_cents = int(Decimal(p.price) * 100)
            OrderItem.objects.create(
                order=order, product=p, qty=qty, price_cents=price_cents)
            total += qty * price_cents
        order.total_cents = total
        order.save()
        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_intent(request):
    amount = int(request.data.get("amount_cents", 0))
    currency = request.data.get("currency", "usd")
    if amount <= 0:
        return Response({"detail": "amount_cents must be > 0"}, status=400)
    intent = PaymentIntent.objects.create(
        gateway="stripe", amount_cents=amount, currency=currency,
        client_secret="secret_" + get_random_string(16),
        status="requires_confirmation",
        external_id="pi_" + get_random_string(10)
    )
    return Response({"id": intent.id, "client_secret": intent.client_secret, "status": intent.status})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def confirm_intent(request):
    intent_id = request.data.get("intent_id")
    try:
        intent = PaymentIntent.objects.get(id=intent_id)
    except PaymentIntent.DoesNotExist:
        return Response({"detail": "invalid intent"}, status=404)
    import random
    intent.status = "succeeded" if random.random() > 0.1 else "failed"
    intent.save()
    return Response({"id": intent.id, "status": intent.status})
