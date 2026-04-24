<script setup lang="ts">
import { Head, useForm } from '@inertiajs/vue3'
import { ref, computed } from 'vue'

const props = defineProps<{
  logo: string | null
  academicYear: string
  brandName: string
}>()

const logoPreview = ref<string | null>(props.logo)

const logoForm = useForm({
  logo: null as File | null,
})

const generalForm = useForm({
  academicYear: props.academicYear,
  brandName: props.brandName,
})

const currentYear = new Date().getFullYear()
const academicYears = computed(() => {
  const years = []
  // 5 years back to 1 year forward
  for (let i = currentYear - 5; i <= currentYear + 1; i++) {
    years.push(`${i}/${i + 1}`)
  }
  return years
})

const onFileChange = (e: Event) => {
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

const submitLogo = () => {
  logoForm.post('/admin/settings/logo', {
    forceFormData: true,
    onSuccess: () => {
      logoForm.reset()
    }
  })
}

const submitGeneral = () => {
  generalForm.post('/admin/settings/general')
}
</script>

<template>

  <Head title="Pengaturan Aplikasi" />

  <div class="max-w-6xl space-y-10">
    <header class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <h1 class="text-3xl font-black text-primary tracking-tighter font-headline mb-2">Konfigurasi Portal</h1>
        <p class="text-on-surface-variant font-body text-sm">Kelola identitas visual dan pengaturan umum sistem.</p>
      </div>
    </header>

    <!-- Branding Tab -->
    <div class="space-y-12 animate-fade-in">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div class="lg:col-span-1">
          <h3 class="text-xl font-black text-primary font-headline mb-3 flex items-center gap-2">
            <span class="material-symbols-outlined text-secondary">deployed_code</span>
            Visual & Logo
          </h3>
          <p class="text-sm text-on-surface-variant font-body leading-relaxed">Logo aplikasi ini akan digunakan di
            navigasi utama, footer, dan favicon sistem.</p>
        </div>

        <div class="lg:col-span-2">
          <div class="bg-card rounded-[32px] border border-outline-variant/30 p-10 shadow-sm">
            <div class="flex flex-col items-center gap-8">
              <!-- Preview -->
              <div
                class="w-full h-64 bg-surface-container-lowest rounded-3xl border-2 border-dashed border-outline-variant/50 flex items-center justify-center overflow-hidden group relative">
                <img v-if="logoPreview" :src="logoPreview" class="max-h-full max-w-full object-contain p-8" />
                <div v-else class="flex flex-col items-center gap-3 text-outline-variant">
                  <span class="material-symbols-outlined text-7xl">image</span>
                  <p class="font-black text-sm uppercase tracking-widest">Belum ada logo</p>
                </div>

                <div
                  class="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                  <label for="logo-upload"
                    class="cursor-pointer px-10 py-4 bg-background text-primary font-black rounded-2xl shadow-2xl hover:scale-105 transition-transform">
                    UNGGAH LOGO BARU
                  </label>
                </div>
              </div>

              <form @submit.prevent="submitLogo" class="w-full space-y-6">
                <input id="logo-upload" type="file" @change="onFileChange" accept="image/*" class="hidden" />
                <div class="flex justify-end pt-4">
                  <button type="submit" :disabled="!logoForm.logo || logoForm.processing"
                    class="px-12 py-4 bg-primary text-primary-foreground font-black rounded-2xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 tracking-widest disabled:opacity-50">
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-12 border-t border-outline-variant/10">
        <div class="lg:col-span-1">
          <h3 class="text-xl font-black text-primary font-headline mb-3 flex items-center gap-2">
            <span class="material-symbols-outlined text-secondary">date_range</span>
            Periode Aktif
          </h3>
          <p class="text-sm text-on-surface-variant font-body leading-relaxed">Atur tahun ajaran yang sedang berjalan
            untuk sinkronisasi data siswa.</p>
        </div>

        <div class="lg:col-span-2">
          <div class="bg-card rounded-[32px] border border-outline-variant/30 p-10 shadow-sm">
            <form @submit.prevent="submitGeneral" class="space-y-8">
              <div class="space-y-3">
                <label class="text-[10px] font-black text-outline-variant uppercase tracking-[0.2em] block ml-1">Nama Brand / Sekolah</label>
                <input v-model="generalForm.brandName" type="text" placeholder="Contoh: SMK PLUS PN" required
                  class="w-full bg-surface-container-low border border-outline-variant/30 rounded-2xl p-6 font-black text-primary focus:ring-2 ring-primary outline-none transition-all" />
              </div>
              <div class="space-y-3">
                <label class="text-[10px] font-black text-outline-variant uppercase tracking-[0.2em] block ml-1">Tahun
                  Ajaran</label>
                <select v-model="generalForm.academicYear" required
                  class="w-full bg-surface-container-low border border-outline-variant/30 rounded-2xl p-6 font-black text-primary focus:ring-2 ring-primary outline-none transition-all appearance-none">
                  <option v-for="year in academicYears" :key="year" :value="year">{{ year }}</option>
                </select>
              </div>
              <div class="flex justify-end">
                <button type="submit" :disabled="generalForm.processing"
                  class="px-12 py-4 bg-secondary text-secondary-foreground font-black rounded-2xl shadow-xl shadow-secondary/20 tracking-widest disabled:opacity-50">
                  Simpan Perubahan
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
