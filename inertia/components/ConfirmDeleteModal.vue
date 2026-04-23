<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  show: boolean
  title: string
  description: string
  itemName?: string
  processing?: boolean
}>()

const emit = defineEmits(['close', 'confirm'])

const confirmText = ref('')
const error = ref(false)

watch(() => props.show, (newVal) => {
  if (newVal) {
    confirmText.value = ''
    error.value = false
  }
})

const handleConfirm = () => {
  if (confirmText.value.toLowerCase() === 'hapus') {
    emit('confirm')
  } else {
    error.value = true
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="show" class="fixed inset-0 z-[200] flex items-center justify-center p-6">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/80 backdrop-blur-md" @click="emit('close')"></div>

        <!-- Modal Content -->
        <div class="relative bg-surface w-full max-w-md rounded-[2.5rem] shadow-2xl border border-outline-variant/20 overflow-hidden animate-zoom-in">
          <div class="p-8">
            <!-- Icon -->
            <div class="w-16 h-16 bg-error/10 rounded-2xl flex items-center justify-center text-error mb-6 mx-auto">
              <span class="material-symbols-outlined text-3xl">warning</span>
            </div>

            <h3 class="text-2xl font-black text-primary font-headline text-center mb-2">{{ title }}</h3>
            <p class="text-on-surface-variant font-body text-center text-sm mb-8">
              {{ description }} <br v-if="itemName">
              <span v-if="itemName" class="font-black text-error italic">"{{ itemName }}"</span>
            </p>

            <div class="space-y-4">
              <div class="space-y-2">
                <label class="text-[10px] font-black text-outline uppercase tracking-widest ml-1">
                  Ketik <span class="text-error">"hapus"</span> untuk konfirmasi
                </label>
                <input 
                  v-model="confirmText" 
                  type="text" 
                  placeholder="Ketik di sini..."
                  class="w-full bg-surface-container-low border-2 border-transparent rounded-2xl px-6 py-4 text-primary font-bold focus:border-error focus:bg-surface-container-lowest transition-all outline-none text-center"
                  :class="{ 'border-error/50': error }"
                  @keyup.enter="handleConfirm"
                />
                <p v-if="error" class="text-[10px] text-error font-bold text-center uppercase tracking-tighter">
                  Teks konfirmasi tidak sesuai
                </p>
              </div>

              <div class="flex gap-3 pt-4">
                <button 
                  type="button" 
                  @click="emit('close')"
                  class="flex-1 py-4 bg-surface-container-high text-primary font-black rounded-2xl hover:bg-surface-container-highest transition-all font-headline tracking-widest uppercase text-xs"
                >
                  Batal
                </button>
                <button 
                  type="button" 
                  @click="handleConfirm"
                  :disabled="confirmText.toLowerCase() !== 'hapus' || processing"
                  class="flex-1 py-4 bg-error text-white font-black rounded-2xl hover:bg-error/90 disabled:opacity-30 disabled:grayscale transition-all shadow-lg shadow-error/20 font-headline tracking-widest uppercase text-xs"
                >
                  <span v-if="processing" class="material-symbols-outlined animate-spin text-sm">sync</span>
                  <span v-else>Hapus Data</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.animate-zoom-in {
  animation: zoomIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@keyframes zoomIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>
