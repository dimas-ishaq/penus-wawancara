<script setup lang="ts">
import { Head, useForm, usePage, router } from '@inertiajs/vue3'
import { ref, h, watch, computed } from 'vue'
import { debounce } from 'lodash-es'
import DataTable from '~/components/DataTable.vue'
import ConfirmDeleteModal from '~/components/ConfirmDeleteModal.vue'
import type { ColumnDef } from '@tanstack/vue-table'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

const props = defineProps<{
  users: {
    data: any[]
    meta: any
  }
  search?: string
}>()

const page = usePage()
const userData = computed(() => props.users.data)

const searchQuery = ref(props.search || '')

const handleSearch = debounce((query: string) => {
  router.get('/admin/users', { search: query }, {
    preserveState: true,
    preserveScroll: true,
    replace: true
  })
}, 300)

watch(searchQuery, (newVal) => {
  handleSearch(newVal)
})

const isEditModalOpen = ref(false)
const isCreateModalOpen = ref(false)
const selectedUser = ref<any>(null)

const form = useForm({
  fullName: '',
  email: '',
  password: '',
  role: 'staff',
})

const openCreateModal = () => {
  isCreateModalOpen.value = true
  form.reset()
  form.clearErrors()
}

const openEditModal = (user: any) => {
  selectedUser.value = user
  isEditModalOpen.value = true
  form.fullName = user.fullName || ''
  form.email = user.email
  form.password = '' // Clear password field
  form.role = user.role || 'staff'
  form.clearErrors()
}

const submitCreate = () => {
  form.post('/admin/users', {
    onSuccess: () => {
      isCreateModalOpen.value = false
      form.reset()
    }
  })
}

const submitUpdate = () => {
  form.put(`/admin/users/${selectedUser.value.id}`, {
    onSuccess: () => {
      isEditModalOpen.value = false
      form.reset()
    }
  })
}

const isDeleteModalOpen = ref(false)
const userToDelete = ref<any>(null)

const confirmDelete = (user: any) => {
  userToDelete.value = user
  isDeleteModalOpen.value = true
}

const submitDelete = () => {
  form.delete(`/admin/users/${userToDelete.value.id}`, {
    onSuccess: () => {
      isDeleteModalOpen.value = false
      userToDelete.value = null
    }
  })
}

const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'initials',
    header: '',
    cell: ({ row }) => h('div', {
      class: 'w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-xs border border-primary/20'
    }, row.original.initials || row.original.fullName?.charAt(0) || '?'),
  },
  {
    accessorKey: 'fullName',
    header: 'Nama Lengkap',
    cell: ({ row }) => h('div', { class: 'font-bold text-primary' }, row.original.fullName || '-'),
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => h('div', { class: 'text-on-surface-variant font-medium' }, row.original.email),
  },
  {
    accessorKey: 'role',
    header: 'Akses Sistem',
    cell: ({ row }) => h('span', {
      class: [
        'px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest',
        row.original.role === 'super_admin' ? 'bg-primary text-primary-foreground' : row.original.role === 'admin' ? 'bg-secondary/10 text-secondary border border-secondary/20' : 'bg-surface-container-high text-outline'
      ]
    }, row.original.role?.replace('_', ' ')),
  },
  {
    accessorKey: 'createdAt',
    header: 'Terdaftar Pada',
    cell: ({ row }) => h('div', { class: 'text-on-surface-variant text-sm' }, new Date(row.original.createdAt).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })),
  },
  {
    id: 'actions',
    header: 'Aksi',
    meta: { headerClass: 'justify-end', cellClass: 'text-right' },
    cell: ({ row }) => h('div', { class: 'flex justify-end gap-3' }, [
      h('button', {
        onClick: () => openEditModal(row.original),
        class: 'w-10 h-10 rounded-xl bg-surface-container-high text-primary hover:bg-primary/10 transition-all flex items-center justify-center'
      }, [h('span', { class: 'material-symbols-outlined text-xl' }, 'edit')]),

      row.original.id !== page.props.user?.id ? h('button', {
        onClick: () => confirmDelete(row.original),
        class: 'w-10 h-10 rounded-xl bg-surface-container-high text-error hover:bg-error/10 transition-all flex items-center justify-center'
      }, [h('span', { class: 'material-symbols-outlined text-xl' }, 'delete')]) : null,
    ]),
  },
]
</script>

<template>

  <Head title="Manajemen Akun & Hak Akses (RBAC)" />

  <div class="space-y-8">
    <header class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div>
        <h1 class="text-3xl font-black text-primary tracking-tighter font-headline mb-2">Manajemen Akun & Hak Akses
          (RBAC)</h1>
        <p class="text-on-surface-variant font-body text-sm">Kelola akun pengguna dan konfigurasi Role-Based Access Control
          (RBAC) pada sistem.</p>
      </div>
      <button @click="openCreateModal"
        class="px-6 py-3 bg-primary text-primary-foreground font-bold rounded-2xl flex items-center gap-3 hover:scale-105 transition-all shadow-lg shadow-primary/20 font-body">
        <span class="material-symbols-outlined">person_add</span>
        Tambah Pengguna
      </button>
    </header>

    <!-- Search Bar -->
    <div class="bg-surface-container-low p-6 rounded-3xl border border-outline-variant/30 flex gap-4 items-center">
      <div
        class="grow flex items-center gap-3 bg-background px-5 py-3 rounded-xl border border-outline-variant/20 shadow-sm min-w-[250px]">
        <div class="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-outline">
          <span class="material-symbols-outlined">search</span>
        </div>
        <input v-model="searchQuery" type="text" placeholder="Cari nama atau email pengguna..."
          class="grow bg-transparent border-none outline-none font-body text-sm text-on-surface" />
      </div>
    </div>

    <div class="bg-surface rounded-[32px] border border-outline-variant/30 overflow-hidden shadow-sm">
      <DataTable :columns="columns" :data="userData" />
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-between mt-8 px-2">
      <div class="text-xs text-outline font-bold uppercase tracking-[0.1em]">
        Menampilkan 
        <span class="text-primary">{{ ((props.users.meta.currentPage - 1) * props.users.meta.perPage) + 1 }}</span> - 
        <span class="text-primary">{{ Math.min(props.users.meta.currentPage * props.users.meta.perPage, props.users.meta.total) }}</span> 
        dari <span class="text-primary">{{ props.users.meta.total }}</span> data
      </div>
      
      <Pagination 
        :total="props.users.meta.total" 
        :sibling-count="1" 
        :show-edges="true" 
        :page="props.users.meta.currentPage"
        :items-per-page="props.users.meta.perPage"
        @update:page="(p) => router.get('/admin/users', { 
          page: p,
          search: searchQuery
        }, { preserveScroll: true, preserveState: true })"
      >
        <PaginationContent v-slot="{ items }" class="flex items-center gap-1">
          <PaginationPrevious />

          <template v-for="(item, index) in items">
            <PaginationItem 
              v-if="item.type === 'page'" 
              :key="index" 
              :value="item.value"
              :is-active="item.value === props.users.meta.currentPage"
            >
              {{ item.value }}
            </PaginationItem>
            <PaginationEllipsis v-else :key="item.type" :index="index" />
          </template>

          <PaginationNext />
        </PaginationContent>
      </Pagination>
    </div>

    <!-- Create Modal -->
    <Teleport to="body">
      <div v-if="isCreateModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-6">
        <div class="absolute inset-0 bg-black/90 backdrop-blur-xl animate-fade-in" @click="isCreateModalOpen = false">
        </div>

        <div
          class="relative bg-surface w-full max-w-md rounded-[40px] shadow-2xl border border-white/50 overflow-hidden">
          <div class="p-8">
            <h3 class="text-2xl font-black text-primary font-headline mb-6">Tambah Pengguna Baru</h3>

            <form @submit.prevent="submitCreate" class="space-y-4">
              <div class="space-y-1">
                <label class="text-xs font-black text-secondary tracking-widest uppercase ml-1">Nama Lengkap</label>
                <input v-model="form.fullName" type="text"
                  class="w-full px-5 py-4 bg-surface-container-low rounded-2xl border border-outline-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body"
                  placeholder="Contoh: Budi Santoso" required />
                <p v-if="form.errors.fullName" class="text-error text-xs font-bold mt-1">{{ form.errors.fullName }}</p>
              </div>

              <div class="space-y-1">
                <label class="text-xs font-black text-secondary tracking-widest uppercase ml-1">Email</label>
                <input v-model="form.email" type="email"
                  class="w-full px-5 py-4 bg-surface-container-low rounded-2xl border border-outline-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body"
                  placeholder="nama@email.com" required />
                <p v-if="form.errors.email" class="text-error text-xs font-bold mt-1">{{ form.errors.email }}</p>
              </div>

              <div class="space-y-1">
                <p v-if="form.errors.password" class="text-error text-xs font-bold mt-1">{{ form.errors.password }}</p>
              </div>

              <div class="space-y-1">
                <label class="text-xs font-black text-secondary tracking-widest uppercase ml-1">Level Akses</label>
                <select v-model="form.role"
                  class="w-full px-5 py-4 bg-surface-container-low rounded-2xl border border-outline-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body outline-none appearance-none"
                  required>
                  <option value="super_admin">Super Admin (Akses Penuh)</option>
                  <option value="admin">Admin (Manajemen Data)</option>
                  <option value="staff">Staff (Interviewer)</option>
                </select>
                <p v-if="form.errors.role" class="text-error text-xs font-bold mt-1">{{ form.errors.role }}</p>
              </div>

              <div class="pt-4 flex gap-3">
                <button type="button" @click="isCreateModalOpen = false"
                  class="flex-1 py-4 bg-surface-container-high text-primary font-black rounded-2xl hover:bg-surface-container-highest transition-all font-headline tracking-widest">
                  Batal
                </button>
                <button type="submit" :disabled="form.processing"
                  class="flex-1 py-4 bg-primary text-primary-foreground font-black rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 font-headline tracking-widest disabled:opacity-50">
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Edit Modal -->
    <Teleport to="body">
      <div v-if="isEditModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-6">
        <div class="absolute inset-0 bg-black/90 backdrop-blur-xl animate-fade-in" @click="isEditModalOpen = false">
        </div>

        <div
          class="relative bg-surface w-full max-w-md rounded-[40px] shadow-2xl border border-white/50 overflow-hidden">
          <div class="p-8">
            <h3 class="text-2xl font-black text-primary font-headline mb-6">Edit Pengguna</h3>

            <form @submit.prevent="submitUpdate" class="space-y-4">
              <div class="space-y-1">
                <label class="text-xs font-black text-secondary tracking-widest uppercase ml-1">Nama Lengkap</label>
                <input v-model="form.fullName" type="text"
                  class="w-full px-5 py-4 bg-surface-container-low rounded-2xl border border-outline-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body"
                  required />
                <p v-if="form.errors.fullName" class="text-error text-xs font-bold mt-1">{{ form.errors.fullName }}</p>
              </div>

              <div class="space-y-1">
                <label class="text-xs font-black text-secondary tracking-widest uppercase ml-1">Email</label>
                <input v-model="form.email" type="email"
                  class="w-full px-5 py-4 bg-surface-container-low rounded-2xl border border-outline-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body"
                  required />
                <p v-if="form.errors.email" class="text-error text-xs font-bold mt-1">{{ form.errors.email }}</p>
              </div>

              <div class="space-y-1">
                <p v-if="form.errors.password" class="text-error text-xs font-bold mt-1">{{ form.errors.password }}</p>
              </div>

              <div class="space-y-1">
                <label class="text-xs font-black text-secondary tracking-widest uppercase ml-1">Level Akses</label>
                <select v-model="form.role"
                  class="w-full px-5 py-4 bg-surface-container-low rounded-2xl border border-outline-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body outline-none appearance-none"
                  required>
                  <option value="super_admin">Super Admin (Akses Penuh)</option>
                  <option value="admin">Admin (Manajemen Data)</option>
                  <option value="staff">Staff (Interviewer)</option>
                </select>
                <p v-if="form.errors.role" class="text-error text-xs font-bold mt-1">{{ form.errors.role }}</p>
              </div>

              <div class="pt-4 flex gap-3">
                <button type="button" @click="isEditModalOpen = false"
                  class="flex-1 py-4 bg-surface-container-high text-primary font-black rounded-2xl hover:bg-surface-container-highest transition-all font-headline tracking-widest">
                  BATAL
                </button>
                <button type="submit" :disabled="form.processing"
                  class="flex-1 py-4 bg-primary text-primary-foreground font-black rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 font-headline tracking-widest disabled:opacity-50">
                  UPDATE
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Teleport>

    <ConfirmDeleteModal 
      :show="isDeleteModalOpen" 
      title="Hapus Akun Pengguna?" 
      description="Akun ini akan dihapus secara permanen dari sistem. Tindakan ini tidak dapat dibatalkan." 
      :item-name="userToDelete?.fullName" 
      :processing="form.processing"
      @close="isDeleteModalOpen = false" 
      @confirm="submitDelete" 
    />
  </div>
</template>
<style scoped>
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
