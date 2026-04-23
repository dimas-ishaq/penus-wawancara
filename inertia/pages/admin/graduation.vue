<script setup lang="ts">
import { Head, useForm } from '@inertiajs/vue3'
import { ref, computed, h, watch } from 'vue'
import { utils, write, read } from 'xlsx'
import { toast } from 'vue-sonner'
import DataTable from '~/components/DataTable.vue'
import ConfirmDeleteModal from '~/components/ConfirmDeleteModal.vue'
import type { ColumnDef } from '@tanstack/vue-table'

const props = defineProps<{
  announcementDate?: string
  students: any[]
}>()

const settingsForm = useForm({
  announcementAt: props.announcementDate || '',
})

const submitSettings = () => {
  settingsForm.post('/admin/graduation/settings')
}

// Student Data using ref for local filtering, but synced with props
const students = ref([...props.students])
watch(() => props.students, (newData) => {
  students.value = [...newData]
}, { deep: true })

const searchQuery = ref('')

const filteredStudents = computed(() => {
  if (searchQuery.value.length > 0 && searchQuery.value.length < 3) return students.value

  return students.value.filter(s =>
    s.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    s.nisn.includes(searchQuery.value)
  )
})

const updateStatus = (student, newStatus) => {
  const form = useForm({ status: newStatus })
  form.put(`/admin/graduation/students/${student.id}/status`, {
    preserveScroll: true,
    onSuccess: () => toast.success(`Status ${student.name} diperbarui`)
  })
}

const batchUpdate = (status) => {
  const form = useForm({ status })
  form.post('/admin/graduation/students/batch-update', {
    preserveScroll: true,
    onSuccess: () => toast.success('Berhasil update masal')
  })
}

// Import Logic
const fileInput = ref<HTMLInputElement | null>(null)
const previewData = ref<any[]>([])
const showPreview = ref(false)

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data = new Uint8Array(e.target?.result as ArrayBuffer)
      const workbook = read(data, { type: 'array' })
      const firstSheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[firstSheetName]
      const json = utils.sheet_to_json(worksheet)

      if (json.length === 0) {
        toast.error('File Excel kosong atau format tidak valid')
        return
      }

      previewData.value = json.map((row: any) => ({
        nisn: String(row.NISN || row.nisn || ''),
        name: row.Nama || row.Nama_Siswa || row.nama || '',
        class: row.Kelas || row.kelas || '',
        majorCode: row.Jurusan || row.Kode_Jurusan || row.majorCode || '',
        status: row.Status || row.status || 'Pending'
      }))
      showPreview.value = true
    } catch (err) {
      console.error('Import error:', err)
      toast.error('Gagal membaca file excel')
    }
  }
  reader.readAsArrayBuffer(file)
  target.value = '' // Reset input
}

const applyImport = () => {
  const form = useForm({ students: previewData.value })
  form.post('/admin/graduation/students/import', {
    onSuccess: () => {
      showPreview.value = false
      toast.success('Data berhasil diimpor ke database')
    }
  })
}

// Helper: String to ArrayBuffer
const s2ab = (s: string) => {
  const buf = new ArrayBuffer(s.length)
  const view = new Uint8Array(buf)
  for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF
  return buf
}

const downloadTemplate = () => {
  console.log('Attempting binary string conversion download...')
  try {
    const ws = utils.json_to_sheet([
      { NISN: '0061112223', Nama: 'Contoh Nama', Kelas: 'XII RPL 1', Jurusan: 'RPL', Status: 'Lulus' },
      { NISN: '0064445556', Nama: 'Siswa Lain', Kelas: 'XII TKJ 2', Jurusan: 'TKJ', Status: 'Pending' }
    ])
    const wb = utils.book_new()
    utils.book_append_sheet(wb, ws, 'Template Import')

    // 1. Generate Excel data as a binary string (Legacy approach)
    const wbout = write(wb, { bookType: 'xlsx', type: 'binary' })

    // 2. Create a Blob using the ArrayBuffer conversion
    const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' })

    // 3. Create a download link and fully enforce the filename
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.setAttribute('download', 'template_import_kelulusan.xlsx')
    document.body.appendChild(a)

    // Trigger the download
    a.click()

    // Cleanup
    setTimeout(() => {
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    }, 100)

    console.log('Manual binary template download triggered successfully')
    toast.success('Template berhasil diunduh (Pasti .xlsx)')
  } catch (error) {
    console.error('Error generating template:', error)
    toast.error('Gagal menghasilkan template: ' + (error as Error).message)
  }
}

const exportToExcel = () => {
  try {
    const dataToExport = filteredStudents.value.map(s => ({
      'NISN': s.nisn,
      'Nama Siswa': s.name,
      'Kelas': s.class,
      'Jurusan': s.majorCode,
      'Status Kelulusan': s.status
    }))

    const ws = utils.json_to_sheet(dataToExport)
    const wb = utils.book_new()
    utils.book_append_sheet(wb, ws, 'Data Kelulusan')

    // Generate binary string
    const wbout = write(wb, { bookType: 'xlsx', type: 'binary' })

    // Create Blob
    const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' })

    // Download
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.setAttribute('download', `data_kelulusan_filtered_${new Date().getTime()}.xlsx`)
    document.body.appendChild(a)
    a.click()

    setTimeout(() => {
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    }, 100)

    toast.success(`Berhasil mengekspor ${dataToExport.length} data`)
  } catch (error) {
    console.error('Export error:', error)
    toast.error('Gagal mengekspor data: ' + (error as Error).message)
  }
}

const showDeleteModal = ref(false)
const studentToDelete = ref<any>(null)

const deleteStudent = (student) => {
  studentToDelete.value = student
  showDeleteModal.value = true
}

const confirmDeleteStudent = () => {
  if (!studentToDelete.value) return

  const form = useForm({})
  form.delete(`/admin/graduation/students/${studentToDelete.value.id}`, {
    preserveScroll: true,
    onSuccess: () => {
      toast.success(`Data siswa ${studentToDelete.value.name} berhasil dihapus`)
      showDeleteModal.value = false
      studentToDelete.value = null
    }
  })
}

const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'nisn',
    header: 'NISN / ID',
    cell: ({ row }) => h('div', {}, [
      h('div', { class: 'font-headline font-black text-primary' }, row.original.nisn),
      h('div', { class: 'text-[9px] text-outline font-bold mt-1 tracking-widest' }, row.original.id),
    ]),
  },
  {
    accessorKey: 'name',
    header: 'Nama Siswa',
    cell: ({ row }) => h('div', { class: 'font-bold text-primary' }, row.original.name),
  },
  {
    accessorKey: 'majorCode',
    header: 'Jurusan',
    cell: ({ row }) => h('span', {
      class: 'px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-black text-primary uppercase tracking-widest'
    }, row.original.majorCode || '-'),
  },
  {
    accessorKey: 'class',
    header: 'Kelas',
    cell: ({ row }) => h('span', {
      class: 'px-3 py-1 bg-surface-container-high rounded-full text-[10px] font-bold text-on-surface-variant italic'
    }, row.original.class),
  },
  {
    accessorKey: 'status',
    header: 'Status Akhir',
    cell: ({ row }) => h('div', { class: 'flex items-center gap-2' }, [
      h('div', {
        class: [
          'w-2 h-2 rounded-full',
          row.original.status === 'Lulus' ? 'bg-green-500 animate-pulse' : row.original.status === 'Tidak Lulus' ? 'bg-error' : 'bg-outline-variant'
        ]
      }),
      h('span', {
        class: [
          'text-[11px] font-black uppercase tracking-tighter',
          row.original.status === 'Lulus' ? 'text-green-600' : row.original.status === 'Tidak Lulus' ? 'text-error' : 'text-outline'
        ]
      }, row.original.status),
    ]),
  },
  {
    id: 'actions',
    header: 'Manajemen Status',
    meta: { headerClass: 'justify-end', cellClass: 'text-right' },
    cell: ({ row }) => h('div', { class: 'flex justify-end gap-2 text-center items-center' }, [
      h('button', {
        onClick: () => updateStatus(row.original, 'Lulus'),
        class: [
          'px-4 py-2 rounded-xl text-[10px] font-black transition-all border',
          row.original.status === 'Lulus' ? 'bg-green-600 text-white border-green-600 shadow-lg shadow-green-600/20' : 'border-outline-variant text-outline hover:border-green-600 hover:text-green-600'
        ]
      }, 'LULUS'),
      h('button', {
        onClick: () => updateStatus(row.original, 'Tidak Lulus'),
        class: [
          'px-4 py-2 rounded-xl text-[10px] font-black transition-all border',
          row.original.status === 'Tidak Lulus' ? 'bg-error text-white border-error shadow-lg shadow-error/20' : 'border-outline-variant text-outline hover:border-error hover:text-error'
        ]
      }, 'TIDAK LULUS'),
      h('button', {
        onClick: () => deleteStudent(row.original),
        class: 'w-8 h-8 flex items-center justify-center rounded-xl bg-error/10 text-error hover:bg-error hover:text-white transition-all border border-error/20 ml-2'
      }, [
        h('span', { class: 'material-symbols-outlined text-[18px]' }, 'delete')
      ])
    ]),
  },
]

const exportToPdf = () => {
  window.print()
}
</script>

<template>

  <Head title="Manajemen Kelulusan" />

  <div class="space-y-8 no-print">
    <header class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div>
        <h1 class="text-3xl font-black text-primary tracking-tighter font-headline mb-2">Manajemen Kelulusan</h1>
        <p class="text-on-surface-variant font-body text-sm">Penetapan status kelulusan akhir siswa kelas XII SMK Plus Pelita
          Nusantara.</p>
      </div>
      <div class="flex flex-wrap gap-2">
        <button @click="downloadTemplate"
          class="px-4 py-2.5 border border-outline-variant/30 text-outline font-bold rounded-xl hover:bg-surface-container-low transition-all font-body text-[10px] flex items-center gap-2">
          <span class="material-symbols-outlined text-sm">download</span>
          TEMPLATE
        </button>
        <button @click="triggerFileInput"
          class="px-4 py-2.5 bg-secondary text-on-secondary font-bold rounded-xl hover:scale-105 transition-all font-body text-[10px] shadow-lg shadow-secondary/10 flex items-center gap-2">
          <span class="material-symbols-outlined text-sm">upload_file</span>
          IMPORT EXCEL
        </button>
        <button @click="exportToExcel"
          class="px-4 py-2.5 bg-green-600 text-white font-bold rounded-xl hover:scale-105 transition-all font-body text-[10px] shadow-lg shadow-green-600/10 flex items-center gap-2">
          <span class="material-symbols-outlined text-sm">table_view</span>
          EKSPOR HASIL
        </button>
        <button @click="exportToPdf"
          class="px-4 py-2.5 bg-surface-container-high text-primary font-bold rounded-xl hover:scale-105 transition-all font-body text-[10px] shadow-lg shadow-primary/20 flex items-center gap-2">
          <span class="material-symbols-outlined text-sm">picture_as_pdf</span>
          PDF
        </button>
        <button @click="batchUpdate('Lulus')"
          class="px-4 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all font-body text-[10px]">
          SET LULUS MASAL
        </button>
      </div>
    </header>

    <!-- Announcement Settings -->
    <section
      class="bg-primary/5 rounded-[2rem] p-8 border border-primary/10 flex flex-col md:flex-row gap-8 items-center justify-between">
      <div class="space-y-2">
        <h2 class="text-xl font-black text-primary font-headline flex items-center gap-2">
          <span class="material-symbols-outlined">schedule</span>
          Pengaturan Waktu Pengumuman
        </h2>
        <p class="text-sm text-on-surface-variant font-body">Tentukan kapan hasil kelulusan dapat diakses secara publik
          oleh siswa.</p>
      </div>

      <form @submit.prevent="submitSettings" class="flex flex-wrap items-center gap-4 w-full md:w-auto">
        <div class="relative grow md:grow-0">
          <input v-model="settingsForm.announcementAt" type="datetime-local"
            class="bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-5 py-3 font-bold text-primary focus:ring-2 focus:ring-primary outline-none transition-all w-full" />
        </div>
        <button type="submit" :disabled="settingsForm.processing"
          class="px-8 py-3 bg-primary text-white font-black rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50">
          Simpan
        </button>
      </form>
    </section>

    <!-- Hidden File Input -->
    <input type="file" ref="fileInput" class="hidden" accept=".xlsx, .xls, .csv" @change="handleFileUpload" />

    <!-- Stats Summary -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 font-body">
      <div class="bg-surface-container-low p-6 rounded-3xl border border-outline-variant/10 shadow-sm">
        <p class="text-[10px] font-black text-outline uppercase tracking-widest mb-1">Total Siswa XII</p>
        <p class="text-3xl font-black text-primary font-headline">{{ students.length }}</p>
      </div>
      <div class="bg-green-50 p-6 rounded-3xl border border-green-200 shadow-sm">
        <p class="text-[10px] font-black text-green-700 uppercase tracking-widest mb-1">Dinyatakan Lulus</p>
        <p class="text-3xl font-black text-green-600 font-headline">{{students.filter(s => s.status === 'Lulus').length
          }}</p>
      </div>
      <div class="bg-error/10 p-6 rounded-3xl border border-error/20 shadow-sm">
        <p class="text-[10px] font-black text-error uppercase tracking-widest mb-1">Terdeteksi Bermasalah</p>
        <p class="text-3xl font-black text-error font-headline">{{ students.filter(s => s.status === 'Tidak Lulus').length }}</p>
      </div>
    </div>

    <!-- Search & Filter -->
    <div class="bg-surface-container-low p-6 rounded-3xl border border-outline-variant/30 flex gap-4 items-center">
      <div
        class="grow flex items-center gap-3 bg-surface-container-lowest px-5 py-3 rounded-xl border border-outline-variant/20 shadow-sm min-w-[250px]">
        <span class="material-symbols-outlined text-outline">search</span>
        <input v-model="searchQuery" type="text" placeholder="Cari nama atau NISN (min. 3 huruf)..."
          class="grow bg-transparent border-none outline-none font-body text-sm text-primary" />
      </div>
      <select
        class="bg-surface-container-lowest px-5 py-3 rounded-xl border border-outline-variant/20 shadow-sm font-body text-sm font-bold text-primary outline-none">
        <option>Semua Kelas</option>
        <option>XII RPL 1</option>
        <option>XII TKJ 1</option>
      </select>
    </div>

    <!-- Graduation Table -->
    <DataTable :columns="columns" :data="filteredStudents" />

    <!-- Custom Delete Confirmation -->
    <ConfirmDeleteModal
      :show="showDeleteModal"
      title="Hapus Data Kelulusan"
      description="Apakah Anda yakin ingin menghapus data kelulusan siswa ini? Tindakan ini tidak dapat dibatalkan dan data akan hilang permanen."
      :item-name="studentToDelete?.name"
      @close="showDeleteModal = false"
      @confirm="confirmDeleteStudent"
    />

    <!-- Import Preview Modal -->
    <Teleport to="body">
      <div v-if="showPreview" class="fixed inset-0 z-[100] flex items-center justify-center p-8">
        <div class="absolute inset-0 bg-black/90 backdrop-blur-xl animate-fade-in" @click="showPreview = false"></div>
        <div
          class="relative bg-white w-full max-w-4xl max-h-[80vh] rounded-[2.5rem] shadow-2xl border border-outline-variant/30 overflow-hidden flex flex-col">
          <div class="bg-surface-container-high p-8 flex justify-between items-center shrink-0">
            <div>
              <h3 class="text-2xl font-black text-primary font-headline tracking-tight text-center">Preview Data Import
              </h3>
              <p class="text-xs text-on-surface-variant font-body font-bold mt-1 uppercase tracking-widest">Ditemukan {{
                previewData.length }} baris data siap diproses</p>
            </div>
            <button @click="showPreview = false"
              class="w-10 h-10 rounded-full hover:bg-white transition-colors flex items-center justify-center text-outline">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <div class="p-8 overflow-y-auto grow">
            <table class="w-full text-left font-body text-xs">
              <thead class="sticky top-0 bg-surface-container-lowest">
                <tr class="border-b border-outline-variant/30 bg-surface-container-lowest">
                  <th class="p-4 font-black uppercase tracking-widest text-outline">NISN</th>
                  <th class="p-4 font-black uppercase tracking-widest text-outline">Nama</th>
                  <th class="p-4 font-black uppercase tracking-widest text-outline">Kelas</th>
                  <th class="p-4 font-black uppercase tracking-widest text-outline">Jurusan</th>
                  <th class="p-4 font-black uppercase tracking-widest text-outline">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-outline-variant/10">
                <tr v-for="(row, idx) in previewData" :key="idx" class="hover:bg-primary/5">
                  <td class="p-4 font-headline font-bold text-primary">{{ row.nisn }}</td>
                  <td class="p-4 font-bold">{{ row.name }}</td>
                  <td class="p-4 text-on-surface-variant italic">{{ row.class }}</td>
                  <td class="p-4 font-black text-primary">{{ row.majorCode || '-' }}</td>
                  <td class="p-4">
                    <span :class="[
                      'px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest',
                      row.status === 'Lulus' ? 'bg-green-100 text-green-700' : 'bg-outline-variant/20 text-outline'
                    ]">
                      {{ row.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="p-8 bg-surface-container-low border-t border-outline-variant/20 flex gap-4 shrink-0">
            <button @click="applyImport"
              class="grow py-5 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.01] transition-transform">
              KONFIRMASI & IMPORT SEKARANG
            </button>
            <button @click="showPreview = false"
              class="px-8 py-5 border border-outline-variant/30 text-outline font-bold rounded-2xl hover:bg-white">
              BATAL
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>

  <!-- Print Template (Visible only when printing) -->
  <div class="only-print p-12 font-body text-primary">
    <div class="border-b-4 border-primary pb-8 mb-8 flex justify-between items-end">
      <div>
        <h1 class="text-4xl font-black font-headline tracking-tighter uppercase">DAFTAR KELULUSAN SISWA</h1>
        <p class="text-sm font-bold uppercase tracking-widest mt-2">SMK Plus Pelita Nusantara • TA 2024/2025</p>
      </div>
      <div class="text-right">
        <p class="text-xs font-bold text-outline uppercase">Tanggal Cetak</p>
        <p class="text-lg font-black italic">{{ new Date().toLocaleDateString('id-ID') }}</p>
      </div>
    </div>

    <table class="w-full border-collapse border border-outline-variant/30 mb-12">
      <thead>
        <tr class="bg-surface-container-high font-bold uppercase text-[10px]">
          <th class="border border-outline-variant/30 p-4 text-left">NISN</th>
          <th class="border border-outline-variant/30 p-4 text-left">Nama Siswa</th>
          <th class="border border-outline-variant/30 p-4 text-left">Jurusan</th>
          <th class="border border-outline-variant/30 p-4 text-left">Kelas</th>
          <th class="border border-outline-variant/30 p-4 text-center">Status Kelulusan</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="student in students" :key="student.id">
          <td class="border border-outline-variant/30 p-4 font-headline font-bold">{{ student.nisn }}</td>
          <td class="border border-outline-variant/30 p-4 font-bold">{{ student.name }}</td>
          <td class="border border-outline-variant/30 p-4">{{ student.majorCode }}</td>
          <td class="border border-outline-variant/30 p-4 italic">{{ student.class }}</td>
          <td class="border border-outline-variant/30 p-4 text-center">
            <span class="font-black uppercase tracking-tighter" :class="student.status === 'Lulus' ? 'text-green-600' : 'text-error'">
              {{ student.status }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="flex justify-between pt-20">
      <div class="text-center w-64">
        <p class="text-[10px] font-bold uppercase mb-20 text-outline">Mengetahui, Kepala Sekolah</p>
        <div class="border-b-2 border-primary mx-auto w-48 mb-2"></div>
        <p class="font-bold">Irman J. Darmawan, S.Kom., M.M.</p>
      </div>
      <div class="text-center w-64">
        <p class="text-[10px] font-bold uppercase mb-20 text-outline">Petugas Kurikulum</p>
        <div class="border-b-2 border-primary mx-auto w-48 mb-2"></div>
        <p class="font-bold">______________________</p>
      </div>
    </div>
  </div>
</template>

<style>
@media screen {
  .only-print {
    display: none;
  }
}

@media print {
  .no-print {
    display: none;
  }

  .only-print {
    display: block;
  }

  body {
    background: white !important;
  }

  @page {
    margin: 2cm;
  }
}

.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
</style>
