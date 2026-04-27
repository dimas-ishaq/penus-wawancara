<script setup lang="ts">
import { ref } from 'vue'
import { Head, Link, useForm } from '@inertiajs/vue3'
import HeroImage from '@/assets/hero.webp'
import LogoPenus from '@/assets/logo_penus.png'

const form = useForm({
  fullName: '',
  email: '',
  password: '',
  passwordConfirmation: '',
})

const showPassword = ref(false)
const showPasswordConfirmation = ref(false)

const submit = () => {
  form.post('/signup', {
    onFinish: () => form.reset('password', 'passwordConfirmation'),
  })
}
</script>

<template>
  <Head title="Sign Up - SMK Plus Pelita Nusantara" />
  <div class="min-h-screen flex items-stretch bg-surface overflow-hidden text-on-surface">
    <!-- Left side: Illustration -->
    <div class="hidden lg:flex lg:w-1/2 relative bg-primary dark:bg-surface-container items-center justify-center overflow-hidden transition-colors duration-500">
      <img
        :src="HeroImage"
        alt="School building facade"
        class="absolute inset-0 w-full h-full object-cover opacity-50 dark:opacity-20"
      />
      <div class="absolute inset-0 bg-primary/20 dark:bg-white/5 mix-blend-multiply transition-colors"></div>
      
      <div class="relative z-10 p-12 text-white dark:text-primary transition-colors">
        <div class="flex items-center gap-3 mb-8">
          <div class="w-14 h-14 bg-white rounded-2xl flex items-center justify-center p-2 shadow-xl shadow-primary/10">
            <img :src="LogoPenus" alt="Logo SMK Plus Pelita Nusantara" class="w-full h-full object-contain" />
          </div>
          <span class="text-2xl font-headline font-bold tracking-tight text-white dark:text-primary">SMK Plus Pelita Nusantara</span>
        </div>
        <h1 class="text-5xl font-headline font-black leading-tight mb-6">
          Mulai Perjalanan <br />
          Akademik Anda.
        </h1>
        <p class="text-lg opacity-80 dark:opacity-100 font-medium max-w-md leading-relaxed">
          Daftarkan akun Anda untuk mengikuti proses seleksi PPDB dan mengakses pengumuman resmi sekolah.
        </p>
      </div>
      <div class="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary/40 dark:from-surface-container/40 to-transparent opacity-60"></div>
    </div>

    <!-- Right side: Signup Form -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-12 lg:p-24 overflow-y-auto bg-surface">
      <div class="w-full max-w-md space-y-10 py-12">
        <div class="lg:hidden flex items-center gap-3 mb-8">
          <div class="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-1.5 shadow-lg border border-outline-variant/20">
            <img :src="LogoPenus" alt="Logo SMK Plus Pelita Nusantara" class="w-full h-full object-contain" />
          </div>
          <span class="font-headline font-bold text-primary tracking-tight">SMK Plus Pelita Nusantara</span>
        </div>

        <div class="space-y-2">
          <h2 class="text-4xl font-headline font-black text-primary tracking-tight uppercase">Sign Up</h2>
          <p class="text-on-surface-variant">Lengkapi data di bawah ini untuk membuat akun baru.</p>
        </div>

        <form @submit.prevent="submit" class="space-y-5">
          <div class="space-y-2">
            <label for="fullName" class="text-xs font-black text-primary flex items-center gap-2 tracking-widest uppercase">
              <span class="material-symbols-outlined text-sm">person</span>
              Nama Lengkap
            </label>
            <div class="relative group">
              <input
                id="fullName"
                v-model="form.fullName"
                type="text"
                required
                class="w-full px-5 py-3.5 bg-white dark:bg-surface-container border-2 border-outline-variant dark:border-outline-variant/30 rounded-2xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-on-surface"
                placeholder="Contoh: Arya Kusuma"
                :class="{ 'border-error ring-error/10': form.errors.fullName }"
              />
              <div v-if="form.errors.fullName" class="text-error text-xs font-bold mt-1 flex items-center gap-1">
                <span class="material-symbols-outlined text-xs">error</span>
                {{ form.errors.fullName }}
              </div>
            </div>
          </div>

          <div class="space-y-2">
            <label for="email" class="text-xs font-black text-primary flex items-center gap-2 tracking-widest uppercase">
              <span class="material-symbols-outlined text-sm">mail</span>
              Email Address
            </label>
            <div class="relative group">
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                class="w-full px-5 py-3.5 bg-white dark:bg-surface-container border-2 border-outline-variant dark:border-outline-variant/30 rounded-2xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-on-surface"
                placeholder="nama@contoh.com"
                :class="{ 'border-error ring-error/10': form.errors.email }"
              />
              <div v-if="form.errors.email" class="text-error text-xs font-bold mt-1 flex items-center gap-1">
                <span class="material-symbols-outlined text-xs">error</span>
                {{ form.errors.email }}
              </div>
            </div>
          </div>

          <div class="space-y-2">
            <label for="password" class="text-xs font-black text-primary flex items-center gap-2 tracking-widest uppercase">
              <span class="material-symbols-outlined text-sm">lock</span>
              Password
            </label>
            <div class="relative group">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="w-full px-5 py-3.5 bg-white dark:bg-surface-container border-2 border-outline-variant dark:border-outline-variant/30 rounded-2xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-on-surface"
                placeholder="Minimal 8 karakter"
                :class="{ 'border-error ring-error/10': form.errors.password }"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-4 top-3 text-on-surface-variant hover:text-primary transition-colors p-1"
              >
                <span class="material-symbols-outlined text-xl">
                  {{ showPassword ? 'visibility_off' : 'visibility' }}
                </span>
              </button>
              <div v-if="form.errors.password" class="text-error text-xs font-bold mt-1 flex items-center gap-1">
                <span class="material-symbols-outlined text-xs">error</span>
                {{ form.errors.password }}
              </div>
            </div>
          </div>

          <div class="space-y-2">
            <label for="passwordConfirmation" class="text-xs font-black text-primary flex items-center gap-2 tracking-widest uppercase">
              <span class="material-symbols-outlined text-sm">lock_reset</span>
              Konfirmasi Password
            </label>
            <div class="relative group">
              <input
                id="passwordConfirmation"
                v-model="form.passwordConfirmation"
                :type="showPasswordConfirmation ? 'text' : 'password'"
                required
                class="w-full px-5 py-3.5 bg-white dark:bg-surface-container border-2 border-outline-variant dark:border-outline-variant/30 rounded-2xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-on-surface"
                placeholder="Ulangi password"
                :class="{ 'border-error ring-error/10': form.errors.passwordConfirmation }"
              />
              <button
                type="button"
                @click="showPasswordConfirmation = !showPasswordConfirmation"
                class="absolute right-4 top-3 text-on-surface-variant hover:text-primary transition-colors p-1"
              >
                <span class="material-symbols-outlined text-xl">
                  {{ showPasswordConfirmation ? 'visibility_off' : 'visibility' }}
                </span>
              </button>
              <div v-if="form.errors.passwordConfirmation" class="text-error text-xs font-bold mt-1 flex items-center gap-1">
                <span class="material-symbols-outlined text-xs">error</span>
                {{ form.errors.passwordConfirmation }}
              </div>
            </div>
          </div>

          <div class="pt-4">
            <button
              type="submit"
              :disabled="form.processing"
              class="w-full py-4 bg-primary text-primary-foreground dark:text-primary-foreground font-black rounded-2xl hover:bg-primary/90 hover:scale-[0.98] active:scale-95 transition-all shadow-xl shadow-primary/20 disabled:opacity-50 disabled:cursor-wait flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
            >
              <span>BUAT AKUN</span>
              <span class="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
          </div>
        </form>

        <div class="pt-8 border-t border-outline-variant/50 flex flex-col items-center gap-4 text-center">
          <p class="text-on-surface-variant text-sm font-medium">Sudah memiliki akun?</p>
          <Link
            href="/login"
            class="text-primary font-bold hover:underline uppercase tracking-widest text-xs"
          >
            Masuk ke Akun
          </Link>
        </div>
      </div>
    </div>
  </div>
</template>

