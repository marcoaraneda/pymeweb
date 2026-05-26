<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
      <h2 class="text-2xl font-bold mb-6 text-center">Panel Administrativo</h2>
      <form @submit.prevent="handleLogin" class="space-y-4">
        <input v-model="form.email" type="email" placeholder="Correo electrónico" class="w-full p-3 border rounded-lg" required />
        <input v-model="form.password" type="password" placeholder="Contraseña" class="w-full p-3 border rounded-lg" required />
        
        <div class="flex items-start gap-2 text-xs text-gray-500">
          <input type="checkbox" required id="privacy" class="mt-1" />
          <label for="privacy">Acepto el tratamiento de mis datos personales según la Ley 19.628 de Chile.</label>
        </div>

        <button type="submit" class="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700">
          Entrar al Sistema
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
const auth = useAuthStore()
const form = reactive({ email: '', password: '' })
const handleLogin = async () => {
  try {
    await auth.login(form)
    const slug = useRoute().params.slug
    navigateTo(`/store/${slug}/admin`)
  } catch (e) {
    alert("Credenciales incorrectas")
  }
}
</script>