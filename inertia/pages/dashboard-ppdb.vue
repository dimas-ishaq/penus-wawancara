<script setup lang="ts">
import { Head } from '@inertiajs/vue3'

const registrationSteps = [
  { id: 1, name: 'Pendaftaran Online', status: 'completed', description: 'Data diri telah diverifikasi' },
  { id: 2, name: 'Unggah Dokumen', status: 'current', description: '3 dari 5 dokumen diverifikasi' },
  { id: 3, name: 'Ujian Seleksi & Wawancara', status: 'upcoming', description: 'Menunggu jadwal resmi' },
  { id: 4, name: 'Pengumuman Hasil', status: 'upcoming', description: 'Akan diumumkan Juli 2024' },
  { id: 5, name: 'Daftar Ulang', status: 'upcoming', description: 'Tahap akhir administrasi' },
]

const documents = [
  { name: 'Kartu Keluarga', status: 'verified', icon: 'groups' },
  { name: 'Ijazah / SKL', status: 'pending', icon: 'description' },
  { name: 'Akte Kelahiran', status: 'verified', icon: 'child_care' },
  { name: 'Pas Foto 3x4', status: 'missing', icon: 'add_a_photo' },
  { name: 'Rapor Semester 1-5', status: 'verified', icon: 'auto_stories' },
]
</script>

<template>
  <Head title="Portal PPDB - SMK Plus Pelita Nusantara" />

  <main class="max-w-7xl mx-auto px-8 py-12">
    <!-- Hero / Header Section -->
    <header class="mb-12">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div class="space-y-2">
          <div class="flex items-center gap-2">
            <span class="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full tracking-wider uppercase">Tahun Ajaran 2024/2025</span>
            <span class="px-3 py-1 bg-secondary-fixed text-on-secondary-fixed text-xs font-bold rounded-full tracking-wider uppercase">ID: PN240891</span>
          </div>
          <h1 class="text-5xl font-black text-primary tracking-tighter font-headline">Portal Calon Siswa Baru</h1>
          <p class="text-on-surface-variant max-w-xl font-body leading-relaxed">
            Selamat datang di gerbang masa depan Anda, <span class="font-bold text-primary">Aditya Rahman</span>. Pantau seluruh proses pendaftaran Anda secara transparan di sini.
          </p>
        </div>
        <div class="flex items-center gap-4">
          <button class="px-6 py-3 bg-surface-container-high text-primary font-bold rounded-xl flex items-center gap-2 hover:bg-surface-container-highest transition-colors font-body">
            <span class="material-symbols-outlined">print</span>
            Cetak Kartu Peserta
          </button>
        </div>
      </div>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <!-- Left Column: Registration Journey -->
      <aside class="lg:col-span-4 space-y-8">
        <div class="bg-surface-container-low rounded-3xl p-8 shadow-sm border border-outline-variant/10">
          <h2 class="text-xl font-bold text-primary mb-8 font-headline flex items-center gap-2">
            <span class="material-symbols-outlined text-secondary">trending_up</span>
            Progres Pendaftaran
          </h2>
          <div class="space-y-8 relative">
            <!-- Timeline Line -->
            <div class="absolute left-4 top-2 bottom-2 w-0.5 bg-outline-variant/30"></div>
            
            <div v-for="step in registrationSteps" :key="step.id" class="relative flex gap-6 group">
              <div 
                class="w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 transition-all"
                :class="{
                  'bg-primary text-white scale-110 shadow-lg shadow-primary/20': step.status === 'completed',
                  'bg-secondary text-on-secondary ring-4 ring-secondary/20 scale-110': step.status === 'current',
                  'bg-surface-container-highest text-outline': step.status === 'upcoming'
                }"
              >
                <span v-if="step.status === 'completed'" class="material-symbols-outlined text-sm">check</span>
                <span v-else class="text-xs font-bold">{{ step.id }}</span>
              </div>
              <div class="pb-2">
                <h3 class="font-bold text-sm uppercase tracking-wider mb-1" :class="step.status === 'upcoming' ? 'text-outline' : 'text-primary'">
                  {{ step.name }}
                </h3>
                <p class="text-xs font-body text-on-surface-variant leading-snug">
                  {{ step.description }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Major Selection Preview -->
        <div class="bg-primary text-on-primary rounded-3xl p-8 relative overflow-hidden group">
          <div class="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <span class="material-symbols-outlined text-9xl">terminal</span>
          </div>
          <div class="relative z-10">
            <span class="text-[10px] font-bold tracking-[0.2em] uppercase opacity-70 mb-2 block">Pilihan Jurusan Utama</span>
            <h3 class="text-2xl font-black font-headline mb-4">Rekayasa Perangkat Lunak</h3>
            <p class="text-sm text-white/70 leading-relaxed font-body mb-6">Fokus pada pengembangan software, mobile apps, dan AI engineering.</p>
            <div class="flex items-center gap-2 text-xs font-bold bg-white/10 w-fit px-3 py-1 rounded-full">
              <span class="material-symbols-outlined text-sm">verified</span>
              Kuota Tersedia: 45/120
            </div>
          </div>
        </div>
      </aside>

      <!-- Right Column: Documents & Announcements -->
      <section class="lg:col-span-8 space-y-8">
        <!-- Document Center -->
        <div class="bg-surface-container-lowest rounded-3xl p-8 editorial-shadow border border-outline-variant/10">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h2 class="text-2xl font-bold text-primary font-headline">Pusat Kelengkapan Berkas</h2>
              <p class="text-sm text-on-surface-variant font-body">Pastikan seluruh dokumen asli diunggah dengan format yang jelas.</p>
            </div>
            <button class="bg-secondary-container text-on-secondary-container px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:brightness-95 transition-all">
              <span class="material-symbols-outlined">upload_file</span>
              Unggah Dokumen Baru
            </button>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="doc in documents" :key="doc.name" class="p-5 rounded-2xl border-2 transition-all hover:border-primary/20 group"
              :class="doc.status === 'verified' ? 'bg-surface border-transparent' : doc.status === 'pending' ? 'bg-surface-container-low border-secondary/20' : 'bg-error-container/5 border-error/10'"
            >
              <div class="flex justify-between items-start mb-4">
                <div 
                  class="w-10 h-10 rounded-xl flex items-center justify-center"
                  :class="doc.status === 'verified' ? 'bg-primary/10 text-primary' : doc.status === 'pending' ? 'bg-secondary/10 text-secondary' : 'bg-error/10 text-error'"
                >
                  <span class="material-symbols-outlined">{{ doc.icon }}</span>
                </div>
                <div class="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest"
                  :class="doc.status === 'verified' ? 'bg-primary text-white' : doc.status === 'pending' ? 'bg-secondary text-on-secondary' : 'bg-error text-white'"
                >
                  {{ doc.status }}
                </div>
              </div>
              <h4 class="font-bold text-sm text-primary mb-1">{{ doc.name }}</h4>
              <p class="text-[10px] text-on-surface-variant uppercase font-bold tracking-tighter">Terakhir diupdate: 12 Mei</p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Next Event Card -->
          <div class="bg-surface-container-low rounded-3xl p-8 border border-outline-variant/10 relative overflow-hidden group">
            <div class="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform">
              <span class="material-symbols-outlined text-8xl text-secondary">event</span>
            </div>
            <h3 class="text-lg font-bold text-primary mb-6 font-headline flex items-center gap-2">
              <span class="material-symbols-outlined text-secondary">notifications_active</span>
              Agenda Terdekat
            </h3>
            <div class="space-y-4">
              <div>
                <span class="text-[10px] font-bold text-outline uppercase tracking-widest block mb-1">JADWAL WAWANCARA TERSELEKSI</span>
                <p class="text-lg font-black text-primary font-headline">Kamis, 15 Juni 2024</p>
              </div>
              <div class="flex items-center gap-6">
                <div>
                  <span class="text-[10px] font-bold text-outline uppercase tracking-widest block mb-1">JAM</span>
                  <p class="font-bold text-primary">09:00 WIB</p>
                </div>
                <div>
                  <span class="text-[10px] font-bold text-outline uppercase tracking-widest block mb-1">RUANG</span>
                  <p class="font-bold text-primary">Lab-02</p>
                </div>
              </div>
              <button class="mt-4 text-xs font-bold text-secondary flex items-center gap-1 hover:gap-2 transition-all">
                LIHAT DETAIL JADWAL <span class="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>

          <!-- Payment Status Card -->
          <div class="bg-surface-container-high rounded-3xl p-8 border border-outline-variant/10 flex flex-col justify-between">
            <div>
              <h3 class="text-lg font-bold text-primary mb-6 font-headline flex items-center gap-2">
                <span class="material-symbols-outlined text-secondary">payments</span>
                Status Pembayaran
              </h3>
              <div class="space-y-4">
                <div class="flex justify-between items-end">
                  <span class="text-xs font-bold text-on-surface-variant uppercase">Biaya Pendaftaran</span>
                  <span class="text-xl font-black text-primary font-headline italic">LUNAS</span>
                </div>
                <div class="h-2 bg-surface-container rounded-full overflow-hidden">
                  <div class="h-full bg-primary w-full"></div>
                </div>
                <p class="text-[10px] text-on-surface-variant leading-relaxed">Terima kasih. Kwitansi digital telah dikirimkan ke email Anda.</p>
              </div>
            </div>
            <button class="mt-6 w-full py-2 bg-white text-primary text-xs font-bold rounded-xl shadow-sm hover:bg-white/80 transition-all border border-outline-variant/20">
              UNDUH BUKTI BAYAR
            </button>
          </div>
        </div>

        <!-- Help Section -->
        <div class="bg-tertiary text-on-tertiary rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div class="flex items-center gap-6">
            <div class="w-16 h-16 bg-on-tertiary-container rounded-2xl flex items-center justify-center">
              <span class="material-symbols-outlined text-3xl text-tertiary">support_agent</span>
            </div>
            <div>
              <h3 class="text-xl font-black font-headline tracking-tight">Butuh bantuan teknis?</h3>
              <p class="text-sm text-white/70 font-body">Tim Admin kami siap membantu proses pendaftaran Anda.</p>
            </div>
          </div>
          <a href="https://wa.me/12345678" class="px-8 py-3 bg-white text-tertiary font-black rounded-full text-sm hover:scale-95 transition-transform flex items-center gap-2">
            HUBUNGI WHATSAPP
            <span class="material-symbols-outlined text-lg">chat</span>
          </a>
        </div>
      </section>
    </div>
  </main>
</template>
