<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { usePage } from '@inertiajs/vue3'
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
  <div class="min-h-screen bg-surface flex text-on-surface selection:bg-primary/10 selection:text-primary">
    <Sidebar :is-open="isSidebarOpen" @close="isSidebarOpen = false" />

    <!-- Main Content -->
    <div class="flex-grow flex flex-col min-h-screen relative overflow-x-hidden">
      <!-- Top Header -->
      <header class="h-20 border-b border-outline-variant/30 flex items-center justify-between px-8 bg-surface/80 backdrop-blur-md sticky top-0 z-40">
        <div class="flex items-center gap-4">
          <button @click="isSidebarOpen = true" class="lg:hidden text-primary w-10 h-10 rounded-full hover:bg-primary/5 flex items-center justify-center transition-colors">
            <span class="material-symbols-outlined">menu</span>
          </button>
          <div class="bg-surface-container-low px-4 py-2 rounded-xl flex items-center gap-3 border border-outline-variant/20 group focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <span class="material-symbols-outlined text-outline text-xl group-focus-within:text-primary transition-colors">search</span>
            <input type="text" placeholder="Cari data siswa..." class="bg-transparent border-none outline-none text-sm font-body text-primary placeholder:text-outline-variant w-48 sm:w-64" />
          </div>
        </div>
        
        <div class="flex items-center gap-6">
          <!-- Theme Toggle -->
          <button @click="toggleTheme" 
            class="w-10 h-10 rounded-full bg-surface-container-low border border-outline-variant/20 flex items-center justify-center text-primary hover:bg-primary/5 transition-all shadow-sm">
            <span class="material-symbols-outlined text-xl">{{ isDark ? 'light_mode' : 'dark_mode' }}</span>
          </button>

          <div class="relative">
            <span class="material-symbols-outlined text-on-surface-variant">notifications</span>
            <div class="absolute -top-1 -right-1 w-2 h-2 bg-error rounded-full ring-2 ring-surface"></div>
          </div>
          <div class="h-8 w-px bg-outline-variant/30"></div>
          <div class="text-right flex flex-col justify-center">
            <span class="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest leading-none mb-1">Current Session</span>
            <span class="text-xs font-bold text-primary leading-none uppercase">TA {{ page.props.academicYear || '2024/2025' }}</span>
          </div>
        </div>
      </header>

      <main class="p-8 flex-grow overflow-x-hidden">
        <slot />
      </main>

      <Toaster position="top-right" rich-colors />
    </div>
  </div>
</template>
