<script setup lang="ts">
import { ref } from 'vue'
import { Head, Link, useForm } from '@inertiajs/vue3'
import HeroImage from '@/assets/hero.webp'

const form = useForm({
  email: '',
  password: '',
  remember: false,
})

const showPassword = ref(false)

const submit = () => {
  form.post('/login', {
    onFinish: () => form.reset('password'),
  })
}
</script>

<template>
  <Head title="Log In - Portal Akademik SMK Plus PN" />
  <div class="min-h-screen flex items-stretch bg-surface overflow-hidden">
    <!-- Left side: Illustration (Hidden on mobile) -->
    <div class="hidden lg:flex lg:w-1/2 relative bg-primary dark:bg-surface-container items-center justify-center overflow-hidden transition-colors duration-500">
      <img
        :src="HeroImage"
        alt="School building facade"
        class="absolute inset-0 w-full h-full object-cover opacity-50 dark:opacity-20"
      />
      <div class="absolute inset-0 bg-primary/20 dark:bg-white/5 mix-blend-multiply transition-colors"></div>
      
      <div class="relative z-10 p-12 text-white dark:text-primary transition-colors">
        <div class="flex items-center gap-3 mb-8">
          <div class="w-12 h-12 bg-white dark:bg-primary rounded-xl flex items-center justify-center p-2 shadow-lg transition-colors">
            <span class="material-symbols-outlined text-primary dark:text-white text-3xl">school</span>
          </div>
          <span class="text-2xl font-headline font-bold tracking-tight">SMK PLUS PN</span>
        </div>
        <h1 class="text-5xl font-headline font-black leading-tight mb-6">
          Selamat Datang Kembali <br />
          di Portal Akademik.
        </h1>
        <p class="text-lg opacity-80 dark:opacity-100 font-medium max-w-md leading-relaxed">
          Masuk untuk mengakses jadwal wawancara, hasil pengumuman, dan data profil sekolah Anda.
        </p>
      </div>
      <div class="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary/40 dark:from-surface-container/40 to-transparent opacity-60"></div>
    </div>

    <!-- Right side: Login Form -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-12 lg:p-24 bg-surface">
      <div class="w-full max-w-md space-y-10">
        <div class="flex flex-col gap-6">
          <Link href="/" class="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-bold text-sm group">
            <span class="material-symbols-outlined text-sm transition-transform group-hover:-translate-x-1">arrow_back</span>
            Kembali ke Beranda
          </Link>

          <div class="space-y-2">
            <h2 class="text-4xl font-headline font-black text-primary tracking-tight uppercase">Log In</h2>
            <p class="text-on-surface-variant">Silakan masukkan email dan password akun Anda.</p>
          </div>
        </div>

        <!-- General Error Message -->
        <div v-if="form.errors.login" class="p-4 bg-error/10 border-l-4 border-error rounded-r-xl flex items-center gap-3 animate-shake">
          <span class="material-symbols-outlined text-error">error</span>
          <p class="text-error text-sm font-bold">{{ form.errors.login }}</p>
        </div>

        <form @submit.prevent="submit" class="space-y-6">
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
                autocomplete="username"
                class="w-full px-5 py-4 bg-white dark:bg-surface-container border-2 border-outline-variant dark:border-outline-variant/30 rounded-2xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-on-surface"
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
              <label for="password" class="text-xs font-black text-primary flex items-center gap-2 tracking-widest uppercase">
                <span class="material-symbols-outlined text-sm">lock</span>
                Password
              </label>
              <Link href="#" class="text-xs font-bold text-secondary hover:underline">Lupa Password?</Link>
            </div>
            <div class="relative group">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                autocomplete="current-password"
                class="w-full px-5 py-4 bg-white dark:bg-surface-container border-2 border-outline-variant dark:border-outline-variant/30 rounded-2xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-on-surface"
                placeholder="••••••••"
                :class="{ 'border-error ring-error/10': form.errors.password }"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-4 top-4 text-on-surface-variant hover:text-primary transition-colors p-1"
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

          <div class="flex items-center gap-2">
            <input
              id="remember"
              v-model="form.remember"
              type="checkbox"
              class="w-5 h-5 border-2 border-outline-variant rounded text-primary focus:ring-primary cursor-pointer bg-white dark:bg-surface-container"
            />
            <label for="remember" class="text-sm font-medium text-on-surface-variant cursor-pointer">
              Ingat saya di perangkat ini
            </label>
          </div>

          <button
            type="submit"
            :disabled="form.processing"
            class="w-full py-4 bg-primary text-primary-foreground dark:text-primary-foreground font-black rounded-2xl hover:bg-primary/90 hover:scale-[0.98] active:scale-95 transition-all shadow-xl shadow-primary/20 disabled:opacity-50 disabled:cursor-wait flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
          >
            <span>Masuk</span>
            <span class="material-symbols-outlined text-lg">arrow_forward</span>
          </button>
        </form>

        <!-- Registration disabled temporarily -->
        <div class="pt-8 border-t border-outline-variant/50 flex flex-col items-center gap-4 text-center">
          <p class="text-on-surface-variant text-sm font-medium italic">
            Registrasi akun baru sedang ditutup sementara. <br/>
            Silakan hubungi admin sekolah untuk informasi lebih lanjut.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-shake {
  animation: shake 0.5s cubic-bezier(.36, .07, .19, .97) both;
}

@keyframes shake {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
  40%, 60% { transform: translate3d(4px, 0, 0); }
}

.animate-fade-in {
  animation: fadeIn 0.8s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>

