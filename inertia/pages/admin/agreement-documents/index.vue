<script setup lang="ts">
import { Head, usePage, Link, useForm, router } from '@inertiajs/vue3'
import { ref, h, watch, computed } from 'vue'
import { debounce } from 'lodash-es'
import { toast } from 'vue-sonner'
import { DateTime } from 'luxon'
import DataTable from '~/components/DataTable.vue'
import ConfirmModal from '~/components/ConfirmModal.vue'
import type { ColumnDef } from '@tanstack/vue-table'

// Shadcn UI Components
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card'
import {
  Search,
  Trash2,
  FileSpreadsheet,
  Upload,
  Download,
  Eye,
  RefreshCw,
  CheckCircle2,
  XCircle,
  FileText,
  MoreHorizontal,
  UserMinus
} from 'lucide-vue-next'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import axios from 'axios'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const props = defineProps<{
  interviews: any[]
  majors: any[]
  filters: {
    search?: string
    major?: string
    status?: string
  }
}>()

const searchQuery = ref(props.filters.search || '')
const majorFilter = ref(props.filters.major || 'all')
const statusFilter = ref(props.filters.status || 'all')
const isLoading = ref(false)

const handleFilter = debounce(() => {
  isLoading.value = true
  router.get('/agreement-documents', {
    search: searchQuery.value,
    major: majorFilter.value !== 'all' ? majorFilter.value : undefined,
    status: statusFilter.value !== 'all' ? statusFilter.value : undefined,
  }, {
    preserveState: true,
    preserveScroll: true,
    replace: true,
    onFinish: () => { isLoading.value = false }
  })
}, 300)

watch([searchQuery, majorFilter, statusFilter], () => {
  handleFilter()
})

// Add Student State
const isAddModalOpen = ref(false)
const interviewSearch = ref('')
const searchResults = ref<any[]>([])
const isSearching = ref(false)

const handleInterviewSearch = debounce(async () => {
  if (interviewSearch.value.length < 2) {
    searchResults.value = []
    return
  }

  isSearching.value = true
  try {
    const response = await axios.get(`/agreement-documents/search?q=${interviewSearch.value}`)
    searchResults.value = response.data
  } catch (error) {
    console.error('Search error:', error)
  } finally {
    isSearching.value = false
  }
}, 300)

watch(interviewSearch, handleInterviewSearch)

const addStudent = (studentId: string) => {
  router.post('/agreement-documents/add', { studentId }, {
    onSuccess: () => {
      isAddModalOpen.value = false
      interviewSearch.value = ''
      searchResults.value = []
    }
  })
}

// Upload State
const uploadType = ref<'parent' | 'student' | null>(null)
const selectedStudent = ref<any>(null)
const fileInput = ref<HTMLInputElement | null>(null)

const openUpload = (student: any, type: 'parent' | 'student') => {
  selectedStudent.value = student
  uploadType.value = type
  fileInput.value?.click()
}

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file || !selectedStudent.value || !uploadType.value) return

  const form = useForm({
    studentId: selectedStudent.value.id,
    file: file
  })

  const url = uploadType.value === 'parent' 
    ? '/agreement-documents/parent-upload' 
    : '/agreement-documents/student-upload'

  form.post(url, {
    onSuccess: () => {
      isManageModalOpen.value = false
      selectedStudentForManagement.value = null
      selectedStudent.value = null
      uploadType.value = null
    },
    onError: (errors) => {
      isManageModalOpen.value = false
    }
  })

  target.value = ''
}

const isManageModalOpen = ref(false)
const selectedStudentForManagement = ref<any>(null)

const confirmDelete = ref(false)
const deleteInfo = ref<{ studentId: string, type: 'parent' | 'student' | 'all', studentName: string } | null>(null)

const openDelete = (student: any, type: 'parent' | 'student' | 'all') => {
  deleteInfo.value = { studentId: student.id, type, studentName: student.studentName }
  confirmDelete.value = true
}

const closeConfirm = () => {
  confirmDelete.value = false
  deleteInfo.value = null
}

const manageStudent = (student: any) => {
  selectedStudentForManagement.value = student
  isManageModalOpen.value = true
}

const handleDelete = () => {
  if (!deleteInfo.value) return
  
  const type = deleteInfo.value.type
  const studentId = deleteInfo.value.studentId

  if (type === 'all') {
    router.delete('/agreement-documents/remove', {
      data: { studentId },
      onSuccess: () => {
        toast.success(`Siswa berhasil dihapus dari daftar`)
        confirmDelete.value = false
        deleteInfo.value = null
        isManageModalOpen.value = false
        selectedStudentForManagement.value = null
      }
    })
    return
  }

  const url = type === 'parent'
    ? `/agreement-documents/${studentId}/parent-upload`
    : `/agreement-documents/${studentId}/student-upload`

  router.delete(url, {
    onSuccess: () => {
      confirmDelete.value = false
      deleteInfo.value = null
      isManageModalOpen.value = false
      selectedStudentForManagement.value = null
    },
    onError: () => {
      confirmDelete.value = false
      isManageModalOpen.value = false
    }
  })
}

const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'studentName',
    header: 'Nama Siswa',
    cell: ({ row }) => h('div', { class: 'flex flex-col' }, [
      h('span', { class: 'font-bold text-sm text-primary' }, row.original.studentName),
      h('span', { class: 'text-[9px] text-muted-foreground uppercase tracking-widest' }, row.original.id)
    ]),
  },
  {
    accessorKey: 'majorChoice',
    header: 'Jurusan',
    cell: ({ row }) => h('div', { class: 'text-[13px] line-clamp-1' }, row.original.majorChoice || '-'),
  },
  {
    id: 'parent_status',
    header: 'Surat Orang Tua',
    cell: ({ row }) => {
      const fileUrl = row.original.agreementDocument?.parentAgreementFileUrl
      if (fileUrl) {
        return h('a', { href: fileUrl, target: '_blank', class: 'block w-fit' }, [
          h(Badge, {
            variant: 'success',
            class: 'text-[10px] font-black uppercase tracking-tighter text-white p-[1px] cursor-pointer hover:bg-emerald-600 transition-colors'
          }, () => 'Lihat Dokumen')
        ])
      }
      return h(Badge, {
        variant: 'destructive',
        class: 'text-[10px] font-black uppercase tracking-tighter text-white p-[1px]'
      }, () => 'Belum')
    }
  },
  {
    id: 'student_status',
    header: 'Surat Siswa',
    cell: ({ row }) => {
      const fileUrl = row.original.agreementDocument?.studentAgreementFileUrl
      if (fileUrl) {
        return h('a', { href: fileUrl, target: '_blank', class: 'block w-fit' }, [
          h(Badge, {
            variant: 'success',
            class: 'text-[10px] font-black uppercase tracking-tighter text-white p-[1px] cursor-pointer hover:bg-emerald-600 transition-colors'
          }, () => 'Lihat Dokumen')
        ])
      }
      return h(Badge, {
        variant: 'destructive',
        class: 'text-[10px] font-black uppercase tracking-tighter text-white p-[1px]'
      }, () => 'Belum')
    }
  },
  {
    id: 'last_upload',
    header: 'Upload Terakhir',
    cell: ({ row }) => {
      const date = row.original.agreementDocument?.updatedAt
      return h('div', { class: 'text-xs text-muted-foreground' }, 
        date ? DateTime.fromISO(date).toFormat('dd/MM/yyyy HH:mm') : '-'
      )
    }
  },
  {
    id: 'actions',
    header: 'Opsi',
    cell: ({ row }) => {
      const student = row.original
      return h('div', { class: 'flex justify-end' }, [
        h(DropdownMenu, {}, {
          default: () => [
            h(DropdownMenuTrigger, { asChild: true }, {
              default: () => h(Button, { variant: 'ghost', size: 'icon', class: 'rounded-xl hover:bg-surface-container-high' }, {
                default: () => h(MoreHorizontal, { class: 'w-5 h-5 text-on-surface-variant' })
              })
            }),
            h(DropdownMenuContent, { align: 'end', class: 'w-48 rounded-2xl border-outline-variant/20 shadow-xl' }, {
              default: () => [
                h(DropdownMenuLabel, { class: 'text-[10px] font-black uppercase tracking-widest text-outline-variant px-3 py-2' }, () => 'Aksi Siswa'),
                h(DropdownMenuSeparator, { class: 'bg-outline-variant/10' }),
                h(DropdownMenuItem, { 
                  class: 'flex items-center gap-2 p-3 rounded-xl cursor-pointer hover:bg-primary/10 transition-colors',
                  onSelect: () => manageStudent(student)
                }, {
                  default: () => [
                    h(FileText, { class: 'w-4 h-4 text-primary' }),
                    h('span', { class: 'text-xs font-black' }, 'Kelola Dokumen')
                  ]
                }),
                h(DropdownMenuItem, { 
                  class: 'flex items-center gap-2 p-3 rounded-xl cursor-pointer hover:bg-error/10 text-error transition-colors',
                  onSelect: () => openDelete(student, 'all')
                }, {
                  default: () => [
                    h(UserMinus, { class: 'w-4 h-4' }),
                    h('span', { class: 'text-xs font-black' }, 'Hapus Siswa')
                  ]
                })
              ]
            })
          ]
        })
      ])
    }
  }
]

const exportToExcel = () => {
  window.location.href = '/agreement-documents/export' + window.location.search
}
</script>

<template>
  <Head title="Management Surat Perjanjian" />

  <div class="space-y-6">
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-primary">Surat Perjanjian</h1>
        <p class="text-muted-foreground mt-1 text-sm">Kelola upload surat perjanjian orang tua dan siswa.</p>
      </div>
      <div class="flex items-center gap-2">
        <Dialog :open="isAddModalOpen" @update:open="isAddModalOpen = $event">
          <DialogTrigger asChild>
            <Button class="rounded-xl h-10 text-xs shadow-lg shadow-primary/20">
              <Upload class="w-3.5 h-3.5 mr-2" /> Tambah Siswa
            </Button>
          </DialogTrigger>
          <DialogContent class="sm:max-w-[425px] rounded-[32px] border-outline-variant/20">
            <DialogHeader>
              <DialogTitle class="text-xl font-bold text-primary">Tambah Siswa</DialogTitle>
              <DialogDescription>
                Cari siswa dari data wawancara untuk ditambahkan ke manajemen surat perjanjian.
              </DialogDescription>
            </DialogHeader>
            <div class="space-y-4 py-4">
              <div class="relative">
                <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-outline" />
                <Input v-model="interviewSearch" placeholder="Cari nama atau ID siswa..." 
                  class="pl-11 h-12 rounded-2xl border-outline-variant/20 bg-surface-container-lowest" />
              </div>
              
              <div v-if="isSearching" class="space-y-2">
                <div v-for="i in 3" :key="i" class="p-4 rounded-2xl border border-outline-variant/10 flex items-center justify-between">
                  <div class="space-y-2 grow">
                    <Skeleton class="h-4 w-3/4" />
                    <Skeleton class="h-3 w-1/2" />
                  </div>
                  <Skeleton class="h-5 w-5 rounded-full" />
                </div>
              </div>
              
              <div v-else-if="searchResults.length > 0" class="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                <div v-for="result in searchResults" :key="result.id" 
                  @click="addStudent(result.id)"
                  class="flex items-center justify-between p-4 rounded-2xl border border-outline-variant/10 hover:bg-primary/5 cursor-pointer transition-colors group">
                  <div class="flex flex-col min-w-0">
                    <span class="font-bold text-xs text-primary group-hover:translate-x-1 transition-transform">{{ result.name }}</span>
                    <span class="text-[9px] text-muted-foreground uppercase tracking-widest">{{ result.id }} • {{ result.major }}</span>
                  </div>
                  <CheckCircle2 class="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
              
              <div v-else-if="interviewSearch.length >= 2" class="text-center py-8 text-muted-foreground">
                <XCircle class="w-10 h-10 mx-auto mb-2 opacity-20" />
                <p class="text-xs">Siswa tidak ditemukan atau sudah ditambahkan</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Button variant="outline" class="rounded-xl h-10 text-xs" @click="exportToExcel">
          <FileSpreadsheet class="w-3.5 h-3.5 mr-2" /> Export Excel
        </Button>

        <!-- Manage Documents Modal -->
        <Dialog :open="isManageModalOpen && !confirmDelete" @update:open="isManageModalOpen = $event">
          <DialogContent class="sm:max-w-[500px] rounded-[32px] border-outline-variant/20 p-0 overflow-hidden">
            <div v-if="selectedStudentForManagement" class="flex flex-col">
              <div class="p-8 bg-surface-container-high border-b border-outline-variant/10">
                <DialogHeader>
                  <DialogTitle class="text-2xl font-black text-primary tracking-tighter uppercase">Kelola Dokumen</DialogTitle>
                  <DialogDescription class="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">
                    {{ selectedStudentForManagement.studentName }} • {{ selectedStudentForManagement.id }}
                  </DialogDescription>
                </DialogHeader>
              </div>

              <div class="p-8 space-y-8">
                <!-- Parent Document -->
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <h4 class="text-[10px] font-black uppercase tracking-[0.2em] text-outline-variant">Surat Orang Tua</h4>
                    <Badge v-if="selectedStudentForManagement.agreementDocument?.parentAgreementFileUrl" variant="success" class="text-[8px] uppercase font-black text-white p-[1px]">Tersedia</Badge>
                    <Badge v-else variant="destructive" class="text-[8px] uppercase font-black text-white p-[1px]">Belum</Badge>
                  </div>
                  <div class="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      class="grow h-12 rounded-2xl gap-2 font-bold text-xs"
                      @click="openUpload(selectedStudentForManagement, 'parent')"
                    >
                      <Upload class="w-4 h-4" />
                      {{ selectedStudentForManagement.agreementDocument?.parentAgreementFileUrl ? 'Update Dokumen' : 'Upload Dokumen' }}
                    </Button>
                    
                    <template v-if="selectedStudentForManagement.agreementDocument?.parentAgreementFileUrl">
                      <a :href="selectedStudentForManagement.agreementDocument.parentAgreementFileUrl" target="_blank" 
                        class="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all">
                        <Eye class="w-5 h-5" />
                      </a>
                      <Button 
                        variant="ghost" 
                        class="w-12 h-12 rounded-2xl p-0 text-destructive hover:bg-destructive/10"
                        @click="openDelete(selectedStudentForManagement, 'parent')"
                      >
                        <Trash2 class="w-5 h-5" />
                      </Button>
                    </template>
                  </div>
                </div>

                <!-- Student Document -->
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <h4 class="text-[10px] font-black uppercase tracking-[0.2em] text-outline-variant">Surat Siswa</h4>
                    <Badge v-if="selectedStudentForManagement.agreementDocument?.studentAgreementFileUrl" variant="success" class="text-[8px] uppercase font-black text-white p-[1px]">Tersedia</Badge>
                    <Badge v-else variant="destructive" class="text-[8px] uppercase font-black text-white p-[1px]">Belum</Badge>
                  </div>
                  <div class="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      class="grow h-12 rounded-2xl gap-2 font-bold text-xs"
                      @click="openUpload(selectedStudentForManagement, 'student')"
                    >
                      <Upload class="w-4 h-4" />
                      {{ selectedStudentForManagement.agreementDocument?.studentAgreementFileUrl ? 'Update Dokumen' : 'Upload Dokumen' }}
                    </Button>
                    
                    <template v-if="selectedStudentForManagement.agreementDocument?.studentAgreementFileUrl">
                      <a :href="selectedStudentForManagement.agreementDocument.studentAgreementFileUrl" target="_blank" 
                        class="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all">
                        <Eye class="w-5 h-5" />
                      </a>
                      <Button 
                        variant="ghost" 
                        class="w-12 h-12 rounded-2xl p-0 text-destructive hover:bg-destructive/10"
                        @click="openDelete(selectedStudentForManagement, 'student')"
                      >
                        <Trash2 class="w-5 h-5" />
                      </Button>
                    </template>
                  </div>
                </div>

                <div class="pt-6 border-t border-outline-variant/10">
                  <Button 
                    variant="destructive" 
                    class="w-full h-12 rounded-2xl gap-2 font-bold text-xs uppercase tracking-widest"
                    @click="openDelete(selectedStudentForManagement, 'all')"
                  >
                    <Trash2 class="w-4 h-4" />
                    Hapus dari Daftar
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>

    <!-- Stats Summary -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card class="rounded-3xl border-outline-variant/10 shadow-sm">
        <CardContent class="p-6">
          <div class="flex items-center gap-4">
            <div class="p-3 rounded-2xl bg-primary/10 text-primary">
              <FileText class="w-5 h-5" />
            </div>
            <div>
              <p class="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Siswa</p>
              <h3 class="text-xl font-bold">{{ interviews.length }}</h3>
            </div>
          </div>
        </CardContent>
      </Card>
      <!-- Add more stats if needed -->
    </div>

    <!-- Filters -->
    <Card class="rounded-3xl border-outline-variant/10 shadow-sm overflow-visible">
      <CardHeader class="pb-4">
        <div class="flex flex-col md:flex-row md:items-center gap-4">
          <div class="relative flex-grow">
            <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-outline" />
            <Input v-model="searchQuery" placeholder="Cari nama siswa..." 
              class="pl-11 h-12 rounded-2xl border-outline-variant/20 bg-surface-container-lowest" />
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <Select v-model="majorFilter">
              <SelectTrigger class="h-12 w-[180px] rounded-2xl border-outline-variant/20 bg-surface-container-lowest">
                <SelectValue placeholder="Semua Jurusan" />
              </SelectTrigger>
              <SelectContent class="rounded-xl shadow-xl border-outline-variant/20 max-h-60">
                <SelectItem value="all">Semua Jurusan</SelectItem>
                <SelectItem v-for="major in majors" :key="major.id" :value="major.code">
                  {{ major.name }}
                </SelectItem>
              </SelectContent>
            </Select>

            <Select v-model="statusFilter">
              <SelectTrigger class="h-12 w-[180px] rounded-2xl border-outline-variant/20 bg-surface-container-lowest">
                <SelectValue placeholder="Status Dokumen" />
              </SelectTrigger>
              <SelectContent class="rounded-xl shadow-xl border-outline-variant/20">
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="complete">Lengkap</SelectItem>
                <SelectItem value="incomplete">Belum Lengkap</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable :columns="columns" :data="interviews" :loading="isLoading" />
      </CardContent>
    </Card>

    <input type="file" ref="fileInput" class="hidden" @change="handleFileUpload" accept=".pdf,.jpg,.jpeg,.png" />

    <ConfirmModal 
      :show="confirmDelete" 
      :title="deleteInfo?.type === 'all' ? 'Hapus Siswa dari Daftar?' : 'Hapus Dokumen?'"
      :message="deleteInfo?.type === 'all' 
        ? `Apakah Anda yakin ingin menghapus ${deleteInfo?.studentName} dari manajemen surat perjanjian? Semua file yang sudah diunggah juga akan dihapus dari Google Drive.`
        : `Apakah Anda yakin ingin menghapus surat perjanjian ${deleteInfo?.type === 'parent' ? 'orang tua' : 'siswa'} untuk ${deleteInfo?.studentName}?`"
      @close="closeConfirm"
      @confirm="handleDelete" 
    />
  </div>
</template>
