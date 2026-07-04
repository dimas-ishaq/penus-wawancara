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
      <div v-if="show" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
        <div class="absolute inset-0 bg-black/75 backdrop-blur-sm" @click="emit('close')"></div>

        <div class="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
          <div class="p-6 sm:p-8">
            <div class="mb-4 flex items-center gap-3">
              <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600 shrink-0">
                <span class="material-symbols-outlined text-2xl">warning</span>
              </div>
              <div class="min-w-0">
                <h3 class="truncate text-xl sm:text-2xl font-black text-slate-900">{{ title }}</h3>
                <p class="mt-1 text-sm text-slate-500">{{ message }}</p>
              </div>
            </div>

            <slot />

            <div class="mt-8 flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
              <button
                type="button"
                @click="emit('close')"
                class="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 font-bold text-slate-700 shadow-sm hover:bg-slate-50 active:scale-[0.99]"
              >
                {{ cancelText || 'Batal' }}
              </button>
              <button
                type="button"
                @click="emit('confirm')"
                :disabled="processing"
                class="inline-flex h-12 items-center justify-center rounded-2xl px-5 font-black text-white shadow-lg active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 min-w-[160px]"
                :class="{
                  'bg-slate-900 hover:bg-slate-800': variant !== 'error' && variant !== 'success',
                  'bg-red-600 hover:bg-red-700': variant === 'error',
                  'bg-emerald-600 hover:bg-emerald-700': variant === 'success'
                }"
              >
                <span v-if="processing" class="material-symbols-outlined animate-spin text-sm mr-2">sync</span>
                <span>{{ confirmText || 'Konfirmasi' }}</span>
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
