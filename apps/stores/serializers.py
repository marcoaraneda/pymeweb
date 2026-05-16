from django.utils.text import slugify
from rest_framework import serializers

from .models import Store


class StoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Store
        fields = [
            "id",
            "name",
            "slug",
            "description",
            "about",
            "contact_email",
            "phone",
            "whatsapp",
            "address",
            "is_active",
            "logo_url",
            # Agregados (Extras precios)
            "extra_size_large_price",
            "extra_fries_medium_price",
            "extra_fries_large_price",
            "extra_drink_price",
            "extra_sauce_price",
            # Envío
            "delivery_fee_mode",
            "shipping_base_fee",
            "shipping_per_item_fee",
            "shipping_free_over",
            # Retiro
            "pickup_skip_queue_enabled",
            "pickup_instructions",
            # Redes Sociales
            "social_instagram",
            "social_facebook",
            "social_tiktok",
            "social_youtube",
        ]
        read_only_fields = ["is_active"]
        extra_kwargs = {"slug": {"required": False}}

    def create(self, validated_data):
        base_slug = validated_data.get("slug") or slugify(validated_data.get("name", ""))
        slug = base_slug or "store"

        # Garantiza unicidad incrementando sufijo si existe.
        counter = 1
        while Store.objects.filter(slug=slug).exists():
            slug = f"{base_slug}-{counter}"
            counter += 1

        validated_data["slug"] = slug
        return super().create(validated_data)