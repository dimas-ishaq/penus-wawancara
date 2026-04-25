<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3'

const props = defineProps<{
  backups: Array<{
    name: string
    size: string
    createdAt: string
  }>
}>()

const downloadBackup = (name: string) => {
  window.open(`/admin/backups/download/${name}`, '_blank')
}
</script>

<template>
  <Head title="Manajemen Backup Data" />

  <div class="max-w-6xl space-y-8">
    <header class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <h1 class="text-3xl font-black text-primary tracking-tighter font-headline mb-2">Pencadangan Data</h1>
        <p class="text-on-surface-variant font-body text-sm">Amankan data siswa dan hasil wawancara Anda secara berkala.</p>
      </div>
      <Link 
        href="/admin/backups"
        method="post"
        as="button"
        type="button"
        class="px-8 py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all flex items-center gap-3 cursor-pointer"
      >
        <span class="material-symbols-outlined">backup</span>
        BUAT BACKUP SEKARANG
      </Link>
    </header>

    <div class="bg-card rounded-[32px] border border-outline-variant/30 overflow-hidden shadow-sm">
      <div class="p-8 border-b border-outline-variant/10 bg-surface-container-low">
        <h3 class="font-black text-primary uppercase tracking-widest text-xs">Daftar File Cadangan</h3>
      </div>
      
      <div class="divide-y divide-outline-variant/10">
        <div v-if="backups.length === 0" class="p-20 text-center space-y-4">
          <span class="material-symbols-outlined text-6xl text-outline-variant">cloud_off</span>
          <p class="text-on-surface-variant font-medium">Belum ada file backup yang tersedia.</p>
        </div>
        
        <div v-for="backup in backups" :key="backup.name" class="p-6 flex items-center justify-between hover:bg-surface-container-lowest transition-colors group">
          <div class="flex items-center gap-5">
            <div class="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
              <span class="material-symbols-outlined">description</span>
            </div>
            <div>
              <p class="font-black text-primary text-sm">{{ backup.name }}</p>
              <div class="flex items-center gap-3 text-xs text-on-surface-variant font-medium">
                <span>{{ backup.size }}</span>
                <span class="w-1 h-1 rounded-full bg-outline-variant"></span>
                <span>{{ new Date(backup.createdAt).toLocaleString('id-ID') }}</span>
              </div>
            </div>
          </div>
          
          <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              @click="downloadBackup(backup.name)"
              class="p-3 hover:bg-primary/10 text-primary rounded-xl transition-colors flex items-center gap-2 font-bold text-xs"
            >
              <span class="material-symbols-outlined text-lg">download</span>
              Unduh
            </button>
            <Link 
              :href="`/admin/backups/${backup.name}`"
              method="delete"
              as="button"
              type="button"
              :onBefore="() => confirm('Apakah Anda yakin ingin menghapus backup ini?')"
              class="p-3 hover:bg-error/10 text-error rounded-xl transition-colors flex items-center gap-2 font-bold text-xs cursor-pointer"
            >
              <span class="material-symbols-outlined text-lg">delete</span>
              Hapus
            </Link>
          </div>
        </div>
      </div>
    </div>

    <!-- Instructions -->
    <div class="bg-primary/5 rounded-[32px] p-8 border border-primary/10 space-y-4">
      <div class="flex items-center gap-3 text-primary">
        <span class="material-symbols-outlined">info</span>
        <h4 class="font-black uppercase tracking-widest text-xs">Tentang Backup Data</h4>
      </div>
      <ul class="space-y-2 text-sm text-on-surface-variant font-medium leading-relaxed">
        <li>• Backup mencakup data siswa, hasil wawancara, pengaturan sekolah, dan log sistem.</li>
        <li>• File disimpan dalam format JSON yang dapat digunakan untuk pemulihan data di masa mendatang.</li>
        <li>• Disarankan untuk mengunduh file backup ke penyimpanan lokal atau cloud (Google Drive) secara rutin.</li>
        <li>• Untuk mengotomatiskan backup (Cronjob), Anda dapat mendaftarkan perintah <code class="bg-white px-2 py-0.5 rounded border">node ace backup:data</code> pada Task Scheduler server Anda.</li>
      </ul>
    </div>
  </div>
</template>
