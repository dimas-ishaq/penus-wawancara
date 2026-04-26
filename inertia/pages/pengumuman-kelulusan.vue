<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Head, usePage } from '@inertiajs/vue3'
import LogoPenus from '@/assets/logo_penus.png'

const page = usePage()
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
</script>

<template>
  <Head title="Pengumuman Kelulusan - SMK Plus Pelita Nusantara" />

  <div class="min-h-screen bg-surface-container-lowest font-body">
    <!-- Header Section -->
    <header class="py-12 md:py-24 bg-primary text-white overflow-hidden relative">
      <div class="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        <div class="flex flex-col md:flex-row justify-between items-center gap-10">
          <div class="text-center md:text-left space-y-6">
            <span class="text-secondary font-bold tracking-[0.3em] uppercase text-[10px] md:text-xs block">Success By Character.</span>
            <h1 class="text-4xl md:text-7xl font-black font-headline tracking-tighter leading-[0.9]">
              Pengumuman <br/>
              <span class="text-secondary italic">Hasil Akhir.</span>
            </h1>
            <p class="text-white/70 max-w-lg leading-relaxed text-sm md:text-base">
              Selamat datang di sistem informasi kelulusan SMK Plus Pelita Nusantara. Masukkan NIS Anda untuk memvalidasi status kelulusan tahun ajaran {{ page.props.academicYear }}.
            </p>
          </div>
          
          <div class="hidden lg:block relative">
             <div class="w-64 h-64 bg-white/10 rounded-full blur-3xl absolute -top-10 -right-10"></div>
             <img :src="LogoPenus" class="h-48 w-auto opacity-20 rotate-12" alt="" />
          </div>
        </div>
      </div>
      
      <!-- Decorative background -->
      <div class="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary/20 rounded-full blur-[120px]"></div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-8 py-24">
      <div class="max-w-4xl mx-auto">
        <!-- If Released -->
        <div v-if="isReleased" class="space-y-12 animate-fade-in">
          <div class="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl border border-outline-variant/30 space-y-10">
            <div class="text-center space-y-3">
              <h2 class="text-3xl font-black text-primary font-headline tracking-tight">Validasi Nomor Induk Siswa (NIS)</h2>
              <p class="text-on-surface-variant max-w-md mx-auto">Gunakan nomor induk siswa resmi yang terdaftar pada pangkalan data sekolah.</p>
            </div>

            <div class="space-y-6">
              <div class="bg-surface-container p-2 rounded-[2rem] flex flex-col md:flex-row items-stretch md:items-center gap-2 group-focus-within:ring-4 ring-primary/10 transition-all">
                <div class="flex items-center gap-3 md:gap-4 px-6 md:px-8 py-4 grow w-full">
                  <span class="material-symbols-outlined text-primary text-2xl">fingerprint</span>
                  <input 
                    v-model="nisnQuery" 
                    type="text" 
                    placeholder="Masukkan NIS Anda..."
                    class="grow bg-transparent border-none outline-none text-lg md:text-xl font-bold text-primary placeholder:text-outline-variant/50 w-full"
                    @keyup.enter="handleSearch"
                  />
                </div>
                <button 
                  @click="handleSearch" 
                  :disabled="isChecking || !nisnQuery"
                  class="w-full md:w-auto px-12 py-5 bg-primary text-white font-black rounded-[1.5rem] hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  <span v-if="isChecking" class="material-symbols-outlined animate-spin">sync</span>
                  <span v-else class="material-symbols-outlined">verified</span>
                  {{ isChecking ? 'MEMPROSES...' : 'CEK STATUS' }}
                </button>
              </div>

              <div v-if="error" class="bg-error/5 text-error p-4 rounded-2xl flex items-center gap-3 animate-shake">
                <span class="material-symbols-outlined">error</span>
                <p class="text-sm font-bold uppercase tracking-wider">{{ error }}</p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
              <div class="p-6 bg-surface-container-low rounded-3xl space-y-2">
                <span class="material-symbols-outlined text-secondary">info</span>
                <p class="text-[10px] font-bold text-outline-variant uppercase tracking-widest">Informasi</p>
                <p class="text-xs font-medium text-on-surface-variant">Hasil yang ditampilkan adalah data resmi yang sudah disahkan.</p>
              </div>
              <div class="p-6 bg-surface-container-low rounded-3xl space-y-2">
                <span class="material-symbols-outlined text-secondary">help_center</span>
                <p class="text-[10px] font-bold text-outline-variant uppercase tracking-widest">Bantuan</p>
                <p class="text-xs font-medium text-on-surface-variant">Hubungi tim IT sekolah jika NIS Anda tidak ditemukan.</p>
              </div>
              <div class="p-6 bg-surface-container-low rounded-3xl space-y-2">
                <span class="material-symbols-outlined text-secondary">download</span>
                <p class="text-[10px] font-bold text-outline-variant uppercase tracking-widest">Dokumen</p>
                <p class="text-xs font-medium text-on-surface-variant">Anda dapat mengunduh surat keterangan setelah status muncul.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Countdown State -->
        <div v-else class="animate-fade-in">
          <div class="bg-primary p-12 md:p-20 rounded-[4rem] space-y-12 shadow-2xl shadow-primary/30 relative overflow-hidden text-center">
            <div class="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
            
            <div class="space-y-4 relative z-10">
              <span class="px-4 py-2 bg-white/10 text-white font-bold text-[10px] uppercase tracking-[0.4em] rounded-full">Hitung Mundur Rilis</span>
              <h2 class="text-4xl md:text-6xl font-black text-white font-headline tracking-tighter">Sesaat Lagi.</h2>
              <p class="text-white/60 max-w-md mx-auto">Akses pengecekan kelulusan akan dibuka secara otomatis sesuai jadwal yang ditentukan.</p>
            </div>

            <div class="grid grid-cols-4 gap-4 md:gap-8 max-w-2xl mx-auto relative z-10">
              <div v-for="unit in countdown" :key="unit.label" class="space-y-2">
                <div class="bg-white/10 backdrop-blur-xl border border-white/10 rounded-[2rem] py-8 shadow-xl">
                  <span class="text-3xl md:text-5xl font-black text-white font-headline">{{ unit.val }}</span>
                </div>
                <span class="text-[10px] font-black text-white/50 uppercase tracking-[0.2em]">{{ unit.label }}</span>
              </div>
            </div>

            <div class="pt-8 relative z-10">
               <div class="inline-flex items-center gap-3 px-6 py-3 bg-white/10 rounded-2xl border border-white/5 text-white/80 font-bold text-sm">
                 <span class="material-symbols-outlined animate-pulse">lock_clock</span>
                 Sistem Terkunci Otomatis
               </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Help Section -->
    <section class="pb-32 px-8">
      <div class="max-w-4xl mx-auto bg-white rounded-[3rem] p-12 md:p-16 text-center space-y-10 shadow-xl border border-outline-variant/20">
        <div class="space-y-4">
          <h2 class="text-3xl font-black text-primary font-headline">Butuh Bantuan Teknis?</h2>
          <p class="text-on-surface-variant max-w-xl mx-auto leading-relaxed">
            Jika Anda mengalami kendala saat melakukan pengecekan atau terdapat ketidaksesuaian data, silakan hubungi pusat bantuan kami.
          </p>
        </div>
        
        <div class="flex flex-wrap justify-center gap-4">
          <a href="#" class="px-10 py-5 bg-primary text-white font-bold rounded-2xl hover:brightness-110 transition-all flex items-center gap-3 shadow-lg shadow-primary/10">
            <span class="material-symbols-outlined">support_agent</span>
            Hubungi Helpdesk
          </a>
        </div>
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
          <div class="flex flex-col sm:flex-row items-center justify-between px-6 md:px-8 py-4 md:py-5 border-b bg-surface-container-low/50 backdrop-blur-md gap-4">
            <div class="flex items-center gap-3">
              <span class="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
              <h3 class="font-headline font-bold text-primary tracking-tight text-sm md:text-base">Surat Keterangan Kelulusan Digital</h3>
            </div>
            <div class="flex items-center gap-2 md:gap-4 w-full sm:w-auto">
              <a v-if="result.skl" :href="result.skl" target="_blank"
                class="flex-grow sm:flex-grow-0 flex items-center justify-center gap-2 px-4 md:px-6 py-2.5 md:py-3 bg-emerald-500 text-white font-bold text-xs md:text-sm rounded-xl md:rounded-2xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20">
                <span class="material-symbols-outlined text-lg">download</span>
                UNDUH SKL
              </a>
              <button @click="showResultModal = false"
                class="p-2.5 md:p-3 hover:bg-surface-variant/50 rounded-xl md:rounded-2xl transition-colors">
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>
          </div>

          <!-- Scrollable Certificate Container -->
          <div class="overflow-auto bg-surface-variant/10 flex justify-center p-4 md:p-8 lg:p-12">
            <!-- The Certificate Card -->
            <div id="skl-certificate"
              class="relative bg-white w-full max-w-[800px] min-h-[400px] md:min-h-0 md:aspect-[1.414/1] p-6 md:p-12 flex flex-col items-center justify-between border-[6px] md:border-[16px] border-surface-container shadow-2xl transition-transform duration-700"
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
                      NIS: {{ result.nisn }}
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
  </div>
</template>

<style scoped>
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
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
  40%, 60% { transform: translate3d(4px, 0, 0); }
}
</style>
