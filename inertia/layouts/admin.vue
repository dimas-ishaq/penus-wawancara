<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { usePage, Link } from '@inertiajs/vue3'
import { Toaster, toast } from 'vue-sonner'
import Sidebar from '../components/Sidebar.vue'
import { watch } from 'vue'

const page = usePage()
const isSidebarOpen = ref(false)
const isSidebarCollapsed = ref(false)
const isDark = ref(false)

// Handle Flash Messages
watch(() => (page.props.flash as any), (flash) => {
  if (flash?.success) {
    toast.success(flash.success)
  }
  if (flash?.error) {
    toast.error(flash.error)
  }
}, { immediate: true, deep: true })

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

const toggleCollapse = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
  localStorage.setItem('sidebar_collapsed', isSidebarCollapsed.value ? 'true' : 'false')
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDark.value = true
    document.documentElement.classList.add('dark')
  }

  const savedCollapse = localStorage.getItem('sidebar_collapsed')
  if (savedCollapse === 'true') {
    isSidebarCollapsed.value = true
  }
})
</script>

<template>
  <div class="min-h-screen bg-background flex text-on-surface selection:bg-primary/10 selection:text-primary transition-colors duration-300">
    <Sidebar :is-open="isSidebarOpen" :collapsed="isSidebarCollapsed" @close="isSidebarOpen = false" />

    <!-- Main Content -->
    <div class="flex-grow flex flex-col min-h-screen relative overflow-x-hidden transition-all duration-500 bg-surface-container-lowest/50">
      <!-- Top Header -->
      <header class="h-20 border-b border-outline-variant/20 flex items-center justify-between px-4 sm:px-8 bg-surface-container-lowest/80 backdrop-blur-xl sticky top-0 z-40 shadow-sm">
        <div class="flex items-center gap-2 sm:gap-4">
          <button @click="isSidebarOpen = true" class="lg:hidden text-primary w-11 h-11 rounded-2xl bg-primary/5 flex items-center justify-center transition-all hover:bg-primary hover:text-white">
            <span class="material-symbols-outlined">menu</span>
          </button>

          <!-- Collapse Toggle (Desktop) -->
          <button @click="toggleCollapse" class="hidden lg:flex text-primary w-11 h-11 rounded-2xl bg-primary/5 items-center justify-center transition-all duration-300 hover:bg-primary/10"
            :class="isSidebarCollapsed ? 'rotate-180' : ''">
            <span class="material-symbols-outlined text-2xl">{{ isSidebarCollapsed ? 'last_page' : 'first_page' }}</span>
          </button>
          
          <Link href="/" class="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-surface-container-high rounded-2xl text-primary hover:bg-primary hover:text-white transition-all text-xs font-black shadow-sm group">
            <span class="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">home</span>
            <span class="hidden md:inline uppercase tracking-widest">Beranda</span>
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
