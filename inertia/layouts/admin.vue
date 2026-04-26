<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { usePage, Link } from '@inertiajs/vue3'
import { Toaster } from 'vue-sonner'
import Sidebar from '../components/Sidebar.vue'

const page = usePage()
const isSidebarOpen = ref(false)
const isDark = ref(false)

const toggleTheme = () => {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDark.value = true
    document.documentElement.classList.add('dark')
  }
})
</script>

<template>
  <div class="min-h-screen bg-background flex text-on-surface selection:bg-primary/10 selection:text-primary transition-colors duration-300">
    <Sidebar :is-open="isSidebarOpen" @close="isSidebarOpen = false" />

    <!-- Main Content -->
    <div class="flex-grow flex flex-col min-h-screen relative overflow-x-hidden">
      <!-- Top Header -->
      <header class="h-20 border-b border-outline-variant/30 flex items-center justify-between px-4 sm:px-8 bg-background/80 backdrop-blur-md sticky top-0 z-40">
        <div class="flex items-center gap-2 sm:gap-4">
          <button @click="isSidebarOpen = true" class="lg:hidden text-primary w-10 h-10 rounded-full hover:bg-primary/5 flex items-center justify-center transition-colors">
            <span class="material-symbols-outlined">menu</span>
          </button>
          
          <Link href="/" class="hidden sm:flex items-center gap-2 px-3 sm:px-4 py-2 bg-surface-container-high rounded-xl text-primary hover:bg-primary hover:text-white transition-all text-xs font-bold shadow-sm group">
            <span class="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">home</span>
            <span class="hidden md:inline">Beranda</span>
          </Link>
        </div>
        
        <div class="flex items-center gap-3 sm:gap-6">
          <!-- Theme Toggle -->
          <button @click="toggleTheme" 
            class="w-10 h-10 rounded-full bg-surface-container-low border border-outline-variant/20 flex items-center justify-center text-primary hover:bg-primary/5 transition-all shadow-sm">
            <span class="material-symbols-outlined text-xl">{{ isDark ? 'light_mode' : 'dark_mode' }}</span>
          </button>

          <div class="relative hidden xs:block">
            <span class="material-symbols-outlined text-on-surface-variant">notifications</span>
            <div class="absolute -top-1 -right-1 w-2 h-2 bg-error rounded-full ring-2 ring-surface"></div>
          </div>
          <div class="h-8 w-px bg-outline-variant/30 hidden xs:block"></div>
          <div class="text-right flex flex-col justify-center">
            <span class="text-[9px] sm:text-[10px] text-on-surface-variant font-bold uppercase tracking-widest leading-none mb-1">Session</span>
            <span class="text-[10px] sm:text-xs font-bold text-primary leading-none uppercase">TA {{ page.props.academicYear || '2026/2027' }}</span>
          </div>
        </div>
      </header>

      <main class="p-4 sm:p-6 lg:p-8 flex-grow overflow-x-hidden">
        <slot />
      </main>

      <Toaster position="top-right" rich-colors />
    </div>
  </div>
</template>
