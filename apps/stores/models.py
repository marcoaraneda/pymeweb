from django.db import models

# Create your models here.
from django.db import models

class Store(models.Model):
    name = models.CharField(max_length=120)
    slug = models.SlugField(max_length=80, unique=True)
    is_active = models.BooleanField(default=True)
    is_marketplace_store = models.BooleanField(default=False)

    # Branding básico
    logo_url = models.URLField(blank=True)
    description = models.TextField(blank=True)
    about = models.TextField(blank=True)

    # Contacto
    contact_email = models.EmailField(blank=True)
    phone = models.CharField(max_length=30, blank=True)
    whatsapp = models.CharField(max_length=30, blank=True)
    address = models.CharField(max_length=200, blank=True)

    # AGREGADOS - Precios dinámicos para comida rápida
    extra_size_large_price = models.DecimalField(max_digits=8, decimal_places=0, default=1200, help_text="Precio en CLP para tamaño grande")
    extra_fries_medium_price = models.DecimalField(max_digits=8, decimal_places=0, default=900, help_text="Precio en CLP para papas medianas")
    extra_fries_large_price = models.DecimalField(max_digits=8, decimal_places=0, default=1400, help_text="Precio en CLP para papas grandes")
    extra_drink_price = models.DecimalField(max_digits=8, decimal_places=0, default=1000, help_text="Precio en CLP para bebidas")
    extra_sauce_price = models.DecimalField(max_digits=8, decimal_places=0, default=250, help_text="Precio en CLP por unidad de salsa")

    # ENVÍO - Modo y tarifas configurables
    delivery_fee_mode = models.CharField(
        max_length=20,
        choices=[('at_checkout', 'Cobrar en checkout'), ('at_dispatch', 'Cobrar al despacho')],
        default='at_dispatch',
        help_text="Cuándo se cobra el envío"
    )
    shipping_base_fee = models.DecimalField(max_digits=8, decimal_places=0, default=2000, blank=True, null=True, help_text="Tarifa base de envío en CLP")
    shipping_per_item_fee = models.DecimalField(max_digits=8, decimal_places=0, default=200, blank=True, null=True, help_text="Tarifa por item adicional en CLP")
    shipping_free_over = models.DecimalField(max_digits=8, decimal_places=0, blank=True, null=True, help_text="Envío gratis desde este monto en CLP")

    # RETIRO - Configuración de retiro en local
    pickup_skip_queue_enabled = models.BooleanField(default=True, help_text="¿Permite retiro sin espera?")
    pickup_instructions = models.TextField(blank=True, help_text="Instrucciones para retiro en local")

    # REDES SOCIALES
    social_instagram = models.URLField(blank=True, help_text="URL de Instagram")
    social_facebook = models.URLField(blank=True, help_text="URL de Facebook")
    social_tiktok = models.URLField(blank=True, help_text="URL de TikTok")
    social_youtube = models.URLField(blank=True, help_text="URL de YouTube")

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.slug})"
