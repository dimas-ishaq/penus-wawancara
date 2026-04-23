<script setup lang="ts">
import { Link, useForm } from '@inertiajs/vue3'

const form = useForm({
  email: '',
  password: '',
  remember: false,
})

const submit = () => {
  form.post('/login', {
    onFinish: () => form.reset('password'),
  })
}

// Using a variable to prevent Vite from attempting to resolve this as a relative module import
const authBg = '/assets/auth_bg.png'
</script>

<template>
  <Head title="Log In - Portal Akademik SMK Plus PN" />
  <div class="min-h-screen flex items-stretch bg-surface overflow-hidden">
    <!-- Left side: Illustration (Hidden on mobile) -->
    <div class="hidden lg:flex lg:w-1/2 relative bg-primary items-center justify-center overflow-hidden">
      <img
        :src="authBg"
        alt="School Portal Illustration"
        class="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-overlay"
      />
      <div class="relative z-10 p-12 text-white">
        <div class="flex items-center gap-3 mb-8">
          <div class="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-2">
            <span class="material-symbols-outlined text-primary text-3xl">school</span>
          </div>
          <span class="text-2xl font-headline font-bold tracking-tight">SMK PLUS PN</span>
        </div>
        <h1 class="text-5xl font-headline font-black leading-tight mb-6">
          Selamat Datang Kembali <br />
          di Portal Akademik.
        </h1>
        <p class="text-lg text-white/80 max-w-md leading-relaxed">
          Masuk untuk mengakses jadwal wawancara, hasil pengumuman, dan data profil sekolah Anda.
        </p>
      </div>
      <div class="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary to-transparent opacity-60"></div>
    </div>

    <!-- Right side: Login Form -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-12 lg:p-24">
      <div class="w-full max-w-md space-y-10">
        <div class="lg:hidden flex items-center gap-2 mb-8">
          <div class="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span class="material-symbols-outlined text-white">school</span>
          </div>
          <span class="font-headline font-bold text-primary tracking-tight">SMK PLUS PN</span>
        </div>

        <div class="space-y-2">
          <h2 class="text-4xl font-headline font-black text-primary tracking-tight">Log In</h2>
          <p class="text-on-surface-variant">Silakan masukkan email dan password akun Anda.</p>
        </div>

        <form @submit.prevent="submit" class="space-y-6">
          <div class="space-y-2">
            <label for="email" class="text-sm font-bold text-primary flex items-center gap-2">
              <span class="material-symbols-outlined text-sm">mail</span>
              EMAIL ADDRESS
            </label>
            <div class="relative group">
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                autocomplete="username"
                class="w-full px-5 py-4 bg-white border-2 border-outline-variant rounded-2xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-on-surface"
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
            <div class="flex items-center justify-between">
              <label for="password" class="text-sm font-bold text-primary flex items-center gap-2">
                <span class="material-symbols-outlined text-sm">lock</span>
                PASSWORD
              </label>
              <Link href="#" class="text-xs font-bold text-secondary hover:underline">Lupa Password?</Link>
            </div>
            <div class="relative group">
              <input
                id="password"
                v-model="form.password"
                type="password"
                required
                autocomplete="current-password"
                class="w-full px-5 py-4 bg-white border-2 border-outline-variant rounded-2xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-on-surface"
                placeholder="••••••••"
                :class="{ 'border-error ring-error/10': form.errors.password }"
              />
              <div v-if="form.errors.password" class="text-error text-xs font-bold mt-1 flex items-center gap-1">
                <span class="material-symbols-outlined text-xs">error</span>
                {{ form.errors.password }}
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <input
              id="remember"
              v-model="form.remember"
              type="checkbox"
              class="w-5 h-5 border-2 border-outline-variant rounded text-primary focus:ring-primary cursor-pointer"
            />
            <label for="remember" class="text-sm font-medium text-on-surface-variant cursor-pointer">
              Ingat saya di perangkat ini
            </label>
          </div>

          <button
            type="submit"
            :disabled="form.processing"
            class="w-full py-4 bg-primary text-white font-black rounded-2xl hover:bg-primary/90 hover:scale-[0.98] active:scale-95 transition-all shadow-xl shadow-primary/20 disabled:opacity-50 disabled:cursor-wait flex items-center justify-center gap-2"
          >
            <span>LOG IN</span>
            <span class="material-symbols-outlined text-lg">login</span>
          </button>
        </form>

        <div class="pt-8 border-t border-outline-variant flex flex-col items-center gap-4">
          <p class="text-on-surface-variant text-sm">Belum memiliki akun?</p>
          <Link
            href="/signup"
            class="w-full py-3 border-2 border-primary text-primary font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors"
          >
            DAFTAR SEKARANG
          </Link>
        </div>
      </div>
    </div>
  </div>
</template>
