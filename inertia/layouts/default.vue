<script setup lang="ts">
import { watch } from 'vue'
import { usePage } from '@inertiajs/vue3'
import { toast, Toaster } from 'vue-sonner'
import type { Data } from '@generated/data'
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'

const page = usePage<Data.SharedProps>()

watch(
  () => page.url,
  () => toast.dismiss()
)

watch(
  () => page.props.flash,
  (flashMessages) => {
    if (flashMessages.error) {
      toast.error(flashMessages.error)
    }
    if (flashMessages.success) {
      toast.success(flashMessages.success)
    }
  },
  { immediate: true }
)
</script>

<template>
  <div class="min-h-screen flex flex-col bg-surface text-on-surface selection:bg-secondary-container selection:text-on-secondary-container">
    <Navbar />

    <main class="flex-grow">
      <slot />
    </main>

    <Footer />

    <Toaster position="top-center" rich-colors />
  </div>
</template>
