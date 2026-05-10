<script setup lang="ts">
import { Head, useForm } from '@inertiajs/vue3'
import { ref, computed } from 'vue'
import { toast } from 'vue-sonner'
import { Skeleton } from '@/components/ui/skeleton'

const props = defineProps<{
  logo: string | null
  kopSurat: string | null
  academicYear: string
  brandName: string
  brandShortName: string
  googleDrive: {
    type: 'oauth' | 'service_account'
    clientId: string
    clientSecret: string
    refreshToken: string
    clientEmail: string
    privateKey: string
    parentFolderId: string
    studentFolderId: string
  }
}>()

const logoPreview = ref<string | null>(props.logo)
const kopPreview = ref<string | null>(props.kopSurat ? `/admin/settings/private/kop_surat_path?t=${new Date().getTime()}` : null)

const logoForm = useForm({
  logo: null as File | null,
})

const kopForm = useForm({
  kopSurat: null as File | null,
})

const generalForm = useForm({
  academicYear: props.academicYear,
  brandName: props.brandName,
  brandShortName: props.brandShortName,
})

const googleDriveForm = useForm({
  type: props.googleDrive.type,
  clientId: props.googleDrive.clientId,
  clientSecret: props.googleDrive.clientSecret,
  refreshToken: props.googleDrive.refreshToken,
  clientEmail: props.googleDrive.clientEmail,
  privateKey: props.googleDrive.privateKey,
  parentFolderId: props.googleDrive.parentFolderId,
  studentFolderId: props.googleDrive.studentFolderId,
})

const isVerifying = ref(false)
const verificationResult = ref<{ success: boolean, message?: string, user?: any, folder?: any } | null>(null)

const testConnection = async (folderType: 'parent' | 'student' | 'auth') => {
  isVerifying.value = true
  verificationResult.value = null
  
  try {
    const folderId = folderType === 'parent' ? googleDriveForm.parentFolderId 
                   : folderType === 'student' ? googleDriveForm.studentFolderId 
                   : null

    const response = await fetch('/admin/settings/google-drive/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-XSRF-TOKEN': decodeURIComponent(document.cookie.split('XSRF-TOKEN=')[1]?.split(';')[0] || '')
      },
      body: JSON.stringify({ 
        ...googleDriveForm.data(),
        folderId 
      })
    })

    const result = await response.json()
    verificationResult.value = result
    
    if (result.success) {
      toast.success(folderId ? `Koneksi Berhasil! Folder "${result.folder.name}" ditemukan.` : 'Koneksi ke Google Drive Berhasil!')
    } else {
      toast.error(result.message || 'Gagal memverifikasi koneksi')
    }
  } catch (error) {
    toast.error('Terjadi kesalahan saat memverifikasi koneksi')
  } finally {
    isVerifying.value = false
  }
}

const currentYear = new Date().getFullYear()
const academicYears = computed(() => {
  const years = []
  // 5 years back to 1 year forward
  for (let i = currentYear - 5; i <= currentYear + 1; i++) {
    years.push(`${i}/${i + 1}`)
  }
  return years
})

const onLogoChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) {
    logoForm.logo = file
    const reader = new FileReader()
    reader.onload = (e) => {
      logoPreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const onKopChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) {
    kopForm.kopSurat = file
    const reader = new FileReader()
    reader.onload = (e) => {
      kopPreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const submitLogo = () => {
  logoForm.post('/admin/settings/logo', {
    forceFormData: true,
    onSuccess: () => {
      logoForm.reset()
    }
  })
}

const submitKop = () => {
  kopForm.post('/admin/settings/kop-surat', {
    forceFormData: true,
    onSuccess: () => {
      kopForm.reset()
    }
  })
}

const submitGeneral = () => {
  generalForm.post('/admin/settings/general')
}

const submitGoogleDrive = () => {
  googleDriveForm.post('/admin/settings/google-drive')
}
</script>

<template>

  <Head title="Pengaturan Aplikasi" />

  <div class="max-w-6xl space-y-10">
    <header class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-black text-primary tracking-tighter font-headline mb-1 sm:mb-2">Konfigurasi Portal</h1>
        <p class="text-on-surface-variant font-body text-xs sm:text-sm">Kelola identitas visual dan pengaturan umum sistem.</p>
      </div>
    </header>

    <!-- Branding & Assets -->
    <div class="space-y-8 sm:space-y-12 animate-fade-in">
      
      <!-- Logo Section -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12">
        <div class="lg:col-span-1">
          <h3 class="text-lg sm:text-xl font-black text-primary font-headline mb-2 sm:mb-3 flex items-center gap-2">
            <span class="material-symbols-outlined text-secondary">deployed_code</span>
            Visual & Logo
          </h3>
          <p class="text-xs sm:text-sm text-on-surface-variant font-body leading-relaxed">Logo aplikasi ini akan digunakan di navigasi utama, footer, dan favicon sistem.</p>
        </div>

        <div class="lg:col-span-2">
          <div class="bg-card rounded-3xl sm:rounded-[32px] border border-outline-variant/30 p-6 sm:p-10 shadow-sm">
            <div class="flex flex-col items-center gap-6 sm:gap-8">
              <!-- Preview -->
              <div
                class="w-full h-48 sm:h-64 bg-surface-container-lowest rounded-2xl sm:rounded-3xl border-2 border-dashed border-outline-variant/50 flex items-center justify-center overflow-hidden group relative">
                <img v-if="logoPreview" :src="logoPreview" class="max-h-full max-w-full object-contain p-6 sm:p-8" />
                <div v-else class="flex flex-col items-center gap-3 text-outline-variant">
                  <span class="material-symbols-outlined text-5xl sm:text-7xl">image</span>
                  <p class="font-black text-xs uppercase tracking-widest">Belum ada logo</p>
                </div>

                <div
                  class="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm p-4">
                  <label for="logo-upload"
                    class="cursor-pointer px-6 sm:px-10 py-3 sm:py-4 bg-background text-primary text-xs sm:text-sm font-black rounded-xl sm:rounded-2xl shadow-2xl hover:scale-105 transition-transform text-center">
                    UNGGAH LOGO BARU
                  </label>
                </div>
              </div>

              <form @submit.prevent="submitLogo" class="w-full space-y-6">
                <input id="logo-upload" type="file" @change="onLogoChange" accept="image/*" class="hidden" />
                <div class="flex justify-center sm:justify-end">
                  <button type="submit" :disabled="!logoForm.logo || logoForm.processing"
                    class="w-full sm:w-auto px-8 sm:px-12 py-4 bg-primary text-primary-foreground font-black rounded-2xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 tracking-widest disabled:opacity-50 text-xs sm:text-sm">
                    SIMPAN LOGO
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- Kop Surat Section -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12 pt-8 sm:pt-12 border-t border-outline-variant/10">
        <div class="lg:col-span-1">
          <h3 class="text-lg sm:text-xl font-black text-primary font-headline mb-2 sm:mb-3 flex items-center gap-2">
            <span class="material-symbols-outlined text-secondary">description</span>
            Kop Surat (Private)
          </h3>
          <p class="text-xs sm:text-sm text-on-surface-variant font-body leading-relaxed">
            Asset gambar kop surat yang akan ditempelkan pada dokumen unduhan PDF hasil wawancara. 
            <span class="block mt-2 font-bold text-amber-600">Disimpan secara privat di server.</span>
          </p>
        </div>

        <div class="lg:col-span-2">
          <div class="bg-card rounded-3xl sm:rounded-[32px] border border-outline-variant/30 p-6 sm:p-10 shadow-sm">
            <div class="flex flex-col items-center gap-6 sm:gap-8">
              <!-- Preview -->
              <div
                class="w-full h-48 sm:h-64 bg-surface-container-lowest rounded-2xl sm:rounded-3xl border-2 border-dashed border-outline-variant/50 flex items-center justify-center overflow-hidden group relative">
                <img v-if="kopPreview" :src="kopPreview" class="max-h-full max-w-full object-contain p-6 sm:p-8" />
                <div v-else class="flex flex-col items-center gap-3 text-outline-variant text-center">
                  <span class="material-symbols-outlined text-5xl sm:text-7xl">draft</span>
                  <p class="font-black text-xs uppercase tracking-widest">Kop surat belum diunggah</p>
                </div>

                <div
                  class="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm p-4">
                  <label for="kop-upload"
                    class="cursor-pointer px-6 sm:px-10 py-3 sm:py-4 bg-background text-primary text-xs sm:text-sm font-black rounded-xl sm:rounded-2xl shadow-2xl hover:scale-105 transition-transform text-center">
                    UNGGAH KOP SURAT
                  </label>
                </div>
              </div>

              <form @submit.prevent="submitKop" class="w-full space-y-6">
                <input id="kop-upload" type="file" @change="onKopChange" accept="image/*" class="hidden" />
                <div class="flex justify-center sm:justify-end">
                  <button type="submit" :disabled="!kopForm.kopSurat || kopForm.processing"
                    class="w-full sm:w-auto px-8 sm:px-12 py-4 bg-primary text-primary-foreground font-black rounded-2xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 tracking-widest disabled:opacity-50 text-xs sm:text-sm">
                    SIMPAN KOP SURAT
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- General Settings Section -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12 pt-8 sm:pt-12 border-t border-outline-variant/10">
        <div class="lg:col-span-1">
          <h3 class="text-lg sm:text-xl font-black text-primary font-headline mb-2 sm:mb-3 flex items-center gap-2">
            <span class="material-symbols-outlined text-secondary">settings</span>
            Pengaturan Umum
          </h3>
          <p class="text-xs sm:text-sm text-on-surface-variant font-body leading-relaxed">Informasi identitas sekolah dan periode aktif sistem.</p>
        </div>

        <div class="lg:col-span-2">
          <div class="bg-card rounded-3xl sm:rounded-[32px] border border-outline-variant/30 p-6 sm:p-10 shadow-sm">
            <form @submit.prevent="submitGeneral" class="space-y-6 sm:space-y-8">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-3">
                  <label class="text-[10px] font-black text-outline-variant uppercase tracking-[0.2em] block ml-1">Nama Panjang Brand / Sekolah</label>
                  <input v-model="generalForm.brandName" type="text" placeholder="Contoh: SMK PLUS PELITA NUSANTARA" required
                    class="w-full bg-surface-container-low border border-outline-variant/30 rounded-2xl p-4 sm:p-6 font-black text-primary focus:ring-2 ring-primary outline-none transition-all text-sm sm:text-base" />
                </div>
                <div class="space-y-3">
                  <label class="text-[10px] font-black text-outline-variant uppercase tracking-[0.2em] block ml-1">Nama Singkat (Sidebar)</label>
                  <input v-model="generalForm.brandShortName" type="text" placeholder="Contoh: PENUS" required
                    class="w-full bg-surface-container-low border border-outline-variant/30 rounded-2xl p-4 sm:p-6 font-black text-primary focus:ring-2 ring-primary outline-none transition-all text-sm sm:text-base uppercase" />
                </div>
              </div>
              <div class="space-y-3">
                <label class="text-[10px] font-black text-outline-variant uppercase tracking-[0.2em] block ml-1">Tahun
                  Ajaran</label>
                <select v-model="generalForm.academicYear" required
                  class="w-full bg-surface-container-low border border-outline-variant/30 rounded-2xl p-4 sm:p-6 font-black text-primary focus:ring-2 ring-primary outline-none transition-all appearance-none text-sm sm:text-base">
                  <option v-for="year in academicYears" :key="year" :value="year">{{ year }}</option>
                </select>
              </div>
              <div class="flex justify-center sm:justify-end pt-4">
                <button type="submit" :disabled="generalForm.processing"
                  class="w-full sm:w-auto px-8 sm:px-12 py-4 bg-secondary text-secondary-foreground font-black rounded-2xl shadow-xl shadow-secondary/20 tracking-widest disabled:opacity-50 text-xs sm:text-sm">
                  SIMPAN PERUBAHAN
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <!-- Google Drive Settings Section -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12 pt-8 sm:pt-12 border-t border-outline-variant/10">
        <div class="lg:col-span-1">
          <h3 class="text-lg sm:text-xl font-black text-primary font-headline mb-2 sm:mb-3 flex items-center gap-2">
            <span class="material-symbols-outlined text-secondary">cloud_queue</span>
            Integrasi Google Drive
          </h3>
          <p class="text-xs sm:text-sm text-on-surface-variant font-body leading-relaxed">
            Konfigurasi kredensial Google Drive untuk penyimpanan dokumen surat perjanjian. 
            <a href="/docs/google-drive-integration.md" target="_blank" class="text-primary hover:underline block mt-2 font-bold flex items-center gap-1">
              <span class="material-symbols-outlined text-xs">help</span>
              BACA PANDUAN INTEGRASI
            </a>
          </p>
        </div>

        <div class="lg:col-span-2">
          <div class="bg-card rounded-3xl sm:rounded-[32px] border border-outline-variant/30 p-6 sm:p-10 shadow-sm">
            <form @submit.prevent="submitGoogleDrive" class="space-y-6 sm:space-y-8">
              
              <!-- Auth Method Toggle -->
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <label class="text-[10px] font-black text-outline-variant uppercase tracking-[0.2em] block ml-1">Metode Autentikasi</label>
                  <button type="button" @click="testConnection('auth')" :disabled="isVerifying"
                    class="text-[10px] font-black text-primary hover:text-primary/80 flex items-center gap-1 transition-all disabled:opacity-50">
                    <span v-if="isVerifying" class="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                    <span v-else class="material-symbols-outlined text-sm">sync</span>
                    CEK AUTH
                  </button>
                </div>
                <div class="flex gap-2 p-1 bg-surface-container-low rounded-2xl w-fit border border-outline-variant/30">
                  <button type="button" @click="googleDriveForm.type = 'oauth'"
                    :class="['px-6 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all', 
                    googleDriveForm.type === 'oauth' ? 'bg-primary text-primary-foreground shadow-lg' : 'text-on-surface-variant hover:bg-surface-variant/30']">
                    OAuth 2.0
                  </button>
                  <button type="button" @click="googleDriveForm.type = 'service_account'"
                    :class="['px-6 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all', 
                    googleDriveForm.type === 'service_account' ? 'bg-primary text-primary-foreground shadow-lg' : 'text-on-surface-variant hover:bg-surface-variant/30']">
                    Service Account
                  </button>
                </div>
              </div>

              <!-- OAuth 2.0 Fields -->
              <div v-if="googleDriveForm.type === 'oauth'" class="space-y-6 animate-fade-in">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-3">
                    <label class="text-[10px] font-black text-outline-variant uppercase tracking-[0.2em] block ml-1">Client ID</label>
                    <input v-model="googleDriveForm.clientId" type="password" placeholder="Masukkan Client ID" 
                      class="w-full bg-surface-container-low border border-outline-variant/30 rounded-2xl p-4 font-black text-primary focus:ring-2 ring-primary outline-none transition-all text-sm" />
                  </div>
                  <div class="space-y-3">
                    <label class="text-[10px] font-black text-outline-variant uppercase tracking-[0.2em] block ml-1">Client Secret</label>
                    <input v-model="googleDriveForm.clientSecret" type="password" placeholder="Masukkan Client Secret" 
                      class="w-full bg-surface-container-low border border-outline-variant/30 rounded-2xl p-4 font-black text-primary focus:ring-2 ring-primary outline-none transition-all text-sm" />
                  </div>
                </div>
                <div class="space-y-3">
                  <label class="text-[10px] font-black text-outline-variant uppercase tracking-[0.2em] block ml-1">Refresh Token</label>
                  <input v-model="googleDriveForm.refreshToken" type="password" placeholder="Masukkan Refresh Token" 
                    class="w-full bg-surface-container-low border border-outline-variant/30 rounded-2xl p-4 font-black text-primary focus:ring-2 ring-primary outline-none transition-all text-sm" />
                </div>
                
                <div class="pt-2">
                  <a href="/admin/settings/google-drive/auth" 
                    class="flex items-center justify-center gap-3 p-5 bg-surface-container-high border-2 border-primary/20 rounded-2xl font-black text-xs text-primary hover:bg-primary/10 hover:border-primary transition-all group">
                    <img src="https://www.google.com/favicon.ico" class="w-5 h-5 group-hover:scale-110 transition-transform" />
                    HUBUNGKAN KE GOOGLE DRIVE (LOGIN GOOGLE)
                  </a>
                  <p class="text-[9px] text-muted-foreground mt-2 ml-2 italic leading-relaxed">
                    *Pastikan <strong>Client ID</strong> dan <strong>Client Secret</strong> sudah diisi dan disimpan sebelum menekan tombol ini.
                  </p>
                </div>
              </div>

              <!-- Service Account Fields -->
              <div v-else class="space-y-6 animate-fade-in">
                <div class="space-y-3">
                  <label class="text-[10px] font-black text-outline-variant uppercase tracking-[0.2em] block ml-1">Client Email</label>
                  <input v-model="googleDriveForm.clientEmail" type="text" placeholder="Masukkan Client Email" 
                    class="w-full bg-surface-container-low border border-outline-variant/30 rounded-2xl p-4 font-black text-primary focus:ring-2 ring-primary outline-none transition-all text-sm" />
                </div>
                <div class="space-y-3">
                  <label class="text-[10px] font-black text-outline-variant uppercase tracking-[0.2em] block ml-1">Private Key (JSON)</label>
                  <textarea v-model="googleDriveForm.privateKey" rows="4" placeholder="-----BEGIN PRIVATE KEY-----\n..." 
                    class="w-full bg-surface-container-low border border-outline-variant/30 rounded-2xl p-4 font-black text-primary focus:ring-2 ring-primary outline-none transition-all text-sm font-mono"></textarea>
                  <p class="text-[10px] text-muted-foreground ml-1">Salin isi field `private_key` dari file JSON service account.</p>
                </div>
              </div>

              <!-- Folder IDs (Always Visible) -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-outline-variant/10">
                <div class="space-y-3">
                  <div class="flex items-center justify-between">
                    <label class="text-[10px] font-black text-outline-variant uppercase tracking-[0.2em] block ml-1">Folder ID (Orang Tua)</label>
                    <button type="button" @click="testConnection('parent')" :disabled="isVerifying"
                      class="text-[10px] font-black text-primary hover:text-primary/80 flex items-center gap-1 transition-all disabled:opacity-50">
                      <span v-if="isVerifying" class="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                      <span v-else class="material-symbols-outlined text-sm">search</span>
                      CEK FOLDER
                    </button>
                  </div>
                  <input v-model="googleDriveForm.parentFolderId" type="text" placeholder="Masukkan Folder ID" 
                    class="w-full bg-surface-container-low border border-outline-variant/30 rounded-2xl p-4 font-black text-primary focus:ring-2 ring-primary outline-none transition-all text-sm" />
                </div>
                <div class="space-y-3">
                  <div class="flex items-center justify-between">
                    <label class="text-[10px] font-black text-outline-variant uppercase tracking-[0.2em] block ml-1">Folder ID (Siswa)</label>
                    <button type="button" @click="testConnection('student')" :disabled="isVerifying"
                      class="text-[10px] font-black text-primary hover:text-primary/80 flex items-center gap-1 transition-all disabled:opacity-50">
                      <span v-if="isVerifying" class="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                      <span v-else class="material-symbols-outlined text-sm">search</span>
                      CEK FOLDER
                    </button>
                  </div>
                  <input v-model="googleDriveForm.studentFolderId" type="text" placeholder="Masukkan Folder ID" 
                    class="w-full bg-surface-container-low border border-outline-variant/30 rounded-2xl p-4 font-black text-primary focus:ring-2 ring-primary outline-none transition-all text-sm" />
                </div>
              </div>

              <!-- Verification Result -->
              <div v-if="verificationResult || isVerifying" class="mt-6 animate-fade-in">
                <div v-if="isVerifying" class="p-5 rounded-2xl bg-primary/5 border border-primary/20 space-y-3">
                   <div class="flex items-center gap-3">
                      <Skeleton class="h-8 w-8 rounded-full" />
                      <Skeleton class="h-4 w-48" />
                   </div>
                   <Skeleton class="h-3 w-full" />
                </div>
                <div v-else :class="['p-5 rounded-2xl border flex items-center gap-4 shadow-sm', 
                  verificationResult.success ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200']">
                  <div :class="['w-10 h-10 rounded-xl flex items-center justify-center shrink-0', 
                    verificationResult.success ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white']">
                    <span class="material-symbols-outlined">{{ verificationResult.success ? 'check_circle' : 'error' }}</span>
                  </div>
                  <div class="grow min-w-0">
                    <h5 :class="['text-[10px] font-black uppercase tracking-widest', 
                      verificationResult.success ? 'text-emerald-700' : 'text-red-700']">
                      {{ verificationResult.success ? 'Koneksi Berhasil' : 'Koneksi Gagal' }}
                    </h5>
                    <p :class="['text-xs font-bold truncate', 
                      verificationResult.success ? 'text-emerald-600' : 'text-red-600']">
                      {{ verificationResult.message || (verificationResult.success ? `Berhasil terhubung ke ${verificationResult.user?.email || 'Google Drive'}` : 'Gagal memverifikasi kredensial') }}
                    </p>
                  </div>
                </div>
              </div>

              <div class="flex justify-center sm:justify-end pt-4">
                <button type="submit" :disabled="googleDriveForm.processing"
                  class="w-full sm:w-auto px-8 sm:px-12 py-4 bg-primary text-primary-foreground font-black rounded-2xl shadow-xl shadow-primary/20 tracking-widest disabled:opacity-50 text-xs sm:text-sm">
                  SIMPAN INTEGRASI
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
