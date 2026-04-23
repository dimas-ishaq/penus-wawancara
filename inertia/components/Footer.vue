<script setup lang="ts">
import { Link } from '@adonisjs/inertia/vue'
</script>

<template>
  <footer class="bg-slate-100 w-full rounded-none mt-auto">
    <div class="flex flex-col md:flex-row justify-between items-start px-12 py-16 gap-12 w-full max-w-7xl mx-auto">
      <div class="max-w-md">
        <img
          alt="SMK Plus Pelita Nusantara Logo"
          class="h-12 w-auto object-contain mb-6"
          src="https://lh3.googleusercontent.com/aida/ADBb0ugnjBU_yv7hTsA_zH5ax1CJECq5ruqcSO4XqvzkiEC0GGFxCGSPVw04Q6zNZ1dJywtNXO4H2x30FEbk9EKiM1rozPHu1-enHQEq5ey3xoQZ1kBZmN9SgCrm9v6IkocsFaJDSjmvirxEy1au76cyZ5zhu1HXcIxBwHB72lCmI6j8tiJs2Hhw0fVkCN_dMcoxQJCDpqB2wKftcc9ozghO7eEhsHGEr5vJZyuGSSwunvn_ABNbY_kqFrrHEaFeIzQdt2Bxdk6IFWSB7A"
        />
        <p class="text-slate-500 font-inter text-sm leading-relaxed mb-6">
          Sekolah Menengah Kejuruan yang berfokus pada keunggulan teknologi informasi dan komunikasi, membentuk karakter profesional berlandaskan nilai-nilai luhur bangsa.
        </p>
        <div class="flex gap-4">
          <span class="material-symbols-outlined p-2 bg-slate-200 rounded-full text-indigo-900 cursor-pointer hover:bg-indigo-900 hover:text-white transition-all">social_leaderboard</span>
          <span class="material-symbols-outlined p-2 bg-slate-200 rounded-full text-indigo-900 cursor-pointer hover:bg-indigo-900 hover:text-white transition-all">language</span>
          <span class="material-symbols-outlined p-2 bg-slate-200 rounded-full text-indigo-900 cursor-pointer hover:bg-indigo-900 hover:text-white transition-all">mail</span>
        </div>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-12">
        <div>
          <h5 class="text-indigo-900 font-bold mb-6 text-sm uppercase tracking-widest">Tautan Cepat</h5>
          <ul class="space-y-3">
            <li><Link class="text-slate-500 hover:underline hover:text-amber-700 transition-all text-sm" href="/">Beranda</Link></li>
            <li><Link class="text-slate-500 hover:underline hover:text-amber-700 transition-all text-sm" href="/dashboard-wawancara-ppdb">PPDB</Link></li>
            <li><Link class="text-slate-500 hover:underline hover:text-amber-700 transition-all text-sm" href="/pengumuman-kelulusan">Kelulusan</Link></li>
            <li><Link class="text-slate-500 hover:underline hover:text-amber-700 transition-all text-sm" href="/profil-sekolah">Profil</Link></li>
          </ul>
        </div>
        <div>
          <h5 class="text-indigo-900 font-bold mb-6 text-sm uppercase tracking-widest">Program Keahlian</h5>
          <ul class="space-y-3">
            <li><a class="text-slate-500 hover:underline hover:text-amber-700 transition-all text-sm" href="#">Rekayasa Perangkat Lunak</a></li>
            <li><a class="text-slate-500 hover:underline hover:text-amber-700 transition-all text-sm" href="#">Multimedia & Desain</a></li>
            <li><a class="text-slate-500 hover:underline hover:text-amber-700 transition-all text-sm" href="#">Teknik Komputer Jaringan</a></li>
          </ul>
        </div>
        <div class="col-span-2 md:col-span-1">
          <h5 class="text-indigo-900 font-bold mb-6 text-sm uppercase tracking-widest">Kontak</h5>
          <p class="text-slate-500 text-sm leading-relaxed">
            Jl. Raya Pendidikan No. 123<br/>
            Jawa Barat, Indonesia<br/>
            (021) 1234-5678
          </p>
        </div>
      </div>
    </div>
    <div class="flex flex-col md:flex-row justify-between items-center px-12 py-10 border-t border-slate-200 w-full max-w-7xl mx-auto">
      <span class="text-slate-500 text-xs">© 2024 SMK Plus Pelita Nusantara. Unggul dalam Teknologi, Berakar pada Tradisi.</span>
      <div class="flex gap-6 mt-4 md:mt-0">
        <a class="text-slate-400 text-xs hover:text-indigo-900 transition-colors" href="#">Kebijakan Privasi</a>
        <a class="text-slate-400 text-xs hover:text-indigo-900 transition-colors" href="#">Syarat & Ketentuan</a>
      </div>
    </div>
  </footer>
</template>
