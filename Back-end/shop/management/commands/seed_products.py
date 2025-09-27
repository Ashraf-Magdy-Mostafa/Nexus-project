
from django.core.management.base import BaseCommand
from shop.models import Category, Product
import random

CATS = ["Phones","Laptops","Audio","Wearables","Gaming","Home","Cameras"]

class Command(BaseCommand):
    help = "Seed categories and products"

    def handle(self, *args, **kwargs):
        cats = {}
        for c in CATS:
            obj, _ = Category.objects.get_or_create(name=c, defaults={"slug": c.lower()})
            cats[c] = obj
        if Product.objects.count() >= 100:
            self.stdout.write(self.style.SUCCESS("Products already seeded.")); return
        random.seed(7); products=[]
        for i in range(1,121):
            cat = random.choice(CATS)
            price = round(random.uniform(15,1500),2)
            rating = round(random.uniform(2.5,5.0),1)
            products.append(Product(title=f"{cat} Product {i}", category=cats[cat],
                                    price=price, rating=rating,
                                    thumbnail=f"https://picsum.photos/seed/backend{i}/400/300"))
        Product.objects.bulk_create(products, batch_size=100)
        self.stdout.write(self.style.SUCCESS("Seeded 120 products."))
