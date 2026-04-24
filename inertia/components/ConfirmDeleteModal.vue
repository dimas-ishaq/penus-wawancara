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
    setTimeout(() => {
      error.value = false
    }, 400)
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
        <div class="relative bg-card w-full max-w-md rounded-[3rem] shadow-[0_20px_50px_rgba(220,38,38,0.15)] border-2 border-red-600 overflow-hidden animate-zoom-in">
          <!-- Premium Top Bar -->
          <div class="h-2 w-full bg-red-600"></div>

          <div class="p-10">
            <!-- Icon with Glow -->
            <div class="relative w-20 h-20 mx-auto mb-8">
              <div class="absolute inset-0 bg-red-600/10 blur-2xl rounded-full animate-pulse"></div>
              <div class="relative w-full h-full bg-red-600 text-white rounded-[2.2rem] flex items-center justify-center shadow-lg shadow-red-600/20">
                <span class="material-symbols-outlined text-4xl">warning</span>
              </div>
            </div>

            <h3 class="text-3xl font-black text-red-600 font-headline text-center mb-3 tracking-tighter uppercase leading-none">{{ title }}</h3>
            <p class="text-on-surface-variant font-body text-center text-[13px] leading-relaxed mb-10 px-4">
              {{ description }}
              <span v-if="itemName" class="block mt-3 font-black text-red-600 text-sm px-4 py-3 bg-red-50 rounded-2xl border border-red-100 italic">
                "{{ itemName }}"
              </span>
            </p>

            <div class="space-y-6">
              <div class="space-y-3" :class="{ 'animate-shake': error }">
                <div class="flex justify-between items-center px-2">
                  <label class="text-[10px] font-black text-outline uppercase tracking-[0.2em]">
                    Konfirmasi Keamanan
                  </label>
                  <span class="text-[9px] font-black text-red-600 uppercase px-2 py-0.5 bg-red-50 rounded-md">Wajib</span>
                </div>
                <div class="relative group">
                  <input 
                    v-model="confirmText" 
                    type="text" 
                    placeholder='Ketik "hapus" untuk konfirmasi'
                    class="w-full bg-surface-container-low border-2 border-outline-variant/10 rounded-2xl px-6 py-4 text-primary font-black placeholder:text-outline-variant/30 placeholder:font-bold tracking-widest text-center outline-none focus:border-red-600 focus:bg-white transition-all shadow-inner"
                    :class="{ 'border-red-600 bg-red-50': error }"
                    @keyup.enter="handleConfirm"
                  />
                </div>
                <p v-if="error" class="text-[10px] text-red-600 font-black text-center uppercase tracking-widest mt-2 animate-fade-in">
                  Verifikasi teks tidak sesuai
                </p>
              </div>

              <div class="flex gap-4 pt-4">
                <button 
                  type="button" 
                  @click="emit('close')"
                  class="flex-1 py-4 bg-surface-container-high text-primary font-black rounded-2xl hover:bg-surface-container-highest transition-all font-headline tracking-[0.2em] uppercase text-[10px] border border-outline-variant/10"
                >
                  Batalkan
                </button>
                <button 
                  type="button" 
                  @click="handleConfirm"
                  :disabled="confirmText.toLowerCase() !== 'hapus' || processing"
                  class="flex-1 py-4 bg-red-600 text-white font-black rounded-2xl hover:bg-red-700 disabled:opacity-30 disabled:grayscale transition-all shadow-xl shadow-red-600/20 font-headline tracking-[0.2em] uppercase text-[10px] flex items-center justify-center gap-2 group"
                >
                  <span v-if="processing" class="material-symbols-outlined animate-spin text-sm">sync</span>
                  <span v-else class="flex items-center gap-2">
                    Ekseskusi Hapus
                    <span class="material-symbols-outlined text-sm group-hover:scale-125 transition-transform">delete_forever</span>
                  </span>
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
  animation: zoomIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.animate-shake {
  animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
}

@keyframes zoomIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes shake {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
  40%, 60% { transform: translate3d(4px, 0, 0); }
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out forwards;
}
</style>
