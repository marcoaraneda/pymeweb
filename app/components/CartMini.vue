<template>
  <div class="relative">
    🛒 {{ cart.totalItems }}
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart'
const cart = useCartStore()
</script>
