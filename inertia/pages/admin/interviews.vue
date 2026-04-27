<script setup lang="ts">
import { Head, usePage, Link, useForm, router } from '@inertiajs/vue3'
import { ref, h, watch, computed } from 'vue'
import { utils, write, read } from 'xlsx'
import { debounce } from 'lodash-es'
import { toast } from 'vue-sonner'
import DataTable from '~/components/DataTable.vue'
import ConfirmDeleteModal from '~/components/ConfirmDeleteModal.vue'
import ConfirmModal from '~/components/ConfirmModal.vue'
import type { ColumnDef } from '@tanstack/vue-table'

// Shadcn UI Components
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DatePicker } from '@/components/ui/date-picker'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card'
import {
  UserPlus,
  FileSpreadsheet,
  FileText,
  Search,
  Trash2,
  Edit3,
  Calendar as CalendarIcon,
  Download,
  Upload
} from 'lucide-vue-next'

const props = defineProps<{
  interviews: {
    data: any[]
    meta: any
  }
  search?: string
}>()

const page = usePage()

const students = computed(() => props.interviews.data.map(i => ({
  id: i.id,
  name: i.studentName,
  school: i.schoolOrigin,
  status: i.status,
  score: i.totalScore || 0,
  createdAt: i.createdAt,
  originalData: i
})))

const searchQuery = ref(props.search || '')
const startDate = ref('')
const endDate = ref('')
const statusFilter = ref('all')
const perPage = ref(props.interviews.meta.perPage.toString())

const handleFilter = debounce(() => {
  router.get('/admin/interviews', { 
    search: searchQuery.value,
    status: statusFilter.value !== 'all' ? statusFilter.value : undefined,
    startDate: startDate.value || undefined,
    endDate: endDate.value || undefined,
    perPage: perPage.value
  }, {
    preserveState: true,
    preserveScroll: true,
    replace: true
  })
}, 300)

watch([searchQuery, statusFilter, startDate, endDate, perPage], () => {
  handleFilter()
})

const showDeleteModal = ref(false)
const interviewToDelete = ref<any>(null)

const deleteInterview = (student: any) => {
  interviewToDelete.value = student
  showDeleteModal.value = true
}

const confirmDeleteInterview = () => {
  const formDelete = useForm({})
  formDelete.delete(`/admin/interviews/${interviewToDelete.value.id}`, {
    onSuccess: () => {
      toast.success(`Data wawancara ${interviewToDelete.value.name} dihapus`)
      showDeleteModal.value = false
    }
  })
}

const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'id',
    header: 'ID Pendaftar',
    cell: ({ row }) => h('span', { class: 'font-mono font-bold text-primary' }, row.original.id),
  },
  {
    accessorKey: 'name',
    header: 'Nama Lengkap',
    cell: ({ row }) => h('div', { class: 'font-medium' }, row.original.name),
  },
  {
    accessorKey: 'school',
    header: 'Asal Sekolah',
    cell: ({ row }) => h('div', { class: 'text-muted-foreground text-sm' }, row.original.school),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => h(Badge, {
      variant: row.original.status === 'Done' ? 'success' : 'secondary',
      class: [
        'uppercase px-3 py-1 text-[10px] font-bold tracking-wider',
        row.original.status === 'Done' ? 'bg-emerald-500 text-white border-transparent' : '',
        row.original.status === 'Pending' ? 'bg-muted text-muted-foreground border-transparent' : ''
      ]
    }, () => row.original.status === 'Done' ? 'SELESAI' : 'PENDING'),
  },
  {
    id: 'actions',
    header: 'Aksi',
    cell: ({ row }) => h('div', { class: 'flex gap-2' }, [
      h(Link, {
        href: `/admin/interviews/${row.original.id}/recap`,
      }, () => h(Button, { size: 'sm', variant: 'outline', class: 'gap-2 font-semibold' }, () => [
        h(Edit3, { class: 'w-3.5 h-3.5' }),
        'Input Hasil'
      ])),
      row.original.status === 'Done' ? h('a', {
        href: `/admin/interviews/${row.original.id}/pdf`,
        target: '_blank',
      }, h(Button, { size: 'sm', variant: 'outline', class: 'text-muted-foreground hover:bg-muted transition-all' }, () => h(Download, { class: 'w-4 h-4' }))) : null,
      h(Button, {
        size: 'sm',
        variant: 'ghost',
        class: 'text-destructive',
        onClick: () => deleteInterview(row.original)
      }, () => h(Trash2, { class: 'w-4 h-4' })),
    ]),
  },
]

const s2ab = (s: string) => {
  const buf = new ArrayBuffer(s.length)
  const view = new Uint8Array(buf)
  for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF
  return buf
}

const exportToExcel = () => {
  const params = new URLSearchParams()
  if (startDate.value) params.append('startDate', startDate.value)
  if (endDate.value) params.append('endDate', endDate.value)

  // Add client timestamp (ISO format)
  params.append('clientTime', new Date().toISOString())

  window.location.href = `/admin/interviews/export?${params.toString()}`
}

// Import Logic
const fileInput = ref<HTMLInputElement | null>(null)
const previewData = ref<any[]>([])
const showPreview = ref(false)

const downloadTemplate = () => {
  const ws = utils.json_to_sheet([
    { 'Nama Siswa': 'Andi Pratama', 'Asal Sekolah': 'SMPN 1 Bandung' },
    { 'Nama Siswa': 'Siti Aminah', 'Asal Sekolah': 'SMPN 2 Bandung' }
  ])
  const wb = utils.book_new()
  utils.book_append_sheet(wb, ws, 'Template')
  const wbout = write(wb, { bookType: 'xlsx', type: 'binary' })
  const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.setAttribute('download', 'template_import_wawancara.xlsx')
  a.click()
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
        studentName: row['Nama Siswa'] || row['nama'] || '',
        schoolOrigin: row['Asal Sekolah'] || row['sekolah'] || '',
      }))
      showPreview.value = true
    } catch (err) {
      toast.error('Gagal membaca file excel')
    }
  }
  reader.readAsArrayBuffer(file)
  target.value = ''
}

const confirmImport = () => {
  const form = useForm({ students: previewData.value })
  form.post('/admin/interviews/import', {
    onSuccess: () => {
      toast.success('Data wawancara berhasil diimpor')
      showPreview.value = false
      previewData.value = []
    }
  })
}
</script>

<template>

  <Head title="Manajemen Wawancara" />

  <div class="space-y-6 no-print">
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-primary">Manajemen Wawancara</h1>
        <p class="text-muted-foreground mt-1 text-sm">Kelola hasil seleksi wawancara dan rekapitulasi calon siswa.</p>
      </div>
      <div class="flex flex-wrap items-center gap-2 sm:gap-0 sm:inline-flex shadow-sm rounded-xl overflow-hidden">
        <Button variant="outline" class="rounded-xl sm:rounded-none px-3 sm:px-4 h-10 text-xs" @click="downloadTemplate">
          <Download class="w-3.5 h-3.5 mr-2" /> Template
        </Button>
        <Button variant="outline" class="rounded-xl sm:rounded-none px-3 sm:px-4 h-10 text-xs border-l sm:border-l-0" @click="fileInput?.click()">
          <Upload class="w-3.5 h-3.5 mr-2" /> Import
        </Button>
        <Button variant="outline" class="rounded-xl sm:rounded-none px-3 sm:px-4 h-10 text-xs border-l sm:border-l-0" @click="exportToExcel">
          <FileSpreadsheet class="w-3.5 h-3.5 mr-2" /> Excel
        </Button>
        <Link href="/admin/interviews/create" class="w-full sm:w-auto">
          <Button class="rounded-xl sm:rounded-none px-5 h-10 gap-2 border-l sm:border-l-0 w-full">
            <UserPlus class="w-3.5 h-3.5" /> Tambah Pendaftar
          </Button>
        </Link>
      </div>
    </div>

    <!-- Filters -->
    <Card>
      <CardHeader class="pb-3">
        <div class="flex flex-col xl:flex-row xl:items-center gap-4">
          <div class="relative flex-grow max-w-full xl:max-w-md">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input v-model="searchQuery" placeholder="Cari nama atau nomor pendaftaran..." class="pl-10 h-11 sm:h-10 rounded-xl" />
          </div>

          <div class="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center bg-background border border-outline-variant/20 rounded-xl sm:rounded-2xl shadow-sm overflow-hidden divide-y sm:divide-y-0 sm:divide-x divide-outline-variant/20">
            <div class="flex items-center px-4 h-10 bg-muted/30">
              <span class="text-[10px] font-black text-outline uppercase tracking-widest">Filter:</span>
            </div>
            
            <div class="flex items-center divide-x divide-outline-variant/20">
              <DatePicker v-model="startDate" class="h-10 w-full sm:w-32 text-xs rounded-none border-0 shadow-none focus:ring-0" placeholder="Mulai" />
              <DatePicker v-model="endDate" class="h-10 w-full sm:w-32 text-xs rounded-none border-0 shadow-none focus:ring-0" placeholder="Selesai" />
            </div>

            <Select v-model="statusFilter">
              <SelectTrigger class="w-full sm:w-36 h-10 rounded-none border-0 shadow-none focus:ring-0">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Done">Selesai</SelectItem>
              </SelectContent>
            </Select>

            <div class="flex items-center px-4 h-10 bg-muted/10">
              <span class="text-[10px] font-black text-outline uppercase tracking-widest mr-3">Limit:</span>
              <Select v-model="perPage">
                <SelectTrigger class="w-20 h-7 text-xs rounded-lg border border-outline-variant/30 shadow-none focus:ring-0 bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable :columns="columns" :data="students" />

        <!-- Pagination -->
        <div class="flex flex-col sm:flex-row items-center justify-between gap-6 mt-8 px-2">
          <div class="text-[10px] sm:text-xs text-outline font-bold uppercase tracking-[0.1em] text-center sm:text-left">
            Menampilkan 
            <span class="text-primary">{{ ((props.interviews.meta.currentPage - 1) * props.interviews.meta.perPage) + 1 }}</span> - 
            <span class="text-primary">{{ Math.min(props.interviews.meta.currentPage * props.interviews.meta.perPage, props.interviews.meta.total) }}</span> 
            dari <span class="text-primary">{{ props.interviews.meta.total }}</span> data
          </div>
          
          <Pagination 
            :total="props.interviews.meta.total" 
            :sibling-count="1" 
            :show-edges="true" 
            :page="props.interviews.meta.currentPage"
            :items-per-page="props.interviews.meta.perPage"
            @update:page="(p) => router.get('/admin/interviews', { 
              page: p,
              search: searchQuery,
              status: statusFilter !== 'all' ? statusFilter : undefined,
              startDate: startDate || undefined,
              endDate: endDate || undefined
            }, { preserveScroll: true, preserveState: true })"
          >
            <PaginationContent v-slot="{ items }" class="flex items-center gap-1">
              <PaginationPrevious />

              <template v-for="(item, index) in items">
                <PaginationItem 
                  v-if="item.type === 'page'" 
                  :key="index" 
                  :value="item.value"
                  :is-active="item.value === props.interviews.meta.currentPage"
                >
                  {{ item.value }}
                </PaginationItem>
                <PaginationEllipsis v-else :key="item.type" :index="index" />
              </template>

              <PaginationNext />
            </PaginationContent>
          </Pagination>
        </div>
      </CardContent>
    </Card>

    <input type="file" ref="fileInput" class="hidden" @change="handleFileUpload" />

    <ConfirmDeleteModal 
      :show="showDeleteModal" 
      title="Hapus Data Wawancara?"
      description="Data ini akan dihapus secara permanen dari basis data seleksi. Pastikan Anda telah melakukan rekap jika diperlukan."
      :item-name="interviewToDelete?.name" 
      @close="showDeleteModal = false"
      @confirm="confirmDeleteInterview" 
    />

    <ConfirmModal :show="showPreview" title="Konfirmasi Impor Data"
      :message="`Apakah Anda yakin ingin mengimpor ${previewData.length} data wawancara ini?`"
      @close="showPreview = false" @confirm="confirmImport">
      <div class="mt-4 max-h-60 overflow-y-auto border rounded-lg">
        <table class="w-full text-xs">
          <thead class="bg-muted sticky top-0">
            <tr>
              <th class="p-2 border text-left">Nama Siswa</th>
              <th class="p-2 border text-left">Asal Sekolah</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, i) in previewData" :key="i">
              <td class="p-2 border">{{ row.studentName }}</td>
              <td class="p-2 border">{{ row.schoolOrigin }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </ConfirmModal>
  </div>

  <!-- Print Template -->
  <div class="only-print p-8">
    <h1 class="text-2xl font-bold text-center mb-8">BERITA ACARA WAWANCARA</h1>
    <table class="w-full border-collapse border">
      <thead>
        <tr class="bg-muted">
          <th class="border p-2">ID</th>
          <th class="border p-2">Nama Siswa</th>
          <th class="border p-2">Asal Sekolah</th>
          <th class="border p-2">Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="s in students" :key="s.id">
          <td class="border p-2 font-mono">{{ s.id }}</td>
          <td class="border p-2">{{ s.name }}</td>
          <td class="border p-2">{{ s.school }}</td>
          <td class="border p-2 text-center font-bold">{{ s.status }}</td>
        </tr>
      </tbody>
    </table>
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
}
</style>
