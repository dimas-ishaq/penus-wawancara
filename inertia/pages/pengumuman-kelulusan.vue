<script setup lang="ts">
import { onMounted } from 'vue'
import { router } from '@inertiajs/vue3'

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search)
  const nisn = urlParams.get('nisn')

  // Redirect to home page with the nisn parameter
  router.visit('/', {
    data: nisn ? { nisn } : {},
    replace: true
  })
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-surface-container-lowest">
    <div class="flex flex-col items-center gap-6">
      <div class="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <div class="text-center space-y-2">
        <p class="text-xl font-headline font-black text-primary tracking-tighter uppercase">Sedang Memindahkan...</p>
        <p class="text-sm font-body text-on-surface-variant font-medium">Halaman pengumuman kini terintegrasi di Beranda
        </p>
      </div>
    </div>
  </div>
</template>
