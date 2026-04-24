<script setup lang="ts">
import { ref } from 'vue'
import { Link, usePage } from '@inertiajs/vue3'

const page = usePage()
const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}
</script>

<template>
  <nav class="bg-surface/80 backdrop-blur-md border-b border-outline-variant/30 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-6 md:px-8 h-20 flex items-center justify-between">
      <!-- Logo -->
      <Link href="/" class="flex items-center gap-3 group shrink-0">
        <template v-if="page.props.logo">
          <img :src="page.props.logo" class="h-10 w-auto object-contain transition-transform group-hover:scale-105"
            alt="Logo" />
        </template>
        <div v-else
          class="w-8 h-8 md:w-10 md:h-10 bg-primary rounded-xl flex items-center justify-center transition-transform group-hover:rotate-6 shadow-lg shadow-primary/20">
          <span class="material-symbols-outlined text-white text-xl md:text-2xl">school</span>
        </div>
        <div class="flex flex-col">
          <span class="text-primary font-headline font-black text-sm md:text-lg leading-none tracking-tight">SMK PLUS PELITA
            NUSANTARA</span>
          <span class="text-secondary font-body font-bold text-[8px] md:text-[10px] tracking-[0.2em] uppercase leading-none">
            Success By Character</span>
        </div>
      </Link>

      <!-- Desktop Links -->
      <div class="hidden lg:flex items-center gap-8">
        <Link href="/" class="text-slate-600 font-medium hover:text-primary transition-all duration-300 font-body">
          Beranda
        </Link>
        <Link href="/#wawancara"
          class="text-slate-600 font-medium hover:text-primary transition-all duration-300 font-body">
          Seleksi Wawancara
        </Link>
        <Link href="/pengumuman-kelulusan"
          class="text-slate-600 font-medium hover:text-primary transition-all duration-300 font-body">
          Cek Kelulusan
        </Link>
      </div>

      <!-- Action Buttons & Hamburger -->
      <div class="flex items-center gap-4">
        <!-- Desktop Actions -->
        <div class="hidden sm:flex items-center gap-4">
          <template v-if="page.props.user">
            <Link href="/admin/dashboard"
              class="px-6 py-2.5 bg-surface-container-high text-primary font-bold rounded-xl hover:bg-surface-container-highest transition-all font-body text-sm">
              Dashboard
            </Link>
            <Link href="/logout" method="post" as="button"
              class="px-6 py-2.5 bg-destructive/10 text-destructive font-bold rounded-xl hover:bg-destructive/20 hover:scale-[1.02] active:scale-[0.98] transition-all font-body flex items-center gap-2 shadow-sm shadow-destructive/5 text-sm">
              <span class="material-symbols-outlined text-sm">logout</span>
              Keluar
            </Link>
          </template>
          <template v-else>
            <Link href="/login"
              class="px-6 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all shadow-md shadow-primary/10 font-body text-sm">
              Login
            </Link>
          </template>
        </div>

        <!-- Hamburger Button -->
        <button @click="toggleMenu" class="lg:hidden text-primary w-10 h-10 rounded-xl hover:bg-primary/5 flex items-center justify-center transition-colors">
          <span class="material-symbols-outlined text-3xl">{{ isMenuOpen ? 'close' : 'menu' }}</span>
        </button>
      </div>
    </div>

    <!-- Mobile Menu Overlay -->
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div v-if="isMenuOpen" class="lg:hidden bg-surface border-b border-outline-variant/30 px-6 py-8 space-y-6">
        <div class="flex flex-col gap-6">
          <Link href="/" @click="isMenuOpen = false" class="text-xl font-bold text-primary font-headline">Beranda</Link>
          <Link href="/#wawancara" @click="isMenuOpen = false" class="text-xl font-bold text-primary font-headline">Seleksi Wawancara</Link>
          <Link href="/pengumuman-kelulusan" @click="isMenuOpen = false" class="text-xl font-bold text-primary font-headline">Cek Kelulusan</Link>
        </div>

        <div class="pt-6 border-t border-outline-variant/30 space-y-4">
          <template v-if="page.props.user">
            <Link href="/admin/dashboard" @click="isMenuOpen = false" class="block w-full text-center px-6 py-4 bg-surface-container-high text-primary font-bold rounded-2xl">Dashboard Admin</Link>
            <Link href="/logout" method="post" as="button" class="block w-full text-center px-6 py-4 bg-destructive text-white font-bold rounded-2xl">Keluar</Link>
          </template>
          <template v-else>
            <Link href="/login" @click="isMenuOpen = false" class="block w-full text-center px-6 py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/20">Login System</Link>
          </template>
        </div>
      </div>
    </transition>
  </nav>
</template>
