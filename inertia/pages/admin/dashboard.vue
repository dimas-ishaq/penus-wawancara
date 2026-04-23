<script setup lang="ts">
import { Head } from '@inertiajs/vue3'

const stats = [
  { name: 'Total Pendaftar', value: '428', icon: 'groups', color: 'bg-primary' },
  { name: 'Wawancara Selesai', value: '156', icon: 'fact_check', color: 'bg-secondary' },
  { name: 'Belum Wawancara', value: '272', icon: 'pending_actions', color: 'bg-tertiary-fixed' },
  { name: 'Siswa Lulus', value: '89', icon: 'military_tech', color: 'bg-primary-fixed' },
]

const recentActivities = [
  { id: 1, user: 'Budi Santoso', action: 'Input hasil wawancara', student: 'Arya Kusuma', time: '10 menit yang lalu' },
  { id: 2, user: 'Siti Aminah', action: 'Update status kelulusan', student: 'Rina Wijaya', time: '25 menit yang lalu' },
  { id: 3, user: 'Sistem', action: 'Expor data PDF terjadwal', student: '', time: '1 jam yang lalu' },
]
</script>

<template>

  <Head title="Admin Dashboard" />

  <div class="space-y-10">
    <header>
      <h1 class="text-3xl font-black text-primary tracking-tighter font-headline mb-2">Overview Dashboard</h1>
      <p class="text-on-surface-variant font-body text-sm">Selamat datang kembali di panel administrasi. Berikut ringkasan data
        terbaru hari ini.</p>
    </header>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-body">
      <div v-for="stat in stats" :key="stat.name"
        class="bg-surface-container-low p-6 rounded-3xl border border-outline-variant/10 shadow-sm flex flex-col justify-between group hover:bg-surface-container-high transition-all">
        <div class="flex justify-between items-start mb-6">
          <div :class="['w-12 h-12 rounded-2xl flex items-center justify-center text-white', stat.color]">
            <span class="material-symbols-outlined">{{ stat.icon }}</span>
          </div>
          <span
            class="text-xs font-bold text-on-surface-variant group-hover:text-primary tracking-tighter transition-colors">Lihat
            Detail</span>
        </div>
        <div>
          <div class="text-2xl font-black text-primary tracking-tighter font-headline">{{ stat.value }}</div>
          <div class="text-[10px] font-bold text-outline uppercase tracking-widest">{{ stat.name }}</div>
        </div>
      </div>
    </div>

    <!-- Main Section: Recent Activity & Reminders -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <!-- Recent Activity -->
      <div
        class="lg:col-span-8 bg-surface-container-lowest p-8 rounded-[2rem] border border-outline-variant/10 shadow-sm">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-xl font-bold text-primary font-headline flex items-center gap-3">
            <span class="material-symbols-outlined text-secondary">history</span>
            Log Aktivitas Terbaru
          </h2>
          <button class="text-xs font-bold text-primary hover:underline">LIHAT SEMUA</button>
        </div>

        <div class="space-y-6">
          <div v-for="activity in recentActivities" :key="activity.id"
            class="flex items-center gap-6 p-4 rounded-2xl hover:bg-surface-container-low transition-colors group">
            <div
              class="w-10 h-10 rounded-full bg-surface-container-low group-hover:bg-white flex items-center justify-center text-primary border border-outline-variant/20 transition-all">
              <span class="material-symbols-outlined text-xl">person</span>
            </div>
            <div class="grow font-body">
              <p class="text-sm font-bold text-primary">
                {{ activity.user }} <span class="font-normal text-on-surface-variant">{{ activity.action }}</span> {{
                activity.student }}
              </p>
              <p class="text-[10px] text-outline font-bold uppercase tracking-tighter">{{ activity.time }}</p>
            </div>
            <span
              class="material-symbols-outlined text-outline group-hover:text-primary transition-colors">chevron_right</span>
          </div>
        </div>
      </div>

      <!-- Quick Tips / Information -->
      <div class="lg:col-span-4 space-y-8">
        <div class="bg-primary text-on-primary p-8 rounded-[2rem] relative overflow-hidden group">
          <div class="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
            <span class="material-symbols-outlined text-9xl">info</span>
          </div>
          <div class="relative z-10">
            <h3 class="text-lg font-bold font-headline mb-4">Tips Admin</h3>
            <p class="text-sm text-white/70 leading-relaxed font-body mb-6">Pastikan hasil wawancara diinput
              selambat-lambatnya 24 jam setelah sesi selesai untuk memvalidasi status kelulusan secara tepat waktu.</p>
            <div class="h-1 bg-white/20 rounded-full overflow-hidden">
              <div class="h-full bg-secondary w-2/3"></div>
            </div>
          </div>
        </div>

        <div class="bg-surface-container-high p-8 rounded-[2rem] border border-outline-variant/10">
          <h3 class="text-lg font-bold text-primary font-headline mb-4">Informasi Sesi</h3>
          <div class="space-y-4 font-body">
            <div class="flex justify-between items-center py-2 border-b border-outline-variant/20">
              <span class="text-xs text-on-surface-variant font-bold">Waktu Server</span>
              <span class="text-xs font-bold text-primary italic">22:05 WIB</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-outline-variant/20">
              <span class="text-xs text-on-surface-variant font-bold">Database Health</span>
              <span class="text-xs font-bold text-secondary">OPTIMAL</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
