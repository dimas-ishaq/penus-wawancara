<script setup lang="ts">
import { Head, useForm } from '@inertiajs/vue3'
import { ref, computed } from 'vue'
import { toast } from 'vue-sonner'

import ConfirmDeleteModal from '~/components/ConfirmDeleteModal.vue'

const props = defineProps<{
  majors: any[]
}>()

const isModalOpen = ref(false)
const isEditMode = ref(false)
const selectedMajorId = ref<number | null>(null)
const isDeleteModalOpen = ref(false)
const majorToDelete = ref<any>(null)

const form = useForm({
  name: '',
  code: '',
})

const openCreateModal = () => {
  isEditMode.value = false
  selectedMajorId.value = null
  form.reset()
  form.clearErrors()
  isModalOpen.value = true
}

const openEditModal = (major: any) => {
  isEditMode.value = true
  selectedMajorId.value = major.id
  form.name = major.name
  form.code = major.code
  form.clearErrors()
  isModalOpen.value = true
}

const submit = () => {
  if (isEditMode.value && selectedMajorId.value) {
    form.put(`/admin/majors/${selectedMajorId.value}`, {
      onSuccess: () => {
        isModalOpen.value = false
        toast.success('Jurusan berhasil diperbarui')
      }
    })
  } else {
    form.post('/admin/majors', {
      onSuccess: () => {
        isModalOpen.value = false
        toast.success('Jurusan berhasil ditambahkan')
      }
    })
  }
}

const openDeleteModal = (major: any) => {
  majorToDelete.value = major
  isDeleteModalOpen.value = true
}

const confirmDelete = () => {
  form.delete(`/admin/majors/${majorToDelete.value.id}`, {
    onSuccess: () => {
      isDeleteModalOpen.value = false
      toast.success('Jurusan berhasil dihapus')
    }
  })
}

const searchQuery = ref('')
const filteredMajors = computed(() => {
  return props.majors.filter(m =>
    m.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    m.code.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})
</script>

<template>

  <Head title="Manajemen Jurusan" />

  <div class="space-y-8">
    <header class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
      <div>
        <h1 class="text-2xl sm:text-3xl font-black text-primary tracking-tighter font-headline mb-1 sm:mb-2 uppercase">Manajemen Jurusan</h1>
        <p class="text-on-surface-variant font-body text-xs sm:text-sm">Kelola daftar program keahlian atau jurusan di SMK Plus Pelita Nusantara.</p>
      </div>
      <button @click="openCreateModal"
        class="w-full lg:w-auto px-8 py-4 sm:py-3 bg-primary text-primary-foreground font-black rounded-2xl hover:bg-primary/95 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3">
        <span class="material-symbols-outlined">add_circle</span>
        Tambah Jurusan
      </button>
    </header>

    <!-- Search Bar -->
    <div class="bg-surface-container-low p-4 sm:p-6 rounded-3xl border border-outline-variant/30 flex gap-4 items-center">
      <div
        class="grow flex items-center gap-3 bg-surface-container-lowest px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-outline-variant/20 shadow-sm min-w-0">
        <div class="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-outline shrink-0">
          <span class="material-symbols-outlined">search</span>
        </div>
        <input v-model="searchQuery" type="text" placeholder="Cari nama atau kode jurusan..."
          class="grow bg-transparent border-none outline-none font-body text-sm text-on-surface placeholder:text-outline/50 min-w-0" />
      </div>
    </div>

    <!-- Majors Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="major in filteredMajors" :key="major.id"
        class="bg-card p-6 sm:p-8 rounded-3xl sm:rounded-[2rem] border border-outline-variant/30 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all group relative overflow-hidden">
        <div class="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
          <span class="material-symbols-outlined text-7xl sm:text-8xl">account_tree</span>
        </div>

        <div class="relative z-10 space-y-4 sm:space-y-6">
          <div class="flex justify-between items-start">
            <span
              class="px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full border border-primary/10">
              {{ major.code }}
            </span>
            <div class="flex gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
              <button @click="openEditModal(major)" class="w-10 h-10 rounded-xl bg-surface-container-high text-outline hover:text-primary hover:bg-primary/10 transition-all flex items-center justify-center">
                <span class="material-symbols-outlined text-xl">edit</span>
              </button>
              <button @click="openDeleteModal(major)" class="w-10 h-10 rounded-xl bg-surface-container-high text-outline hover:text-error hover:bg-error/10 transition-all flex items-center justify-center">
                <span class="material-symbols-outlined text-xl">delete</span>
              </button>
            </div>
          </div>

          <h3 class="text-lg sm:text-xl font-black text-primary font-headline leading-tight tracking-tight min-h-0 sm:min-h-[3rem]">
            {{ major.name }}
          </h3>

          <div class="pt-4 border-t border-outline-variant/10 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span class="text-[10px] font-bold text-outline uppercase tracking-widest">Active Program</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredMajors.length === 0"
      class="py-20 text-center space-y-4 bg-surface-container-low rounded-[3rem] border-2 border-dashed border-outline-variant/30">
      <div class="w-20 h-20 bg-outline-variant/20 rounded-full flex items-center justify-center mx-auto text-outline">
        <span class="material-symbols-outlined text-4xl">inventory_2</span>
      </div>
      <div class="space-y-1">
        <h3 class="text-xl font-bold text-primary font-headline">Tidak Ada Data</h3>
        <p class="text-sm text-outline-variant font-body">Belum ada jurusan yang sesuai dengan kriteria pencarian Anda.
        </p>
      </div>
    </div>

    <!-- Modal Form -->
    <Teleport to="body">
      <div v-if="isModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        <div class="absolute inset-0 bg-black/90 backdrop-blur-xl animate-fade-in" @click="isModalOpen = false"></div>

        <div
          class="relative bg-card w-full max-w-md rounded-[2.5rem] shadow-2xl border border-white/20 overflow-hidden animate-zoom-in">
          <div class="bg-surface-container-high p-6 sm:p-8 flex justify-between items-center">
            <h3 class="text-xl sm:text-2xl font-black text-primary font-headline tracking-tighter uppercase">
              {{ isEditMode ? 'Edit Jurusan' : 'Tambah Jurusan' }}
            </h3>
            <button @click="isModalOpen = false" class="text-outline hover:text-primary transition-colors">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <form @submit.prevent="submit" class="p-6 sm:p-8 space-y-6 font-body">
              <div class="space-y-2">
                <label class="text-[10px] font-black text-outline uppercase tracking-widest ml-1">Nama Jurusan</label>
                <input v-model="form.name" type="text" placeholder="Contoh: Rekayasa Perangkat Lunak"
                  class="w-full bg-surface-container-low border-2 border-transparent rounded-2xl px-6 py-4 text-primary font-bold focus:border-primary focus:bg-background transition-all outline-none"
                  required />
              <p v-if="form.errors.name" class="text-xs text-error font-bold ml-1">{{ form.errors.name }}</p>
            </div>

              <div class="space-y-2">
                <label class="text-[10px] font-black text-outline uppercase tracking-widest ml-1">Kode Singkatan</label>
                <input v-model="form.code" type="text" placeholder="Contoh: RPL"
                  class="w-full bg-surface-container-low border-2 border-transparent rounded-2xl px-6 py-4 text-primary font-bold focus:border-primary focus:bg-background transition-all outline-none uppercase"
                  required />
              <p v-if="form.errors.code" class="text-xs text-error font-bold ml-1">{{ form.errors.code }}</p>
            </div>

            <div class="pt-4">
              <button type="submit" :disabled="form.processing"
                class="w-full py-5 bg-primary text-primary-foreground font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest text-sm">
                {{ isEditMode ? 'SIMPAN PERUBAHAN' : 'TAMBAH SEKARANG' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <ConfirmDeleteModal 
      :show="isDeleteModalOpen" 
      title="Hapus Data Jurusan?" 
      description="Menghapus jurusan akan berdampak pada seluruh kelas dan data siswa yang terikat pada jurusan ini. Tindakan ini sangat berisiko." 
      :item-name="majorToDelete?.name" 
      :processing="form.processing"
      @close="isDeleteModalOpen = false" 
      @confirm="confirmDelete" 
    />
  </div>
</template>

<style scoped>
.animate-zoom-in {
  animation: zoomIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
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

@keyframes zoomIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }

  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>
