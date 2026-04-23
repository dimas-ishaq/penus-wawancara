<script setup lang="ts">
import { Head, usePage, Link, useForm } from '@inertiajs/vue3'
import { ref, h, watch, computed, onMounted } from 'vue'
import { utils, write } from 'xlsx'
import { toast } from 'vue-sonner'
import DataTable from '~/components/DataTable.vue'
import ConfirmDeleteModal from '~/components/ConfirmDeleteModal.vue'
import type { ColumnDef } from '@tanstack/vue-table'

const props = defineProps<{
  interviews: any[]
}>()

const page = usePage()
const currentUser = computed(() => page.props.user as any)

const students = ref(props.interviews.map(i => ({
  id: i.id,
  name: i.studentName,
  school: i.schoolOrigin,
  status: i.status,
  score: i.totalScore || 0,
  createdAt: i.createdAt,
  originalData: i
})))

// Sync students ref when props change (after Inertia POST)
watch(() => props.interviews, (newData) => {
  students.value = newData.map(i => ({
    id: i.id,
    name: i.studentName,
    school: i.schoolOrigin,
    status: i.status,
    createdAt: i.createdAt,
    originalData: i
  }))
}, { deep: true })



// Filtering State
const searchQuery = ref('')
const startDate = ref('')
const endDate = ref('')
const statusFilter = ref('Semua Status')

const filteredStudents = computed(() => {
  return students.value.filter(s => {
    // 1. Search Query Filter (min 3 chars)
    const matchesSearch = searchQuery.value.length < 3 ||
      s.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      s.id.toLowerCase().includes(searchQuery.value.toLowerCase())

    // 2. Status Filter
    const matchesStatus = statusFilter.value === 'Semua Status' ||
      (statusFilter.value === 'Selesai' && s.status === 'Done') ||
      (statusFilter.value === 'Pending' && s.status === 'Pending')

    // 3. Date Filter
    let matchesDate = true
    if (startDate.value || endDate.value) {
      const studentDate = new Date(s.createdAt)
      if (startDate.value) {
        const start = new Date(startDate.value)
        start.setHours(0, 0, 0, 0)
        matchesDate = matchesDate && studentDate >= start
      }
      if (endDate.value) {
        const end = new Date(endDate.value)
        end.setHours(23, 59, 59, 999)
        matchesDate = matchesDate && studentDate <= end
      }
    }

    return matchesSearch && matchesStatus && matchesDate
  })
})

const showDeleteModal = ref(false)
const interviewToDelete = ref<any>(null)

const deleteInterview = (student) => {
  interviewToDelete.value = student
  showDeleteModal.value = true
}

const confirmDeleteInterview = () => {
  if (!interviewToDelete.value) return

  const formDelete = useForm({})
  formDelete.delete(`/admin/interviews/${interviewToDelete.value.id}`, {
    preserveScroll: true,
    onSuccess: () => {
      toast.success(`Data wawancara ${interviewToDelete.value.name} berhasil dihapus`)
      showDeleteModal.value = false
      interviewToDelete.value = null
    }
  })
}

const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'id',
    header: 'ID Pendaftar',
    cell: ({ row }) => h('span', { class: 'font-headline font-black text-primary' }, row.original.id),
  },
  {
    accessorKey: 'name',
    header: 'Nama Lengkap',
    cell: ({ row }) => h('div', { class: 'font-bold text-primary' }, row.original.name),
  },
  {
    accessorKey: 'school',
    header: 'Asal Sekolah',
    cell: ({ row }) => h('div', { class: 'text-on-surface-variant text-sm' }, row.original.school),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => h('span', {
      class: [
        'px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest',
        row.original.status === 'Done' ? 'bg-secondary/10 text-secondary' : 'bg-outline-variant/20 text-outline'
      ]
    }, row.original.status),
  },
  {
    id: 'actions',
    header: 'Aksi',
    meta: { headerClass: 'justify-end', cellClass: 'text-right' },
    cell: ({ row }) => h('div', { class: 'flex justify-end gap-2' }, [
      h(Link, {
        href: `/admin/interviews/${row.original.id}/recap`,
        class: 'inline-flex items-center gap-2 text-primary font-bold text-xs hover:bg-primary hover:text-white px-4 py-1.5 rounded-xl transition-all border border-primary/20'
      }, [
        h('span', { class: 'material-symbols-outlined text-sm' }, 'edit_square'),
        'INPUT HASIL'
      ]),
      row.original.status === 'Done' ? h('a', {
        href: `/admin/interviews/${row.original.id}/pdf`,
        target: '_blank',
        class: 'inline-flex items-center gap-2 bg-secondary text-on-secondary font-bold text-xs hover:scale-105 px-4 py-1.5 rounded-xl transition-all shadow-sm shadow-secondary/20'
      }, [
        h('span', { class: 'material-symbols-outlined text-sm' }, 'picture_as_pdf'),
        'PDF'
      ]) : null,
      h('button', {
        onClick: () => deleteInterview(row.original),
        class: 'w-8 h-8 flex items-center justify-center rounded-xl bg-error/10 text-error hover:bg-error hover:text-white transition-all border border-error/20'
      }, [
        h('span', { class: 'material-symbols-outlined text-[18px]' }, 'delete')
      ])
    ]),
  },
]

// --- Export Features ---

// Helper: String to ArrayBuffer
const s2ab = (s: string) => {
  const buf = new ArrayBuffer(s.length)
  const view = new Uint8Array(buf)
  for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF
  return buf
}

const exportToExcel = () => {
  try {
    const dataToExport = filteredStudents.value.map(s => {
      const d = s.originalData || {}
      const char = d.characterAnswers || {}
      const par = d.parentCommitments || {}
      const bill = d.billingDetails || {}

      return {
        'ID Pendaftar': s.id,
        'Nama Lengkap': s.name,
        'Asal Sekolah': s.school,
        'Status Wawancara': s.status === 'Done' ? 'Selesai' : 'Pending',
        'Tanggal Wawancara': d.interviewDate ? new Date(d.interviewDate).toLocaleDateString('id-ID') : '-',
        'Pewawancara': d.interviewer || '-',
        'Pendamping': d.accompaniment || '-',
        'Sumber Informasi': d.infoSource || '-',
        'Alasan Pilih Sekolah': d.reasonChoosingSchool || '-',
        'Pilihan Jurusan': d.majorChoice || '-',
        'Harapan Jangka Panjang': d.longTermGoals || '-',
        'Jarak Rumah (km)': char.homeDistance || '-',
        'Transportasi': char.travelMethod || '-',
        'Komitmen Kendaraan': char.vehicleCommitment ? 'Ya' : 'Tidak',
        'Komitmen Kehadiran': char.presenceCommitment ? 'Ya' : 'Tidak',
        'Komitmen Alfa': char.alfaCommitment ? 'Ya' : 'Tidak',
        'Komitmen Disiplin': char.disciplineCommitment ? 'Ya' : 'Tidak',
        'Komitmen Kebersihan': char.cleanlinessCommitment ? 'Ya' : 'Tidak',
        'Kegiatan Trilingual': d.specialActivities || '-',
        'Persetujuan Pelanggaran': d.violationAgreement ? 'Setuju' : 'Tidak',
        'Dukungan Ortu': par.fullSupport ? 'Ya' : 'Tidak',
        'Penyediaan Laptop': par.laptopProvision ? 'Ya' : 'Tidak',
        'Izin PKL Jauh': par.pklConsent ? 'Ya' : 'Tidak',
        'Izin Pemeriksaan Gadget': par.deviceCheckConsent ? 'Ya' : 'Tidak',
        'Tinggal Bersama': d.livingWith || '-',
        'Kontak Darurat': d.emergencyContact || '-',
        'Penanggung Jawab Biaya': bill.name || '-',
        'Hubungan PJ': bill.relationship || '-',
        'Pekerjaan PJ': bill.job || '-',
        'Sumber Biaya Lain': bill.otherSource || '-',
        'Waktu Registrasi': new Date(s.createdAt).toLocaleString('id-ID')
      }
    })

    const ws = utils.json_to_sheet(dataToExport)
    const wb = utils.book_new()
    utils.book_append_sheet(wb, ws, 'Hasil Wawancara')

    const wbout = write(wb, { bookType: 'xlsx', type: 'binary' })
    const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' })

    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.setAttribute('download', `rekap_wawancara_ppdb_${new Date().getTime()}.xlsx`)
    document.body.appendChild(a)
    a.click()

    setTimeout(() => {
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    }, 100)

    toast.success(`Berhasil mengekspor ${dataToExport.length} data wawancara`)
  } catch (error) {
    console.error('Export error:', error)
    toast.error('Gagal mengekspor data: ' + (error as Error).message)
  }
}

const exportToPdf = () => {
  window.print()
}
</script>

<template>

  <Head title="Manajemen Wawancara" />

  <div class="space-y-8 no-print">
    <header class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div>
        <h1 class="text-3xl font-black text-primary tracking-tighter font-headline mb-2">Manajemen Wawancara</h1>
        <p class="text-on-surface-variant font-body text-sm">Kelola hasil seleksi wawancara calon siswa SMP.</p>
      </div>
      <div class="flex gap-3">
        <Link href="/admin/interviews/create"
          class="px-6 py-3 bg-primary text-white font-bold rounded-2xl flex items-center gap-3 hover:scale-105 transition-all shadow-lg shadow-primary/20 font-body">
          <span class="material-symbols-outlined">person_add</span>
          Tambah Pendaftar
        </Link>
        <button @click="exportToExcel"
          class="px-6 py-3 bg-secondary text-on-secondary font-bold rounded-2xl flex items-center gap-3 hover:scale-105 transition-all shadow-lg shadow-secondary/20 font-body">
          <span class="material-symbols-outlined">table_view</span>
          Excel
        </button>
        <button @click="exportToPdf"
          class="px-6 py-3 bg-surface-container-high text-primary font-bold rounded-2xl flex items-center gap-3 hover:scale-105 transition-all shadow-lg shadow-primary/20 font-body">
          <span class="material-symbols-outlined">picture_as_pdf</span>
          PDF
        </button>
      </div>
    </header>

    <!-- Filter & Search -->
    <div
      class="bg-surface-container-low p-6 rounded-3xl border border-outline-variant/30 flex flex-wrap gap-4 items-center">
      <div
        class="grow flex items-center gap-3 bg-surface-container-lowest px-5 py-3 rounded-xl border border-outline-variant/20 shadow-sm min-w-[250px]">
        <span class="material-symbols-outlined text-outline">search</span>
        <input v-model="searchQuery" type="text" placeholder="Cari nama atau nomor pendaftaran (min. 3 huruf)..."
          class="grow bg-transparent border-none outline-none font-body text-sm text-primary" />
      </div>

      <div class="flex items-center gap-2 bg-surface-container-lowest px-4 py-2 rounded-xl border border-outline-variant/20 shadow-sm">
        <label class="text-[10px] font-black text-outline uppercase tracking-wider">Dari:</label>
        <input type="date" v-model="startDate"
          class="bg-transparent border-none outline-none font-body text-xs text-primary" />
      </div>

      <div class="flex items-center gap-2 bg-surface-container-lowest px-4 py-2 rounded-xl border border-outline-variant/20 shadow-sm">
        <label class="text-[10px] font-black text-outline uppercase tracking-wider">Sampai:</label>
        <input type="date" v-model="endDate"
          class="bg-transparent border-none outline-none font-body text-xs text-primary" />
      </div>

      <select v-model="statusFilter"
        class="bg-surface-container-lowest px-5 py-3 rounded-xl border border-outline-variant/20 shadow-sm font-body text-sm font-bold text-primary outline-none">
        <option>Semua Status</option>
        <option>Pending</option>
        <option>Selesai</option>
      </select>
    </div>
    <!-- Student Table -->
    <DataTable :columns="columns" :data="filteredStudents" />

    <!-- Custom Delete Confirmation -->
    <ConfirmDeleteModal
      :show="showDeleteModal"
      title="Hapus Data Wawancara"
      description="Apakah Anda yakin ingin menghapus data wawancara pendaftar ini? Semua data rekapitulasi akan hilang secara permanen."
      :item-name="interviewToDelete?.name"
      @close="showDeleteModal = false"
      @confirm="confirmDeleteInterview"
    />
  </div>
>

  <!-- Print Template (Visible only when printing) -->
  <div class="only-print p-12 font-body text-primary">
    <div class="border-b-4 border-primary pb-8 mb-8 flex justify-between items-end">
      <div>
        <h1 class="text-4xl font-black font-headline tracking-tighter">BERITA ACARA WAWANCARA</h1>
        <p class="text-sm font-bold uppercase tracking-widest mt-2">SMK Plus Pelita Nusantara • PPDB TA 2024/2025</p>
      </div>
      <div class="text-right">
        <p class="text-xs font-bold text-outline uppercase">Tanggal Cetak</p>
        <p class="text-lg font-black italic">{{ new Date().toLocaleDateString('id-ID') }}</p>
      </div>
    </div>

    <table class="w-full border-collapse border border-outline-variant/30 mb-12">
      <thead>
        <tr class="bg-surface-container-high font-bold uppercase text-[10px]">
          <th class="border border-outline-variant/30 p-4">ID</th>
          <th class="border border-outline-variant/30 p-4">Nama Siswa</th>
          <th class="border border-outline-variant/30 p-4">Sekolah Asal</th>
          <th class="border border-outline-variant/30 p-4 text-center">Status Wawancara</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="student in students" :key="student.id">
          <td class="border border-outline-variant/30 p-4 font-headline font-bold">{{ student.id }}</td>
          <td class="border border-outline-variant/30 p-4 font-bold">{{ student.name }}</td>
          <td class="border border-outline-variant/30 p-4">{{ student.school }}</td>
          <td class="border border-outline-variant/30 p-4 text-center font-bold">{{ student.status }}</td>
        </tr>
      </tbody>
    </table>

    <div class="flex justify-between pt-20">
      <div class="text-center w-64">
        <p class="text-[10px] font-bold uppercase mb-20 text-outline">Mengetahui, Ketua PPDB</p>
        <div class="border-b-2 border-primary mx-auto w-48 mb-2"></div>
        <p class="font-bold">Drs. H. Ahmad Fauzi</p>
      </div>
      <div class="text-center w-64">
        <p class="text-[10px] font-bold uppercase mb-20 text-outline">Petugas Wawancara</p>
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
  animation: fadeIn 0.4s ease-out;
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
