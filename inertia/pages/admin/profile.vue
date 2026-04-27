<script setup lang="ts">
import { Head, useForm, usePage } from '@inertiajs/vue3'
import { Toaster, toast } from 'vue-sonner'

const props = defineProps<{
  user: {
    fullName: string
    email: string
    role: string
  }
}>()

const form = useForm({
  fullName: props.user.fullName || '',
  password: '',
  password_confirmation: '',
})

const submit = () => {
  form.put('/admin/profile', {
    onSuccess: () => {
      toast.success('Profil berhasil diperbarui')
      form.password = ''
      form.password_confirmation = ''
    },
    onError: () => {
      toast.error('Gagal memperbarui profil. Periksa kembali inputan Anda.')
    }
  })
}
</script>

<template>
  <Head title="Pengaturan Profil Saya" />
  <Toaster position="top-right" richColors />

  <div class="max-w-4xl mx-auto space-y-8">
    <header>
      <h1 class="text-3xl font-black text-primary tracking-tighter font-headline mb-2">Profil Saya</h1>
      <p class="text-on-surface-variant font-body text-sm">Perbarui informasi personal Anda pada sistem.</p>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Profile Sidebar Card -->
      <div class="lg:col-span-1 space-y-6">
        <div class="bg-surface-container-low p-8 rounded-[40px] border border-outline-variant/30 text-center shadow-sm">
          <div class="w-24 h-24 rounded-full bg-primary/10 border-4 border-surface text-primary flex items-center justify-center text-4xl font-black mx-auto mb-6 shadow-xl shadow-primary/10">
            {{ props.user.fullName?.charAt(0) || props.user.email?.charAt(0) }}
          </div>
          <h2 class="text-xl font-black text-primary font-headline leading-tight">{{ props.user.fullName || 'User' }}</h2>
          <p class="text-xs font-bold text-outline uppercase tracking-widest mt-2">{{ props.user.role?.replace('_', ' ') }}</p>
          
          <div class="mt-8 pt-8 border-t border-outline-variant/30 space-y-4 text-left">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary shrink-0">
                <span class="material-symbols-outlined text-sm">mail</span>
              </div>
              <div class="min-w-0">
                <p class="text-[10px] font-bold text-outline uppercase tracking-widest">Email</p>
                <p class="text-xs font-medium text-on-surface truncate">{{ props.user.email }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Settings Form -->
      <div class="lg:col-span-2">
        <div class="bg-surface rounded-[40px] border border-outline-variant/30 overflow-hidden shadow-sm">
          <div class="p-8 sm:p-10">
            <form @submit.prevent="submit" class="space-y-8">
              <!-- Personal Info Section -->
              <div class="space-y-6">
                <div class="flex items-center gap-4 mb-4">
                  <div class="w-1.5 h-6 bg-primary rounded-full"></div>
                  <h3 class="text-lg font-black text-primary font-headline tracking-tight uppercase">Informasi Personal</h3>
                </div>

                <div class="grid grid-cols-1 gap-6">
                  <div class="space-y-2">
                    <label class="text-xs font-black text-secondary tracking-widest uppercase ml-1">Nama Lengkap</label>
                    <div class="relative group">
                      <div class="absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
                        <span class="material-symbols-outlined">person</span>
                      </div>
                      <input v-model="form.fullName" type="text"
                        class="w-full pl-12 pr-5 py-4 bg-surface-container-low rounded-2xl border border-outline-variant/50 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-body text-sm"
                        placeholder="Nama Lengkap" required />
                    </div>
                    <p v-if="form.errors.fullName" class="text-error text-[10px] font-bold mt-1 px-1">{{ form.errors.fullName }}</p>
                  </div>
                </div>
              </div>

              <!-- Security Section -->
              <div class="space-y-6 pt-6 border-t border-outline-variant/20">
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center gap-4">
                    <div class="w-1.5 h-6 bg-secondary rounded-full"></div>
                    <h3 class="text-lg font-black text-primary font-headline tracking-tight uppercase">Keamanan Akun</h3>
                  </div>
                  <span class="text-[9px] font-black text-outline bg-surface-container-high px-2 py-1 rounded-md uppercase tracking-widest">Opsional</span>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-2">
                    <label class="text-xs font-black text-secondary tracking-widest uppercase ml-1 text-on-surface-variant">Kata Sandi Baru</label>
                    <div class="relative group">
                      <div class="absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-secondary transition-colors">
                        <span class="material-symbols-outlined">lock</span>
                      </div>
                      <input v-model="form.password" type="password"
                        class="w-full pl-12 pr-5 py-4 bg-surface-container-low rounded-2xl border border-outline-variant/50 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-body text-sm"
                        placeholder="Kosongkan jika tidak diubah" />
                    </div>
                    <p v-if="form.errors.password" class="text-error text-[10px] font-bold mt-1 px-1">{{ form.errors.password }}</p>
                  </div>

                  <div class="space-y-2">
                    <label class="text-xs font-black text-secondary tracking-widest uppercase ml-1 text-on-surface-variant">Konfirmasi Kata Sandi</label>
                    <div class="relative group">
                      <div class="absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-secondary transition-colors">
                        <span class="material-symbols-outlined">key</span>
                      </div>
                      <input v-model="form.password_confirmation" type="password"
                        class="w-full pl-12 pr-5 py-4 bg-surface-container-low rounded-2xl border border-outline-variant/50 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-body text-sm"
                        placeholder="Ulangi kata sandi baru" />
                    </div>
                  </div>
                </div>
              </div>

              <div class="pt-10 flex flex-col sm:flex-row gap-4 items-center justify-between border-t border-outline-variant/20 mt-10">
                <div class="flex items-center gap-3 text-outline max-w-xs">
                  <span class="material-symbols-outlined text-xl shrink-0">info</span>
                  <p class="text-[10px] font-medium italic">Anda dapat memperbarui nama lengkap dan kata sandi di sini.</p>
                </div>
                <button type="submit" :disabled="form.processing"
                  class="w-full sm:w-auto px-10 py-5 bg-primary text-primary-foreground font-black rounded-3xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 font-headline tracking-widest disabled:opacity-50 flex items-center justify-center gap-3">
                  <span v-if="form.processing" class="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></span>
                  <span v-else class="material-symbols-outlined">save</span>
                  SIMPAN PERUBAHAN
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
