<script setup lang="ts">
const props = defineProps<{
  show: boolean
  title: string
  message: string
  processing?: boolean
  confirmText?: string
  cancelText?: string
  variant?: 'primary' | 'error' | 'success'
}>()

const emit = defineEmits(['close', 'confirm'])
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="show" class="fixed inset-0 z-[200] flex items-center justify-center p-6">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/80 backdrop-blur-md" @click="emit('close')"></div>

        <!-- Modal Content -->
        <div class="relative bg-surface w-full max-w-2xl rounded-[2.5rem] shadow-2xl border border-outline-variant/20 overflow-hidden animate-zoom-in">
          <div class="p-8">
            <h3 class="text-2xl font-black text-primary font-headline mb-2">{{ title }}</h3>
            <p class="text-on-surface-variant font-body text-sm mb-6">
              {{ message }}
            </p>

            <slot />

            <div class="flex justify-end gap-3 pt-8">
              <button 
                type="button" 
                @click="emit('close')"
                class="px-6 py-4 bg-surface-container-high text-primary font-black rounded-2xl hover:bg-surface-container-highest transition-all font-headline tracking-widest uppercase text-xs"
              >
                {{ cancelText || 'Batal' }}
              </button>
              <button 
                type="button" 
                @click="emit('confirm')"
                :disabled="processing"
                class="px-8 py-4 font-black rounded-2xl transition-all shadow-lg font-headline tracking-widest uppercase text-xs"
                :class="{
                  'bg-primary text-white shadow-primary/20 hover:bg-primary/90': variant !== 'error' && variant !== 'success',
                  'bg-error text-white shadow-error/20 hover:bg-error/90': variant === 'error',
                  'bg-success text-white shadow-success/20 hover:bg-success/90': variant === 'success'
                }"
              >
                <span v-if="processing" class="material-symbols-outlined animate-spin text-sm mr-2">sync</span>
                {{ confirmText || 'Konfirmasi' }}
              </button>
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
