<script setup lang="ts">
import { Link, usePage } from '@inertiajs/vue3'

const page = usePage()
</script>

<template>
  <nav class="bg-surface/80 backdrop-blur-md border-b border-outline-variant/30 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
      <!-- Logo -->
      <Link href="/" class="flex items-center gap-3 group">
        <template v-if="page.props.logo">
          <img :src="page.props.logo" class="h-10 w-auto object-contain transition-transform group-hover:scale-105" alt="Logo" />
        </template>
        <div v-else class="w-10 h-10 bg-primary rounded-xl flex items-center justify-center transition-transform group-hover:rotate-6 shadow-lg shadow-primary/20">
          <span class="material-symbols-outlined text-white text-2xl">school</span>
        </div>
        <div class="flex flex-col">
          <span class="text-primary font-headline font-black text-lg leading-none tracking-tight">SMK PLUS</span>
          <span class="text-secondary font-body font-bold text-[10px] tracking-[0.2em] uppercase leading-none">Pelita Nusantara</span>
        </div>
      </Link>

      <!-- Unified Links -->
      <div class="hidden md:flex items-center gap-8">
        <a
          href="#"
          class="text-slate-600 font-medium hover:text-primary transition-all duration-300 font-body"
        >
          Beranda
        </a>
        <a
          href="#wawancara"
          class="text-slate-600 font-medium hover:text-primary transition-all duration-300 font-body"
        >
          Seleksi Wawancara
        </a>
        <a
          href="#kelulusan"
          class="text-slate-600 font-medium hover:text-primary transition-all duration-300 font-body"
        >
          Cek Kelulusan
        </a>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center gap-4">
        <template v-if="page.props.user">
          <Link
            href="/admin/dashboard"
            class="px-6 py-2.5 bg-surface-container-high text-primary font-bold rounded-xl hover:bg-surface-container-highest transition-all font-body"
          >
            Dashboard
          </Link>
          <Link
            href="/logout"
            method="post"
            as="button"
            class="px-6 py-2.5 bg-error/10 text-error font-bold rounded-xl hover:bg-error/20 transition-all font-body"
          >
            Keluar
          </Link>
        </template>
        <template v-else>
          <Link
            href="/login"
            class="px-6 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all shadow-md shadow-primary/10 font-body"
          >
            Login
          </Link>
        </template>
      </div>
    </div>
  </nav>
</template>
