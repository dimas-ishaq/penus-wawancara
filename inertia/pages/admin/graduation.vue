<script setup lang="ts">
import { Head, useForm, router } from '@inertiajs/vue3'
import { ref, computed, h, watch } from 'vue'
import { utils, write, read } from 'xlsx'
import { debounce } from 'lodash-es'
import { toast } from 'vue-sonner'
import DataTable from '~/components/DataTable.vue'
import ConfirmDeleteModal from '~/components/ConfirmDeleteModal.vue'
import type { ColumnDef } from '@tanstack/vue-table'

// Shadcn UI Components
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { 
  Plus,
  Download, 
  Upload, 
  FileSpreadsheet, 
  FileText, 
  CheckCircle2, 
  Search,
  Clock,
  Trash2,
  Pencil,
  Filter,
  ChevronDownIcon
} from 'lucide-vue-next'
import { 
  getLocalTimeZone, 
  today, 
  parseDate, 
  type DateValue 
} from '@internationalized/date'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'

const props = defineProps<{
  announcementDate?: string
  students: {
    data: any[]
    meta: any
  }
  stats: {
    total: number
    lulus: number
    tidakLulus: number
  }
  uniqueClasses: string[]
  allClasses: any[]
  allMajors: any[]
  search?: string
}>()

const settingsForm = useForm({
  announcementAt: props.announcementDate || '',
})

const datePart = ref<DateValue>(props.announcementDate ? parseDate(props.announcementDate.split('T')[0]) : today(getLocalTimeZone()))
const timePart = ref(props.announcementDate?.includes('T') ? props.announcementDate.split('T')[1].substring(0, 5) : '00:00')
const isDatePopoverOpen = ref(false)

watch([datePart, timePart], ([newDate, newTime]) => {
  settingsForm.announcementAt = `${newDate.toString()}T${newTime}`
}, { immediate: true })

const submitSettings = () => {
  settingsForm.post('/admin/graduation/settings', {
    onSuccess: () => toast.success('Waktu pengumuman berhasil disimpan')
  })
}

const showAddModal = ref(false)
const addForm = useForm({
  nisn: '',
  name: '',
  class: '',
  majorCode: '',
  status: 'Pending',
})

const submitAddStudent = () => {
  addForm.post('/admin/graduation/students', {
    onSuccess: () => {
      toast.success('Siswa berhasil ditambahkan')
      showAddModal.value = false
      addForm.reset()
    },
    onError: (errors) => {
      if (errors.nisn) toast.error(errors.nisn)
    }
  })
}

const showEditModal = ref(false)
const selectedStudentId = ref<number | null>(null)
const editForm = useForm({
  nisn: '',
  name: '',
  class: '',
  majorCode: '',
  status: 'Pending',
})

const openEditModal = (student: any) => {
  selectedStudentId.value = student.id
  editForm.nisn = student.nisn
  editForm.name = student.name
  editForm.class = student.class
  editForm.majorCode = student.majorCode || ''
  editForm.status = student.status
  showEditModal.value = true
}

const submitEditStudent = () => {
  if (!selectedStudentId.value) return
  editForm.put(`/admin/graduation/students/${selectedStudentId.value}`, {
    onSuccess: () => {
      toast.success('Data siswa berhasil diperbarui')
      showEditModal.value = false
      editForm.reset()
    },
    onError: (errors) => {
      if (errors.nisn) toast.error(errors.nisn)
    }
  })
}

const students = computed(() => props.students.data)
const searchQuery = ref(props.search || '')
const selectedClass = ref('all')

const handleSearch = debounce((query: string) => {
  router.get('/admin/graduation', { search: query, class: selectedClass.value !== 'all' ? selectedClass.value : undefined }, {
    preserveState: true,
    preserveScroll: true,
    replace: true
  })
}, 300)

watch(searchQuery, (newVal) => {
  handleSearch(newVal)
})

watch(selectedClass, (newVal) => {
  router.get('/admin/graduation', { search: searchQuery.value, class: newVal !== 'all' ? newVal : undefined }, {
    preserveState: true,
    preserveScroll: true,
    replace: true
  })
})

const uniqueClasses = computed(() => props.uniqueClasses)

const updateStatus = (student: any, newStatus: string) => {
  const form = useForm({ status: newStatus })
  form.put(`/admin/graduation/students/${student.id}/status`, {
    preserveScroll: true,
    onSuccess: () => toast.success(`Status ${student.name} diperbarui`)
  })
}

const batchUpdate = (status: string) => {
  const form = useForm({ status })
  form.post('/admin/graduation/students/batch-update', {
    preserveScroll: true,
    onSuccess: () => toast.success('Berhasil update masal')
  })
}

// Import/Export Logic (Keeping existing logic but integrating into UI)
const fileInput = ref<HTMLInputElement | null>(null)
const previewData = ref<any[]>([])
const showPreview = ref(false)

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
        nisn: String(row.NIS || row.nis || row.NISN || row.nisn || ''),
        name: row.Nama || row.Nama_Siswa || row.nama || '',
        class: row.Kelas || row.kelas || '',
        majorCode: row.Jurusan || row.Kode_Jurusan || row.majorCode || '',
        status: row.Status || row.status || 'Pending',
      }))
      showPreview.value = true
    } catch (err) {
      toast.error('Gagal membaca file excel')
    }
  }
  reader.readAsArrayBuffer(file)
  target.value = ''
}

const s2ab = (s: string) => {
  const buf = new ArrayBuffer(s.length)
  const view = new Uint8Array(buf)
  for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF
  return buf
}

const downloadTemplate = () => {
  const ws = utils.json_to_sheet([
    { NIS: '0061112223', Nama: 'Contoh Nama', Kelas: 'XII RPL 1', Jurusan: 'RPL', Status: 'Lulus' }
  ])
  const wb = utils.book_new()
  utils.book_append_sheet(wb, ws, 'Template')
  const wbout = write(wb, { bookType: 'xlsx', type: 'binary' })
  const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.setAttribute('download', 'template_import.xlsx')
  a.click()
}

const exportToExcel = () => {
  const ws = utils.json_to_sheet(students.value.map(s => ({
    'NIS': s.nisn, 'Nama': s.name, 'Kelas': s.class, 'Jurusan': s.majorCode, 'Status': s.status
  })))
  const wb = utils.book_new()
  utils.book_append_sheet(wb, ws, 'Data Kelulusan')
  const wbout = write(wb, { bookType: 'xlsx', type: 'binary' })
  const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.setAttribute('download', 'data_kelulusan.xlsx')
  a.click()
}

const showDeleteModal = ref(false)
const studentToDelete = ref<any>(null)

const deleteStudent = (student: any) => {
  studentToDelete.value = student
  showDeleteModal.value = true
}

const confirmDeleteStudent = () => {
  const form = useForm({})
  form.delete(`/admin/graduation/students/${studentToDelete.value.id}`, {
    onSuccess: () => {
      toast.success(`Data siswa ${studentToDelete.value.name} dihapus`)
      showDeleteModal.value = false
    }
  })
}

const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'nisn',
    header: 'NIS',
    cell: ({ row }) => h('div', { class: 'font-mono text-xs font-bold' }, row.original.nisn),
  },
  {
    accessorKey: 'name',
    header: 'Nama Siswa',
    cell: ({ row }) => h('div', { class: 'font-medium text-sm' }, row.original.name),
  },
  {
    accessorKey: 'class',
    header: 'Kelas',
    cell: ({ row }) => h(Badge, { variant: 'outline', class: 'text-[10px] px-2 py-0' }, () => row.original.class),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status?.toLowerCase().trim()
      const variant = status === 'lulus' ? 'success' : (status === 'tidak lulus' ? 'destructive' : (status === 'di tangguhkan' ? 'warning' : 'secondary'))
      return h(Badge, {
        variant,
        class: [
          'uppercase px-3 py-1 text-[10px] tracking-wider font-black',
          status === 'tidak lulus' ? 'bg-red-600 text-white border-transparent shadow-sm' : '',
          status === 'lulus' ? 'bg-emerald-500 text-white border-transparent shadow-sm' : '',
          status === 'di tangguhkan' ? 'bg-amber-500 text-white border-transparent shadow-sm' : '',
          status !== 'lulus' && status !== 'tidak lulus' && status !== 'di tangguhkan' ? 'bg-muted text-muted-foreground border-transparent' : ''
        ]
      }, () => row.original.status)
    },
  },
  {
    id: 'actions',
    header: 'Aksi',
    cell: ({ row }) => h('div', { class: 'flex gap-2' }, [
      h(Button, { 
        size: 'sm', 
        class: [
          'h-8 px-4 text-xs font-black transition-all',
          row.original.status === 'Lulus' 
            ? 'bg-emerald-500 text-white hover:bg-emerald-600 border-transparent shadow-sm' 
            : 'bg-background text-primary border border-outline-variant/30 hover:bg-surface-container-low'
        ],
        onClick: () => updateStatus(row.original, 'Lulus') 
      }, () => 'Lulus'),
      h(Button, { 
        size: 'sm', 
        class: [
          'h-8 px-4 text-xs font-black transition-all',
          row.original.status === 'Tidak lulus' 
            ? 'bg-red-600 text-white hover:bg-red-700 border-transparent shadow-sm' 
            : 'bg-white text-primary border border-outline-variant/30 hover:bg-surface-container-low'
        ],
        onClick: () => updateStatus(row.original, 'Tidak lulus') 
      }, () => 'Tidak lulus'),
      h(Button, { 
        size: 'sm', 
        variant: 'ghost', 
        class: 'h-8 w-8 p-0 text-primary',
        onClick: () => openEditModal(row.original) 
      }, () => h(Pencil, { class: 'w-4 h-4' })),
      h(Button, { 
        size: 'sm', 
        variant: 'ghost', 
        class: 'h-8 w-8 p-0 text-destructive',
        onClick: () => deleteStudent(row.original) 
      }, () => h(Trash2, { class: 'w-4 h-4' })),
    ]),
  },
]
</script>

<template>
  <Head title="Siswa & Kelulusan" />

  <div class="space-y-6 no-print">
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-primary">Siswa & Kelulusan</h1>
        <p class="text-muted-foreground mt-1 text-sm">Manajemen data siswa dan penetapan status kelulusan akhir.</p>
      </div>
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <div class="flex flex-wrap items-center gap-2 sm:gap-0 sm:inline-flex shadow-sm rounded-xl overflow-hidden border border-outline-variant/20 sm:border-none">
          <Button variant="outline" class="flex-1 sm:flex-none rounded-xl sm:rounded-none px-3 sm:px-4 h-10 text-xs" @click="downloadTemplate">
            <Download class="w-3.5 h-3.5 mr-2" /> Template
          </Button>
          <Button variant="outline" class="flex-1 sm:flex-none rounded-xl sm:rounded-none px-3 sm:px-4 h-10 text-xs border-l sm:border-l-0" @click="fileInput?.click()">
            <Upload class="w-3.5 h-3.5 mr-2" /> Import
          </Button>
          <Button variant="outline" class="flex-1 sm:flex-none rounded-xl sm:rounded-none px-3 sm:px-4 h-10 text-xs border-l sm:border-l-0" @click="exportToExcel">
            <FileSpreadsheet class="w-3.5 h-3.5 mr-2" /> Ekspor
          </Button>
          <Button variant="secondary" class="flex-1 sm:flex-none rounded-xl sm:rounded-none px-5 h-10 text-xs border-l sm:border-l-0" @click="batchUpdate('Lulus')">
            <CheckCircle2 class="w-3.5 h-3.5 mr-2" /> Lulus Masal
          </Button>
        </div>
        <Button class="rounded-xl px-6 h-11 shadow-lg shadow-primary/20 flex items-center justify-center gap-2 font-black w-full sm:w-auto" @click="showAddModal = true">
          <Plus class="w-5 h-5" /> Tambah Siswa
        </Button>
      </div>
    </div>

    <Card class="bg-primary/5 border-primary/20">
      <CardHeader>
        <div class="flex items-center gap-2">
          <Clock class="w-5 h-5 text-primary" />
          <CardTitle class="text-lg sm:text-xl">Waktu Pengumuman</CardTitle>
        </div>
        <CardDescription class="text-xs sm:text-sm">Atur kapan hasil kelulusan dapat diakses secara publik oleh siswa.</CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="submitSettings" class="flex flex-col xl:flex-row xl:items-end gap-6 max-w-4xl">
          <div class="flex flex-col sm:flex-row gap-4">
            <div class="flex flex-col gap-2">
              <Label for="date-picker" class="px-1 text-[10px] font-bold text-outline-variant uppercase">Tanggal</Label>
              <Popover v-model:open="isDatePopoverOpen">
                <PopoverTrigger as-child>
                  <Button
                    id="date-picker"
                    variant="outline"
                    class="w-full sm:w-56 justify-between font-bold text-primary h-12 rounded-2xl bg-background border-outline-variant/20 shadow-sm"
                  >
                    {{ datePart ? datePart.toDate(getLocalTimeZone()).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : "Pilih Tanggal" }}
                    <ChevronDownIcon class="w-4 h-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent class="w-auto overflow-hidden p-0 rounded-2xl border-outline-variant/30 shadow-xl" align="start">
                  <Calendar
                    :model-value="datePart"
                    @update:model-value="(value) => {
                      if (value) {
                        datePart = value
                        isDatePopoverOpen = false
                      }
                    }"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div class="flex flex-col gap-2">
              <Label for="time-picker" class="px-1 text-[10px] font-bold text-outline-variant uppercase">Waktu</Label>
              <Input
                id="time-picker"
                v-model="timePart"
                type="time"
                class="bg-background h-12 rounded-2xl border-outline-variant/20 shadow-sm font-bold text-primary w-full sm:w-32 px-4"
              />
            </div>
          </div>
          <Button type="submit" :disabled="settingsForm.processing" class="h-12 px-8 rounded-2xl shadow-lg shadow-primary/20 w-full xl:w-auto font-black">
            Simpan Waktu Pengumuman
          </Button>
        </form>
      </CardContent>
    </Card>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 font-body">
      <!-- Total Siswa -->
      <Card class="bg-card border-outline-variant/20 shadow-sm overflow-hidden group">
        <CardContent class="p-6 sm:p-8">
          <div class="flex items-center gap-4 sm:gap-6">
            <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm shrink-0">
              <span class="material-symbols-outlined text-2xl">groups</span>
            </div>
            <div>
              <p class="text-[10px] font-black text-outline uppercase tracking-[0.2em] mb-1">Total Siswa</p>
              <h3 class="text-xl sm:text-2xl font-black text-on-surface font-headline tracking-tighter">{{ stats.total }}</h3>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Siswa Lulus -->
      <Card class="bg-card border-outline-variant/20 shadow-sm overflow-hidden group">
        <CardContent class="p-6 sm:p-8">
          <div class="flex items-center gap-4 sm:gap-6">
            <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-sm shrink-0">
              <span class="material-symbols-outlined text-2xl">verified</span>
            </div>
            <div>
              <div class="flex items-center gap-2 mb-1">
                <p class="text-[10px] font-black text-outline uppercase tracking-[0.2em]">Siswa Lulus</p>
                <Badge class="bg-emerald-500 text-white text-[8px] font-black px-2 py-0 h-4 border-transparent uppercase tracking-widest">LULUS</Badge>
              </div>
              <h3 class="text-xl sm:text-2xl font-black text-emerald-500 font-headline tracking-tighter">{{ stats.lulus }}</h3>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Siswa Tidak Lulus -->
      <Card class="bg-card border-outline-variant/20 shadow-sm overflow-hidden group sm:col-span-2 lg:col-span-1">
        <CardContent class="p-6 sm:p-8">
          <div class="flex items-center gap-4 sm:gap-6">
            <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-red-600/10 flex items-center justify-center text-red-600 shadow-sm shrink-0">
              <span class="material-symbols-outlined text-2xl">cancel</span>
            </div>
            <div>
              <div class="flex items-center gap-2 mb-1">
                <p class="text-[10px] font-black text-outline uppercase tracking-[0.2em]">Tidak Lulus</p>
                <Badge class="bg-red-600 text-white text-[8px] font-black px-2 py-0 h-4 border-transparent uppercase tracking-widest">GAGAL</Badge>
              </div>
              <h3 class="text-xl sm:text-2xl font-black text-red-600 font-headline tracking-tighter">{{ stats.tidakLulus }}</h3>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <Card>
      <CardHeader>
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 flex-grow">
            <div class="grow flex items-center gap-3 bg-background px-4 py-2 rounded-xl border border-outline-variant/20 shadow-sm min-w-0">
              <div class="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center text-outline shrink-0">
                <Search class="h-4 w-4" />
              </div>
              <Input v-model="searchQuery" placeholder="Cari nama atau NIS..." class="border-none bg-transparent h-10 shadow-none focus-visible:ring-0 px-0 min-w-0" />
            </div>
            <Select v-model="selectedClass">
              <SelectTrigger class="w-full sm:w-48 h-12 sm:h-10">
                <SelectValue placeholder="Semua Kelas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="c in uniqueClasses" :key="c" :value="c">
                  {{ c === 'all' ? 'Semua Kelas' : c }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div class="flex items-center gap-2 justify-end">
            <Button variant="outline" size="icon" class="h-12 w-12 sm:h-10 sm:w-10" @click="window.print()">
              <FileText class="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable :columns="columns" :data="students" />

        <!-- Pagination -->
        <div class="flex flex-col sm:flex-row items-center justify-between gap-6 mt-8 px-2">
          <div class="text-[10px] sm:text-xs text-outline font-bold uppercase tracking-[0.1em] text-center sm:text-left">
            Menampilkan 
            <span class="text-primary">{{ ((props.students.meta.currentPage - 1) * props.students.meta.perPage) + 1 }}</span> - 
            <span class="text-primary">{{ Math.min(props.students.meta.currentPage * props.students.meta.perPage, props.students.meta.total) }}</span> 
            dari <span class="text-primary">{{ props.students.meta.total }}</span> data
          </div>
          
          <Pagination 
            :total="props.students.meta.total" 
            :sibling-count="1" 
            :show-edges="true" 
            :page="props.students.meta.currentPage"
            :items-per-page="props.students.meta.perPage"
            @update:page="(p) => router.get('/admin/graduation', { 
              page: p,
              search: searchQuery,
              class: selectedClass !== 'all' ? selectedClass : undefined
            }, { preserveScroll: true, preserveState: true })"
          >
            <PaginationContent v-slot="{ items }" class="flex items-center gap-1">
              <PaginationPrevious />

              <template v-for="(item, index) in items">
                <PaginationItem 
                  v-if="item.type === 'page'" 
                  :key="index" 
                  :value="item.value"
                  :is-active="item.value === props.students.meta.currentPage"
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
      title="Hapus Data Kelulusan?"
      description="Data siswa ini akan dihapus permanen. Siswa tersebut tidak akan bisa mengecek hasil kelulusan lagi."
      :item-name="studentToDelete?.name"
      @close="showDeleteModal = false"
      @confirm="confirmDeleteStudent"
    />



    <!-- Add Student Modal -->
    <Dialog v-model:open="showAddModal">
      <DialogContent class="w-[95%] max-w-[500px] rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader class="p-6 sm:p-8 bg-primary text-white text-left">
          <DialogTitle class="text-xl sm:text-2xl font-black font-headline">Tambah Siswa Baru</DialogTitle>
          <DialogDescription class="text-white/80 font-medium text-xs sm:text-sm">
            Masukkan data siswa untuk pengecekan kelulusan.
          </DialogDescription>
        </DialogHeader>
        
        <form @submit.prevent="submitAddStudent" class="p-6 sm:p-8 space-y-4 sm:space-y-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="nisn" class="text-[10px] font-black uppercase tracking-widest text-outline">NIS / NISN</Label>
              <Input id="nisn" v-model="addForm.nisn" placeholder="Contoh: 006111..." required class="h-12 rounded-xl border-outline-variant/30 focus:ring-primary font-bold" />
            </div>
            <div class="space-y-2">
              <Label for="name" class="text-[10px] font-black uppercase tracking-widest text-outline">Nama Lengkap</Label>
              <Input id="name" v-model="addForm.name" placeholder="Nama Siswa" required class="h-12 rounded-xl border-outline-variant/30 focus:ring-primary font-bold" />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="class" class="text-[10px] font-black uppercase tracking-widest text-outline">Kelas</Label>
              <Select v-model="addForm.class" required>
                <SelectTrigger class="h-12 rounded-xl border-outline-variant/30 font-bold">
                  <SelectValue placeholder="Pilih Kelas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="c in props.allClasses" :key="c.id" :value="c.name">
                    {{ c.name }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="space-y-2">
              <Label for="major" class="text-[10px] font-black uppercase tracking-widest text-outline">Jurusan</Label>
              <Select v-model="addForm.majorCode" required>
                <SelectTrigger class="h-12 rounded-xl border-outline-variant/30 font-bold">
                  <SelectValue placeholder="Pilih Jurusan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="m in props.allMajors" :key="m.id" :value="m.code">
                    {{ m.name }} ({{ m.code }})
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div class="space-y-2">
            <Label for="status" class="text-[10px] font-black uppercase tracking-widest text-outline">Status Awal</Label>
            <Select v-model="addForm.status">
              <SelectTrigger class="h-12 rounded-xl border-outline-variant/30 font-bold">
                <SelectValue placeholder="Pilih Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Lulus">Lulus</SelectItem>
                <SelectItem value="Tidak lulus">Tidak lulus</SelectItem>
                <SelectItem value="Di Tangguhkan">Di Tangguhkan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter class="pt-4">
            <Button type="button" variant="ghost" class="rounded-xl h-12 px-6 font-bold" @click="showAddModal = false">Batal</Button>
            <Button type="submit" :disabled="addForm.processing" class="rounded-xl h-12 px-8 font-black shadow-lg shadow-primary/20">
              Simpan Data Siswa
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>

    <!-- Edit Student Modal -->
    <Dialog v-model:open="showEditModal">
      <DialogContent class="w-[95%] max-w-[500px] rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader class="p-6 sm:p-8 bg-primary text-white text-left">
          <DialogTitle class="text-xl sm:text-2xl font-black font-headline">Edit Data Siswa</DialogTitle>
          <DialogDescription class="text-white/80 font-medium text-xs sm:text-sm">
            Perbarui informasi siswa untuk pengecekan kelulusan.
          </DialogDescription>
        </DialogHeader>
        
        <form @submit.prevent="submitEditStudent" class="p-6 sm:p-8 space-y-4 sm:space-y-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="edit-nisn" class="text-[10px] font-black uppercase tracking-widest text-outline">NIS / NISN</Label>
              <Input id="edit-nisn" v-model="editForm.nisn" placeholder="Contoh: 006111..." required class="h-12 rounded-xl border-outline-variant/30 focus:ring-primary font-bold" />
            </div>
            <div class="space-y-2">
              <Label for="edit-name" class="text-[10px] font-black uppercase tracking-widest text-outline">Nama Lengkap</Label>
              <Input id="edit-name" v-model="editForm.name" placeholder="Nama Siswa" required class="h-12 rounded-xl border-outline-variant/30 focus:ring-primary font-bold" />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="edit-class" class="text-[10px] font-black uppercase tracking-widest text-outline">Kelas</Label>
              <Select v-model="editForm.class" required>
                <SelectTrigger class="h-12 rounded-xl border-outline-variant/30 font-bold">
                  <SelectValue placeholder="Pilih Kelas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="c in props.allClasses" :key="c.id" :value="c.name">
                    {{ c.name }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="space-y-2">
              <Label for="edit-major" class="text-[10px] font-black uppercase tracking-widest text-outline">Jurusan</Label>
              <Select v-model="editForm.majorCode" required>
                <SelectTrigger class="h-12 rounded-xl border-outline-variant/30 font-bold">
                  <SelectValue placeholder="Pilih Jurusan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="m in props.allMajors" :key="m.id" :value="m.code">
                    {{ m.name }} ({{ m.code }})
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div class="space-y-2">
            <Label for="edit-status" class="text-[10px] font-black uppercase tracking-widest text-outline">Status</Label>
            <Select v-model="editForm.status">
              <SelectTrigger class="h-12 rounded-xl border-outline-variant/30 font-bold">
                <SelectValue placeholder="Pilih Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Lulus">Lulus</SelectItem>
                <SelectItem value="Tidak lulus">Tidak lulus</SelectItem>
                <SelectItem value="Di Tangguhkan">Di Tangguhkan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter class="pt-4">
            <Button type="button" variant="ghost" class="rounded-xl h-12 px-6 font-bold" @click="showEditModal = false">Batal</Button>
            <Button type="submit" :disabled="editForm.processing" class="rounded-xl h-12 px-8 font-black shadow-lg shadow-primary/20">
              Simpan Perubahan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  </div>

  <!-- Print Template -->
  <div class="only-print p-8">
    <h1 class="text-2xl font-bold text-center mb-8">DAFTAR KELULUSAN SISWA</h1>
    <table class="w-full border-collapse border">
      <thead>
        <tr class="bg-muted">
          <th class="border p-2">NIS</th>
          <th class="border p-2">Nama</th>
          <th class="border p-2">Kelas</th>
          <th class="border p-2">Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="s in students" :key="s.id">
          <td class="border p-2 font-mono">{{ s.nisn }}</td>
          <td class="border p-2">{{ s.name }}</td>
          <td class="border p-2 text-center">{{ s.class }}</td>
          <td class="border p-2 text-center font-bold">{{ s.status }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style>
@media screen { .only-print { display: none; } }
@media print {
  .no-print { display: none; }
  .only-print { display: block; }
}
</style>
