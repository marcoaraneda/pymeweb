<template>
  <div class="mx-auto max-w-md px-4 py-8">
    <div class="relative rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
      <h1 class="text-2xl font-semibold mb-4">Crear cuenta</h1>

      <form @submit.prevent="onSubmit" class="space-y-4">
        <div>
          <label class="block text-sm text-white/80 mb-1">Nombre</label>
          <input v-model="name" type="text" required class="h-11 w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm" />
        </div>

        <div>
          <label class="block text-sm text-white/80 mb-1">Email</label>
          <input v-model="email" type="email" required class="h-11 w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm" />
        </div>

        <div>
          <label class="block text-sm text-white/80 mb-1">Contraseña</label>
          <input v-model="password" type="password" required class="h-11 w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm" />
        </div>

        <div class="flex items-center justify-between">
          <button class="rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-white">Crear cuenta</button>
          <NuxtLink to="/login" class="text-sm text-cyan-200">Ya tengo cuenta</NuxtLink>
        </div>

        <div v-if="message" class="text-sm text-green-400">{{ message }}</div>
        <div v-if="error" class="text-sm text-rose-400">{{ error }}</div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()

const name = ref('')
const email = ref('')
const password = ref('')
const message = ref<string | null>(null)
const error = ref<string | null>(null)

const onSubmit = async () => {
  message.value = null
  error.value = null
  try {
    await $fetch(`${config.public.apiBase}/auth/register/`, {
      method: 'POST',
      body: { name: name.value, email: email.value, password: password.value },
    })
    message.value = 'Cuenta creada. Revisa tu correo o ingresa.'
  } catch (err: any) {
    error.value = err?.message || 'Error al crear cuenta.'
  }
}
</script>

<style scoped>
input { outline: none; }
</style>
