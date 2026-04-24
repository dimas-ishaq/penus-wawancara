<script setup lang="ts">
import { onMounted, onUnmounted, computed } from 'vue'
import { Head, router } from '@inertiajs/vue3'
import ApexChart from 'vue3-apexcharts'

const props = defineProps<{
  stats: any[]
  recentActivities: any[]
  charts: {
    registrationTrend: { categories: string[], series: any[] }
    interviewStatus: { labels: string[], series: number[] }
    infoSource: { labels: string[], series: number[] }
  }
}>()

// Polling for real-time updates
let interval: any
onMounted(() => {
  interval = setInterval(() => {
    router.reload({ 
      only: ['stats', 'recentActivities', 'charts'], 
      preserveState: true,
      preserveScroll: true 
    })
  }, 30000) // Refresh every 30 seconds
})

onUnmounted(() => {
  if (interval) clearInterval(interval)
})

// Chart Configurations
const registrationTrendOptions = computed(() => ({
  chart: {
    id: 'registration-trend',
    toolbar: { show: false },
    fontFamily: 'Inter, sans-serif'
  },
  colors: ['#003366', '#FF9900'],
  stroke: { curve: 'smooth', width: 3 },
  xaxis: {
    categories: props.charts.registrationTrend.categories,
    labels: { style: { colors: '#64748b', fontWeight: 600 } }
  },
  yaxis: {
    labels: { style: { colors: '#64748b', fontWeight: 600 } }
  },
  grid: {
    borderColor: '#f1f5f9',
    strokeDashArray: 4
  },
  dataLabels: { enabled: false },
  tooltip: { theme: 'light' }
}))

const interviewStatusOptions = computed(() => ({
  chart: { id: 'interview-status', fontFamily: 'Inter, sans-serif' },
  labels: props.charts.interviewStatus.labels,
  colors: ['#f59e0b', '#22c55e', '#ef4444'], // Pending, Done, Canceled
  legend: { position: 'bottom', fontWeight: 600 },
  plotOptions: {
    pie: {
      donut: {
        size: '75%',
        labels: {
          show: true,
          total: {
            show: true,
            label: 'Total',
            formatter: () => props.stats[0].value
          }
        }
      }
    }
  },
  dataLabels: { enabled: false }
}))

const infoSourceOptions = computed(() => ({
  chart: { 
    id: 'info-source', 
    fontFamily: 'Inter, sans-serif',
    toolbar: { show: false }
  },
  plotOptions: {
    bar: {
      borderRadius: 10,
      horizontal: true,
      distributed: true,
      dataLabels: { position: 'top' }
    }
  },
  colors: ['#003366', '#FF9900', '#22c55e', '#ef4444', '#8b5cf6', '#ec4899'],
  xaxis: {
    categories: props.charts.infoSource.labels,
    labels: { style: { colors: '#64748b', fontWeight: 600 } }
  },
  dataLabels: {
    enabled: true,
    offsetX: -6,
    style: { fontSize: '12px', colors: ['#fff'] }
  },
  legend: { show: false }
}))
</script>

<template>
  <Head title="Admin Dashboard" />

  <div class="space-y-10">
    <header class="flex justify-between items-end">
      <div>
        <h1 class="text-3xl font-black text-primary tracking-tighter font-headline mb-2">Overview Dashboard</h1>
        <p class="text-on-surface-variant font-body text-sm">Selamat datang kembali di panel administrasi. Berikut ringkasan data terbaru hari ini.</p>
      </div>
      <div class="flex items-center gap-2 bg-surface-container-high px-4 py-2 rounded-2xl border border-outline-variant/10 shadow-sm">
        <span class="w-2 h-2 bg-secondary rounded-full animate-pulse"></span>
        <span class="text-[10px] font-black text-primary uppercase tracking-widest">Live Updates</span>
      </div>
    </header>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-body">
      <div v-for="stat in props.stats" :key="stat.name"
        class="bg-surface-container-low p-6 rounded-3xl border border-outline-variant/10 shadow-sm flex flex-col justify-between group hover:bg-surface-container-high transition-all">
        <div class="flex justify-between items-start mb-6">
          <div :class="['w-12 h-12 rounded-2xl flex items-center justify-center text-white', stat.color]">
            <span class="material-symbols-outlined">{{ stat.icon }}</span>
          </div>
          <span class="text-xs font-bold text-on-surface-variant group-hover:text-primary tracking-tighter transition-colors">Lihat Detail</span>
        </div>
        <div>
          <div class="text-2xl font-black text-primary tracking-tighter font-headline">{{ stat.value }}</div>
          <div class="text-[10px] font-bold text-outline uppercase tracking-widest">{{ stat.name }}</div>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <!-- Area Chart -->
      <div class="lg:col-span-8 bg-surface-container-lowest p-8 rounded-[2rem] border border-outline-variant/10 shadow-sm">
        <div class="flex justify-between items-center mb-6">
          <div>
            <h2 class="text-xl font-bold text-primary font-headline">Tren Pendaftaran</h2>
            <p class="text-xs text-on-surface-variant font-bold uppercase tracking-widest">7 Hari Terakhir</p>
          </div>
          <div class="flex gap-2">
            <span class="px-3 py-1 bg-primary/5 text-primary text-[10px] font-black rounded-full">Automated Refresh</span>
          </div>
        </div>
        <div class="h-[300px]">
          <ApexChart
            type="area"
            height="100%"
            :options="registrationTrendOptions"
            :series="props.charts.registrationTrend.series"
          />
        </div>
      </div>

      <!-- Donut Chart -->
      <div class="lg:col-span-4 bg-surface-container-lowest p-8 rounded-[2rem] border border-outline-variant/10 shadow-sm">
        <h2 class="text-xl font-bold text-primary font-headline mb-6 text-center">Distribusi Wawancara</h2>
        <div class="h-[300px] flex items-center justify-center">
          <ApexChart
            type="donut"
            height="100%"
            :options="interviewStatusOptions"
            :series="props.charts.interviewStatus.series"
          />
        </div>
      </div>
    </div>

    <!-- Main Section: Recent Activity & Analysis -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <!-- Recent Activity -->
      <div class="lg:col-span-7 bg-surface-container-lowest p-8 rounded-[2rem] border border-outline-variant/10 shadow-sm">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-xl font-bold text-primary font-headline flex items-center gap-3">
            <span class="material-symbols-outlined text-secondary">history</span>
            Log Aktivitas Terbaru
          </h2>
          <button class="text-xs font-bold text-primary hover:underline">LIHAT SEMUA</button>
        </div>

        <div class="space-y-6">
          <div v-for="activity in props.recentActivities" :key="activity.id"
            class="flex items-center gap-6 p-4 rounded-2xl hover:bg-surface-container-low transition-colors group">
            <div class="w-10 h-10 rounded-xl bg-surface-container-low group-hover:bg-primary/10 flex items-center justify-center text-primary border border-outline-variant/20 transition-all">
              <span class="material-symbols-outlined text-xl">person</span>
            </div>
            <div class="grow font-body">
              <p class="text-sm font-bold text-primary">
                {{ activity.user }} <span class="font-normal text-on-surface-variant">{{ activity.action }}</span> {{ activity.student }}
              </p>
              <p class="text-[10px] text-outline font-bold uppercase tracking-tighter">{{ activity.time }}</p>
            </div>
            <span class="material-symbols-outlined text-outline group-hover:text-primary transition-colors">chevron_right</span>
          </div>
          <div v-if="props.recentActivities.length === 0" class="text-center py-8 text-on-surface-variant font-body text-sm italic">
            Belum ada aktivitas terbaru.
          </div>
        </div>
      </div>

      <!-- Information Source Analysis -->
      <div class="lg:col-span-5 bg-surface-container-lowest p-8 rounded-[2rem] border border-outline-variant/10 shadow-sm">
        <div class="mb-6 text-center">
          <h2 class="text-xl font-bold text-primary font-headline">Analisis Sumber Informasi</h2>
          <p class="text-xs text-on-surface-variant font-bold uppercase tracking-widest">Efetivitas Pemasaran</p>
        </div>
        <div class="h-[350px]">
          <ApexChart
            type="bar"
            height="100%"
            :options="infoSourceOptions"
            :series="[{ name: 'Jumlah Siswa', data: props.charts.infoSource.series }]"
          />
        </div>
      </div>
    </div>

    <!-- Session Info Card -->
    <div class="bg-surface-container-high p-8 rounded-[2rem] border border-outline-variant/10 flex justify-between items-center">
      <div class="flex items-center gap-6">
        <div class="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
          <span class="material-symbols-outlined">analytics</span>
        </div>
        <div>
          <h3 class="text-lg font-bold text-primary font-headline">Informasi Sesi & Sistem</h3>
          <p class="text-sm text-on-surface-variant font-body">Status database dan server saat ini dalam kondisi optimal.</p>
        </div>
      </div>
      <div class="flex gap-8 font-body">
        <div class="text-right">
          <span class="block text-[10px] text-outline font-bold uppercase tracking-widest">Waktu Server</span>
          <span class="text-sm font-bold text-primary">22:05 WIB</span>
        </div>
        <div class="text-right">
          <span class="block text-[10px] text-outline font-bold uppercase tracking-widest">Database Health</span>
          <span class="text-sm font-bold text-secondary italic">OPTIMAL</span>
        </div>
      </div>
    </div>
  </div>
</template>
