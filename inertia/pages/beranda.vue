<script setup lang="ts">
import { computed } from 'vue'
import { Head, Link, usePage } from '@inertiajs/vue3'
import WawancaraImage from '@/assets/image.png'
import HeroImage from '@/assets/hero.webp'

const page = usePage()
const user = computed(() => page.props.user)

const ppdbSteps = [
  { id: 1, title: 'Registrasi Berkas', desc: 'Lengkapi dokumen administrasi' },
  { id: 2, title: 'Validasi Data', desc: 'Verifikasi kesesuaian dokumen' },
  { id: 3, title: 'Wawancara Utama', desc: 'Seleksi minat, bakat & karakter' },
  { id: 4, title: 'Hasil Seleksi', desc: 'Pengumuman resmi penerimaan' },
]
</script>

<template>
  <Head title="Gerbang Seleksi - SMK Plus Pelita Nusantara" />

  <!-- Hero Section -->
  <section id="hero" class="relative min-h-[90vh] flex items-center overflow-hidden bg-surface-container-lowest">
    <div class="max-w-7xl mx-auto px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center py-20">
      <div class="lg:col-span-7 z-10 space-y-8">
        <div class="space-y-4">
          <span class="text-secondary font-bold tracking-[0.3em] uppercase text-xs mb-2 block font-body animate-fade-in">Success By Character.</span>
          <h1 class="text-6xl md:text-8xl font-black text-primary tracking-tighter leading-[0.9] font-headline">
            Gerbang <br/>
            <span class="bg-red-600 text-white italic px-4">Masa Depan.</span>
          </h1>
        </div>
        <p class="text-on-surface-variant text-lg md:text-xl max-w-xl leading-relaxed font-body">
          Selamat datang di portal resmi SMK Plus Pelita Nusantara. Platform informasi terintegrasi untuk proses seleksi, wawancara, dan pengembangan potensi siswa.
        </p>
        <div class="flex flex-wrap gap-4 pt-4 items-center">
          <Link href="/pengumuman-kelulusan" class="px-8 py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 flex items-center gap-2 group font-body">
            Cek Kelulusan
            <span class="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </Link>
          <div class="px-6 py-3 bg-error/10 border border-error/20 rounded-xl">
             <p class="text-error text-xs font-bold uppercase tracking-widest italic animate-pulse">Pendaftaran Ditutup Sementara</p>
          </div>
        </div>
      </div>
      <div class="lg:col-span-5 relative">
        <div class="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl rotate-2 transition-transform hover:rotate-0 duration-1000">
          <img alt="School building facade" class="w-full aspect-[4/5] object-cover" :src="HeroImage"/>
        </div>
        <div class="absolute -bottom-10 -left-10 w-64 h-64 bg-primary opacity-5 rounded-full blur-3xl -z-10"></div>
        <div class="absolute -top-10 -right-10 w-48 h-48 bg-secondary opacity-20 rounded-full blur-2xl -z-10"></div>
      </div>
    </div>
  </section>

  <!-- Wawancara Section -->
  <section id="wawancara" class="py-32 bg-surface border-y border-outline-variant/30">
    <div class="max-w-7xl mx-auto px-8">
      <div class="flex flex-col md:flex-row gap-16 items-center">
        <div class="md:w-1/2 space-y-10">
          <div>
            <span class="text-secondary font-bold tracking-widest uppercase text-xs mb-2 block font-body">Pusat Informasi Wawancara</span>
            <h2 class="text-5xl font-black text-primary tracking-tighter font-headline leading-tight">Persiapkan Diri <br /> Untuk Wawancara.</h2>
          </div>
          <p class="text-on-surface-variant font-body leading-relaxed text-lg">
            Tahap wawancara adalah kunci utama untuk mengenal minat dan bakat Anda. Pastikan Anda telah melengkapi berkas dan mengecek jadwal sesi Anda secara berkala.
          </p>

          <!-- Steps Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div v-for="step in ppdbSteps" :key="step.id" class="flex gap-4">
              <div class="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center font-headline font-black text-primary border border-outline-variant/20">
                {{ step.id }}
              </div>
              <div class="font-body">
                <h4 class="font-bold text-primary">{{ step.title }}</h4>
                <p class="text-xs text-on-surface-variant italic">{{ step.desc }}</p>
              </div>
            </div>
          </div>

          <Link :href="user ? '/admin/dashboard' : '/login'"
            class="inline-flex px-10 py-5 bg-secondary text-on-secondary font-black rounded-2xl text-lg hover:scale-105 transition-transform font-headline shadow-xl shadow-secondary/20 uppercase">
            {{ user ? 'Masuk Dashboard' : 'Masuk ke Akun' }}
          </Link>
        </div>

        <div class="md:w-1/2 w-full">
          <div class="group relative bg-primary rounded-[3rem] overflow-hidden shadow-2xl h-[500px] flex flex-col justify-end p-10 border border-white/10 transition-all duration-700 hover:-translate-y-2">
            <img :src="WawancaraImage" alt="Interview Experience" class="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-40 mix-blend-overlay" />
            <div class="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent"></div>

            <div class="relative z-10 space-y-6">
              <div class="flex items-center gap-3">
                <span class="w-10 h-10 bg-secondary/20 backdrop-blur-md rounded-full flex items-center justify-center">
                  <span class="material-symbols-outlined text-secondary text-xl">psychology</span>
                </span>
                <span class="text-white/80 font-bold uppercase tracking-[0.2em] text-[10px] font-body">Kembangkan Potensi</span>
              </div>

              <h3 class="text-4xl font-black text-white font-headline leading-[1.1] tracking-tighter">
                Tunjukkan <br />
                <span class="text-secondary italic">Potensi Terbaik</span> <br />
                Anda Hari Ini.
              </h3>

              <p class="text-white/70 font-body text-sm leading-relaxed max-w-xs">
                Tahap wawancara bukan hanya seleksi, tapi jembatan menuju masa depan digital Anda di SMK Plus Pelita Nusantara.
              </p>

              <div class="pt-4 flex items-center gap-4">
                <Link :href="user ? '/admin/dashboard' : '/dashboard-ppdb'"
                  class="px-8 py-4 bg-white text-primary font-black rounded-2xl hover:scale-105 active:scale-95 transition-all font-headline shadow-xl shadow-black/20">
                  MASUK PORTAL
                </Link>
              </div>
            </div>
            <div class="absolute -bottom-20 -right-20 w-64 h-64 bg-secondary/20 rounded-full blur-[100px]"></div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Simplified Stats -->
  <section class="py-24 bg-primary text-on-primary">
    <div class="max-w-7xl mx-auto px-8 grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
      <div class="space-y-2">
        <div class="text-4xl font-black font-headline tracking-tighter">1.500+</div>
        <div class="text-xs font-bold opacity-70 uppercase tracking-widest font-body">Alumni Aktif</div>
      </div>
      <div class="space-y-2">
        <div class="text-4xl font-black font-headline tracking-tighter">45+</div>
        <div class="text-xs font-bold opacity-70 uppercase tracking-widest font-body">Mitra DU/DI</div>
      </div>
      <div class="space-y-2">
        <div class="text-4xl font-black font-headline tracking-tighter">98%</div>
        <div class="text-xs font-bold opacity-70 uppercase tracking-widest font-body">Serapan Kerja</div>
      </div>
      <div class="space-y-2">
        <div class="text-4xl font-black font-headline tracking-tighter">10+</div>
        <div class="text-xs font-bold opacity-70 uppercase tracking-widest font-body">Lembaga Sertifikasi</div>
      </div>
    </div>
  </section>

  <!-- Help Section -->
  <section class="py-32 px-8">
    <div class="max-w-4xl mx-auto bg-surface-container-highest rounded-[2.5rem] p-12 text-center space-y-8 relative overflow-hidden">
      <div class="relative z-10">
        <h2 class="text-3xl font-black text-primary font-headline">Ada kendala atau pertanyaan?</h2>
        <p class="text-on-surface-variant font-body max-w-lg mx-auto leading-relaxed">
          Tim Helpdesk kami siap membantu Anda selama jam operasional sekolah (Senin - Jumat, 08:00 - 15:00 WIB).
        </p>
        <div class="flex flex-wrap justify-center gap-4 pt-4">
          <a href="#" class="px-8 py-4 bg-primary text-white font-bold rounded-xl flex items-center gap-2 font-body">
            Hubungi Customer Service
          </a>
        </div>
      </div>
      <div class="absolute -bottom-10 -right-10 w-48 h-48 bg-secondary opacity-5 rounded-full blur-2xl"></div>
    </div>
  </section>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.8s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

html {
  scroll-behavior: smooth;
}
</style>


<style scoped>
.editorial-shadow {
  box-shadow: 0 40px 100px -20px rgba(0, 6, 102, 0.08);
}

.animate-fade-in {
  animation: fadeIn 0.8s ease-out forwards;
}

.animate-zoom-in {
  animation: zoomIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.animate-shake {
  animation: shake 0.5s cubic-bezier(.36, .07, .19, .97) both;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes zoomIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }

  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes shake {

  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }

  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}

html {
  scroll-behavior: smooth;
}
</style>
