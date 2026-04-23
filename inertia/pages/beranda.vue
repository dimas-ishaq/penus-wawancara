<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Head, Link, usePage, router } from '@inertiajs/vue3'
import HeroImage from '@/assets/hero.webp'
import WawancaraImage from '@/assets/image.png'
import LogoPenus from '@/assets/logo_penus.png'

const page = usePage()
const user = computed(() => page.props.user)
const announcementDate = computed(() => page.props.announcementDate as string | undefined)

const now = ref(new Date())
let timer: any = null

onMounted(() => {
  timer = setInterval(() => {
    now.value = new Date()
  }, 1000)

  // Auto-trigger if nisn is in query params
  const urlParams = new URLSearchParams(window.location.search)
  const nisnParam = urlParams.get('nisn')
  if (nisnParam) {
    nisnQuery.value = nisnParam
    handleSearch()
  }
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

const targetDate = computed(() => announcementDate.value ? new Date(announcementDate.value) : null)
const isReleased = computed(() => {
  if (!targetDate.value) return true
  const tDate = targetDate.value
  return now.value >= tDate
})

const countdown = computed(() => {
  if (!targetDate.value || isReleased.value) return null

  const diff = targetDate.value.getTime() - now.value.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  return [
    { val: days, label: 'Hari' },
    { val: hours, label: 'Jam' },
    { val: minutes, label: 'Menit' },
    { val: seconds, label: 'Detik' }
  ]
})

const nisnQuery = ref('')
const isChecking = ref(false)
const result = ref<any>(null)
const error = ref<string | null>(null)
const showResultModal = ref(false)

const handleSearch = async () => {
  if (!nisnQuery.value) return

  isChecking.value = true
  error.value = null

  try {
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')

    const response = await fetch('/pengumuman-kelulusan/check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRF-TOKEN': csrfToken || '',
      },
      body: JSON.stringify({ nisn: nisnQuery.value })
    })

    const data = await response.json()

    if (!response.ok) {
      error.value = data.error || 'Terjadi kesalahan saat mengecek data.'
    } else {
      result.value = data
      showResultModal.value = true

      // Trigger confetti celebration for "Lulus" status
      if (data.status === 'Lulus') {
        const triggerConfetti = async () => {
          try {
            const confetti = (await import('https://esm.run/canvas-confetti')).default
            confetti({
              particleCount: 300,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#00639B', '#4C606E', '#FFFFFF'],
              zIndex: 9999
            })
          } catch (e) { }
        }
        triggerConfetti()
      }
    }
  } catch (err) {
    error.value = 'Gagal menghubungkan ke server. Silakan coba lagi.'
  } finally {
    isChecking.value = false
  }
}

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
  <!-- <section id="hero" class="relative min-h-[90vh] flex items-center overflow-hidden">
    <div class="max-w-7xl mx-auto px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center py-20">
      <div class="lg:col-span-7 z-10 space-y-8">
        <div class="space-y-4">
          <span class="text-secondary font-bold tracking-[0.3em] uppercase text-xs mb-2 block font-body animate-fade-in">Pusat Informasi Seleksi</span>
          <h1 class="text-6xl md:text-8xl font-black text-primary tracking-tighter leading-[0.9] font-headline">
            Gerbang <br/>
            <span class="bg-red-600 text-white italic">Masa Depan.</span>
          </h1>
        </div>
        <p class="text-on-surface-variant text-lg md:text-xl max-w-xl leading-relaxed font-body">
          Selamat datang di portal resmi SMK Plus Pelita Nusantara. Platform informasi terintegrasi untuk proses seleksi, wawancara, dan pengumuman hasil kelulusan.
        </p>
        <div class="flex flex-wrap gap-4 pt-4">
          <a href="#wawancara" class="px-8 py-4 bg-primary text-white font-bold rounded-2xl flex items-center gap-2 hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 group font-body">
            Jadwal Wawancara
            <span class="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </a>
          <a href="#kelulusan" class="px-8 py-4 bg-surface-container-high text-primary font-bold rounded-2xl hover:bg-surface-container-highest transition-all font-body">
            Cek Kelulusan
          </a>
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
  </section> -->

  <!-- Wawancara Section (For Prospective Students) -->
  <section id="wawancara" class="py-32 bg-surface-container-low border-y border-outline-variant/30">
    <div class="max-w-7xl mx-auto px-8">
      <div class="flex flex-col md:flex-row gap-16 items-center">
        <div class="md:w-1/2 space-y-10">
          <div>
            <span class="text-secondary font-bold tracking-widest uppercase text-xs mb-2 block font-body">Pusat
              Informasi Wawancara</span>
            <h2 class="text-5xl font-black text-primary tracking-tighter font-headline leading-tight">Persiapkan Diri
              <br /> Untuk Wawancara.</h2>
          </div>
          <p class="text-on-surface-variant font-body leading-relaxed text-lg">
            Tahap wawancara adalah kunci utama untuk mengenal minat dan bakat Anda. Pastikan Anda telah melengkapi
            berkas dan mengecek jadwal sesi Anda secara berkala.
          </p>

          <!-- Steps Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div v-for="step in ppdbSteps" :key="step.id" class="flex gap-4">
              <div
                class="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center font-headline font-black text-primary border border-outline-variant/20">
                {{ step.id }}
              </div>
              <div class="font-body">
                <h4 class="font-bold text-primary">{{ step.title }}</h4>
                <p class="text-xs text-on-surface-variant italic">{{ step.desc }}</p>
              </div>
            </div>
          </div>

          <Link :href="user ? '/admin/dashboard' : '/signup'"
            class="inline-flex px-10 py-5 bg-secondary text-on-secondary font-black rounded-2xl text-lg hover:scale-105 transition-transform font-headline shadow-xl shadow-secondary/20">
            {{ user ? 'DASHBOARD ADMIN' : 'MULAI PENDAFTARAN' }}
          </Link>
        </div>

        <div class="md:w-1/2 w-full">
          <!-- Visual Highlight Card (Replaces old text schedule box) -->
          <div
            class="group relative bg-primary rounded-[3rem] overflow-hidden shadow-2xl h-[500px] flex flex-col justify-end p-10 border border-white/10 transition-all duration-700 hover:-translate-y-2">
            <!-- Background Image with Gradient Overlay -->
            <img :src="WawancaraImage" alt="Interview Experience"
              class="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-40 mix-blend-overlay" />
            <div class="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent"></div>

            <!-- Content -->
            <div class="relative z-10 space-y-6">
              <div class="flex items-center gap-3">
                <span class="w-10 h-10 bg-secondary/20 backdrop-blur-md rounded-full flex items-center justify-center">
                  <span class="material-symbols-outlined text-secondary text-xl">star</span>
                </span>
                <span class="text-white/80 font-bold uppercase tracking-[0.2em] text-[10px] font-body">Highlight
                  Seleksi</span>
              </div>

              <h3 class="text-4xl font-black text-white font-headline leading-[1.1] tracking-tighter">
                Tunjukkan <br />
                <span class="text-secondary italic">Potensi Terbaik</span> <br />
                Anda Hari Ini.
              </h3>

              <p class="text-white/70 font-body text-sm leading-relaxed max-w-xs">
                Tahap wawancara bukan hanya seleksi, tapi jembatan menuju masa depan digital Anda di SMK Plus Pelita
                Nusantara.
              </p>

              <div class="pt-4 flex items-center gap-4">
                <Link :href="user ? '/admin/dashboard' : '/dashboard-ppdb'"
                  class="px-8 py-4 bg-white text-primary font-black rounded-2xl hover:scale-105 active:scale-95 transition-all font-headline shadow-xl shadow-black/20">
                  MASUK PORTAL
                </Link>
                <div class="flex -space-x-4">
                  <img v-for="i in 3" :key="i" :src="`https://i.pravatar.cc/100?img=${i + 10}`"
                    class="w-10 h-10 rounded-full border-2 border-primary object-cover" />
                  <div
                    class="w-10 h-10 rounded-full border-2 border-primary bg-secondary/20 backdrop-blur-md flex items-center justify-center text-[10px] font-bold text-white">
                    +50</div>
                </div>
              </div>
            </div>

            <!-- Decorative Glow -->
            <div class="absolute -bottom-20 -right-20 w-64 h-64 bg-secondary/20 rounded-full blur-[100px]"></div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Graduation Check Section (For SMK Students) -->
  <section id="kelulusan" class="py-32 overflow-hidden relative">
    <div class="absolute inset-0 bg-primary/5 -z-10"></div>
    <div class="max-w-7xl mx-auto px-8 relative z-10">
      <div class="flex flex-col lg:flex-row justify-between items-center gap-16">
        <div class="lg:w-2/5 space-y-8 text-center lg:text-left">
          <div>
            <span class="text-primary font-bold tracking-widest uppercase text-[10px] mb-2 block font-body">Cek Hasil
              Akhir</span>
            <h2 class="text-5xl font-black text-primary tracking-tighter font-headline">Pengumuman <br /> Kelulusan
              Siswa.</h2>
          </div>
          <p class="text-on-surface-variant font-body leading-relaxed max-w-sm mx-auto lg:mx-0">
            Periksa status kelulusan Anda secara resmi melalui portal validasi SMK Plus Pelita Nusantara.
          </p>

          <!-- Dynamic Content: Search Form or Countdown -->
          <div v-if="isReleased" class="animate-fade-in space-y-6">
            <div
              class="bg-white p-2 rounded-[1.5rem] shadow-2xl flex flex-col sm:flex-row items-center gap-2 border border-outline-variant/30 group-focus-within:border-primary transition-colors">
              <div class="flex items-center gap-3 px-6 py-3 grow w-full">
                <span class="material-symbols-outlined text-outline">search</span>
                <input v-model="nisnQuery" type="text" placeholder="Masukkan Nomor NISN..."
                  class="grow bg-transparent border-none outline-none font-body text-primary font-bold placeholder:font-medium placeholder:text-outline-variant"
                  @keyup.enter="handleSearch" />
              </div>
              <button @click="handleSearch" :disabled="isChecking || !nisnQuery"
                class="w-full sm:w-auto px-10 py-4 bg-primary text-white font-bold rounded-[1.1rem] hover:brightness-110 active:scale-95 transition-all font-body disabled:opacity-50 flex items-center justify-center gap-2 min-w-[140px]">
                <span v-if="isChecking" class="material-symbols-outlined animate-spin text-sm">sync</span>
                {{ isChecking ? 'PROSES...' : 'PERIKSA' }}
              </button>
            </div>
            <p v-if="error" class="text-error text-[10px] font-bold uppercase tracking-wider ml-4 animate-shake">{{
              error
              }}</p>
            <p v-else class="text-[10px] text-outline-variant italic font-body">Gunakan 10 digit NISN yang terdaftar
              pada
              database sekolah.</p>
          </div>

          <!-- Countdown State -->
          <div v-else
            class="bg-primary p-10 rounded-[2.5rem] space-y-8 shadow-2xl shadow-primary/20 border border-white/10 animate-fade-in relative overflow-hidden">
            <div class="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 pointer-events-none">
            </div>

            <div class="relative z-10 space-y-2">
              <span
                class="text-white/60 font-black uppercase tracking-[0.3em] text-[8px] font-body bg-white/10 px-3 py-1 rounded-full">Hitung
                Mundur Pengumuman</span>
              <h3 class="font-headline font-black text-white text-2xl tracking-tighter shadow-sm">Segera Dirilis.</h3>
            </div>

            <div class="grid grid-cols-4 gap-3 relative z-10">
              <div v-for="unit in countdown" :key="unit.label"
                class="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center border border-white/5 group hover:bg-white/20 transition-all">
                <div
                  class="text-2xl font-black text-white font-headline leading-none mb-1 group-hover:scale-110 transition-transform">
                  {{ unit.val }}</div>
                <div class="text-[8px] font-bold text-white/50 uppercase tracking-widest">{{ unit.label }}</div>
              </div>
            </div>

            <div
              class="flex items-center gap-2 text-[10px] text-white/70 font-bold uppercase tracking-wider relative z-10">
              <span class="material-symbols-outlined text-sm animate-pulse">lock_clock</span>
              Akses pencarian dibuka secara otomatis
            </div>
          </div>
        </div>

        <div class="lg:w-3/5 relative">
          <!-- Digital Certificate Preview -->
          <div
            class="bg-white p-8 sm:p-12 rounded-3xl shadow-2xl border border-outline-variant/20 -rotate-1 relative overflow-hidden group hover:rotate-0 transition-transform duration-700">
            <div class="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none"></div>
            <div
              class="border-[12px] border-surface-container min-h-[400px] p-8 flex flex-col items-center justify-between text-center space-y-12">
              <div class="space-y-4">
                <span class="material-symbols-outlined text-secondary text-5xl">verified_user</span>
                <h4 class="font-headline font-black text-primary text-2xl tracking-[0.2em] uppercase">Status Kelulusan
                </h4>
                <div class="h-0.5 w-16 bg-secondary mx-auto"></div>
              </div>
              <div class="space-y-2">
                <p class="text-xs text-outline italic font-body">Nama Peserta Didik:</p>
                <p class="text-3xl font-black text-primary font-headline tracking-tight uppercase">Calon Alumni
                  Berprestasi</p>
              </div>
              <div
                class="flex items-center justify-between w-full pt-8 border-t border-dotted border-outline-variant/50">
                <div class="text-left">
                  <p class="text-[9px] font-bold text-outline-variant">TAHUN LULUS</p>
                  <p class="text-sm font-black text-primary">2023/2024</p>
                </div>
                <div class="px-6 py-2 bg-green-500 text-white text-xs font-black rounded-full italic tracking-widest">
                  LULUS
                </div>
              </div>
            </div>
          </div>

          <!-- Decorative shapes -->
          <div class="absolute -top-10 -right-10 w-48 h-48 bg-secondary opacity-20 rounded-full blur-3xl -z-10"></div>
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
    <div
      class="max-w-4xl mx-auto bg-surface-container-highest rounded-[2.5rem] p-12 text-center space-y-8 relative overflow-hidden">
      <div class="relative z-10">
        <h2 class="text-3xl font-black text-primary font-headline">Ada kendala atau pertanyaan?</h2>
        <p class="text-on-surface-variant font-body max-w-lg mx-auto leading-relaxed">
          Tim Helpdesk kami siap membantu Anda selama jam operasional sekolah (Senin - Jumat, 08:00 - 15:00 WIB).
        </p>
        <div class="flex flex-wrap justify-center gap-4 pt-4">
          <a href="#" class="px-8 py-4 bg-primary text-white font-bold rounded-xl flex items-center gap-2 font-body">
            Hubungi Customer Service
          </a>
          <a href="#"
            class="px-8 py-4 bg-white text-primary font-bold border border-outline-variant/30 rounded-xl font-body">
            Lihat Rekap FAQ
          </a>
        </div>
      </div>
      <div class="absolute -bottom-10 -right-10 w-48 h-48 bg-secondary opacity-5 rounded-full blur-2xl"></div>
    </div>
  </section>

  <!-- Result Modal (Teleported to Body) -->
  <Teleport to="body">
    <div v-if="showResultModal && result" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/90 backdrop-blur-xl animate-fade-in" @click="showResultModal = false">
      </div>

      <div
        class="relative bg-white w-full max-w-[850px] rounded-3xl shadow-2xl overflow-hidden animate-zoom-in flex flex-col max-h-[98vh] border border-white/20">
        <!-- Header Actions -->
        <div class="flex items-center justify-between px-8 py-5 border-b bg-surface-container-low/50 backdrop-blur-md">
          <div class="flex items-center gap-3">
            <span class="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            <h3 class="font-headline font-bold text-primary tracking-tight">Dokumen Pemberitahuan Kelulusan</h3>
          </div>
          <div class="flex gap-4">
            <button @click="showResultModal = false"
              class="p-3 hover:bg-surface-variant/50 rounded-2xl transition-colors">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        <!-- Scrollable Certificate Container -->
        <div class="overflow-auto bg-surface-variant/10 flex justify-center p-8 lg:p-12">
          <!-- The Certificate Card -->
          <div id="skl-certificate"
            class="relative bg-white w-full max-w-[800px] min-h-[400px] md:min-h-0 md:aspect-[1.414/1] p-6 md:p-12 flex flex-col items-center justify-between border-[10px] md:border-[16px] border-surface-container shadow-2xl transition-transform duration-700"
            style="font-family: 'Public Sans', sans-serif; color: #1C1B1F;">

            <!-- Certificate Watermark -->
            <div
              class="absolute inset-0 opacity-[0.10] flex items-center justify-center pointer-events-none overflow-hidden">
              <img :src="LogoPenus" alt="" class="w-2/3 md:w-1/2 object-contain" />
            </div>

            <div class="text-center space-y-2 md:space-y-4 z-10 w-full flex-grow flex flex-col justify-center">
              <!-- Header -->
              <div class="space-y-1 md:space-y-2 flex-shrink-0">
                <img alt="SMK Plus Pelita Nusantara official seal" class="h-10 md:h-16 mx-auto mb-1" :src="LogoPenus" />
                <h2
                  class="font-headline font-bold text-primary text-xs md:text-base tracking-[0.05em] uppercase max-w-[240px] md:max-w-md mx-auto leading-tight">
                  Berdasarkan Surat Keputusan Kepala Sekolah
                </h2>
                <div class="h-0.5 w-12 bg-secondary mx-auto"></div>
              </div>

              <!-- Recipient Info & Status -->
              <div class="space-y-3 md:space-y-5 flex-grow flex flex-col justify-center">
                <div class="space-y-0.5 md:space-y-1">
                  <p class="text-[8px] md:text-[9px] text-outline font-body uppercase tracking-widest leading-none">
                    Menyatakan bahwa:</p>
                  <p
                    class="font-headline font-black text-primary text-base md:text-2xl uppercase tracking-tight leading-tight">
                    {{ result.name }}
                  </p>
                  <p class="font-body text-[8px] md:text-xs text-on-surface-variant font-bold leading-none">
                    NISN: {{ result.nisn }}
                  </p>
                </div>

                <div class="space-y-1.5 md:space-y-2">
                  <span :class="[
                    'inline-block px-5 py-1.5 md:px-10 md:py-3 text-white text-[10px] md:text-base font-black uppercase tracking-[0.2em] rounded-full shadow-lg',
                    result.status === 'Lulus' ? 'bg-green-500 shadow-green-500/30' : 'bg-error shadow-error/30'
                  ]">
                    {{ result.status }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Footer Section -->
            <div class="w-full flex justify-between items-end z-10">
              <!-- Left: Academic Year -->
              <div class="text-left font-body">
                <p class="text-[8px] md:text-[9px] text-outline font-bold uppercase tracking-widest mb-0.5">Tahun Ajaran
                </p>
                <p class="text-xs md:text-sm font-black text-primary">{{ page.props.academicYear }}</p>
              </div>

              <!-- Right: Major -->
              <div class="text-right font-body">
                <p class="text-[8px] md:text-[9px] uppercase font-bold text-outline-variant tracking-widest mb-1">
                  Kompetensi Keahlian</p>
                <p class="text-xs md:text-sm font-black text-primary uppercase">{{ result.majorName || '-' }}</p>
              </div>
            </div>

            <!-- Ornamental Border -->
            <div class="absolute inset-0 border border-outline-variant/10 pointer-events-none"></div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

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
