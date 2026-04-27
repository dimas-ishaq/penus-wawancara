<script setup lang="ts">
import { Link, usePage } from '@inertiajs/vue3'

const page = usePage()
</script>

<template>
  <footer class="bg-surface-container-lowest w-full rounded-none mt-auto border-t border-outline-variant/30">
    <div class="flex flex-col md:flex-row justify-between items-start px-12 py-16 gap-12 w-full max-w-7xl mx-auto">
      <div class="max-w-md">
        <Link href="/" class="flex items-center gap-3 mb-6 group shrink-0">
          <template v-if="page.props.logo">
            <img :src="page.props.logo" class="h-10 w-auto object-contain transition-transform group-hover:scale-105"
              alt="Logo" />
          </template>
          <div v-else class="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <span class="material-symbols-outlined text-white text-2xl">school</span>
          </div>
          <div class="flex flex-col">
            <span class="text-primary font-headline font-black text-sm md:text-lg leading-none tracking-tight whitespace-nowrap">{{ page.props.brandName || 'SMK PLUS PELITA NUSANTARA' }}</span>
            <span class="text-secondary font-body font-bold text-[8px] md:text-[10px] tracking-[0.2em] uppercase leading-none"> Success By Character</span>
          </div>
        </Link>
        <p class="text-on-surface-variant font-body text-sm leading-relaxed mb-6">
          Sekolah Menengah Kejuruan yang berfokus pada keunggulan teknologi informasi dan komunikasi, membentuk karakter profesional berlandaskan nilai-nilai luhur bangsa.
        </p>
        <div class="flex gap-4">
          <span class="material-symbols-outlined p-2 bg-surface-container-high rounded-full text-primary cursor-pointer hover:bg-primary hover:text-white transition-all">social_leaderboard</span>
          <span class="material-symbols-outlined p-2 bg-surface-container-high rounded-full text-primary cursor-pointer hover:bg-primary hover:text-white transition-all">language</span>
          <span class="material-symbols-outlined p-2 bg-surface-container-high rounded-full text-primary cursor-pointer hover:bg-primary hover:text-white transition-all">mail</span>
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
        <div>
          <h5 class="text-primary font-headline font-black mb-6 text-sm uppercase tracking-[0.2em]">Tautan Cepat</h5>
          <ul class="space-y-3 font-body">
            <li><Link class="text-on-surface-variant hover:text-primary transition-all text-sm" href="/">Beranda</Link></li>
            <li><Link class="text-on-surface-variant hover:text-primary transition-all text-sm" href="/dashboard-ppdb">PPDB</Link></li>
            <li><Link class="text-on-surface-variant hover:text-primary transition-all text-sm" href="/pengumuman-kelulusan">Kelulusan</Link></li>
            <li><Link class="text-on-surface-variant hover:text-primary transition-all text-sm" href="/profil-sekolah">Profil</Link></li>
          </ul>
        </div>
        <div>
          <h5 class="text-primary font-headline font-black mb-6 text-sm uppercase tracking-[0.2em]">Program Keahlian</h5>
          <ul v-if="page.props.majors && (page.props.majors as any[]).length > 0" class="space-y-3 font-body">
            <li v-for="major in (page.props.majors as any[])" :key="major.id">
              <a class="text-on-surface-variant hover:text-primary transition-all text-sm" href="#">{{ major.name }}</a>
            </li>
          </ul>
          <p v-else class="text-on-surface-variant text-xs font-bold italic opacity-60">Segera hadir...</p>
        </div>
        <div class="col-span-2 md:col-span-1">
          <h5 class="text-primary font-headline font-black mb-6 text-sm uppercase tracking-[0.2em]">Kontak</h5>
          <p class="text-on-surface-variant text-sm leading-relaxed font-body">
            Gg. Olahraga No.20, Ciriung,<br/>
            Kec. Cibinong, Kabupaten Bogor,<br/>
            Jawa Barat 16918
          </p>
        </div>
      </div>
    </div>
    <div class="flex flex-col md:flex-row justify-between items-center px-12 py-10 border-t border-outline-variant/30 w-full max-w-7xl mx-auto">
      <span class="text-on-surface-variant text-xs font-body font-medium">© 2026 SMK PLUS PELITA NUSANTARA. Success By Character.</span>
      <div class="flex gap-6 mt-4 md:mt-0 font-body">
        <a class="text-on-surface-variant/60 text-xs hover:text-primary transition-colors" href="#">Kebijakan Privasi</a>
        <a class="text-on-surface-variant/60 text-xs hover:text-primary transition-colors" href="#">Syarat & Ketentuan</a>
      </div>
    </div>
  </footer>
</template>
