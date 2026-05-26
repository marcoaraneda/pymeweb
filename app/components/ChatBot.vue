<template>
  <div class="fixed bottom-6 right-6 z-50">
    <button @click="isOpen = !isOpen" class="bg-blue-600 text-white p-4 rounded-full shadow-xl hover:scale-110 transition">
      <MessageCircle v-if="!isOpen" />
      <X v-else />
    </button>

    <div v-if="isOpen" class="absolute bottom-20 right-0 w-80 h-96 bg-white rounded-2xl shadow-2xl border flex flex-col overflow-hidden">
      <div class="bg-blue-600 p-4 text-white font-bold">Asistente Virtual</div>
      
      <div class="flex-1 overflow-y-auto p-4 space-y-3">
        <div v-for="msg in messages" :key="msg.id" 
             :class="['p-3 rounded-lg text-sm max-w-[80%]', msg.role === 'user' ? 'bg-blue-100 ml-auto' : 'bg-gray-100']">
          {{ msg.text }}
        </div>
      </div>

      <div class="p-3 border-t flex gap-2">
        <input v-model="userInput" @keyup.enter="handleSend" placeholder="Pregunta sobre productos..." class="flex-1 text-sm border p-2 rounded-md outline-none" />
        <button @click="handleSend" class="text-blue-600 font-bold px-2">Enviar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { MessageCircle, X } from 'lucide-vue-next'
const { sendMessage } = useChat()
const isOpen = ref(false)
const userInput = ref('')
const messages = ref([{ id: 1, role: 'bot', text: '¡Hola! Soy tu asistente. ¿En qué puedo ayudarte hoy?' }])

const handleSend = async () => {
  if (!userInput.value.trim()) return
  const text = userInput.value
  messages.value.push({ id: Date.now(), role: 'user', text })
  userInput.value = ''
  
  const response = await sendMessage(text)
  messages.value.push({ id: Date.now() + 1, role: 'bot', text: response.answer })
}
</script>
