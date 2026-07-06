<script setup lang="ts">
import { Head, useForm, Link, router } from '@inertiajs/vue3'
import { onBeforeUnmount, ref, watch, onMounted } from 'vue'
import ConfirmModal from '~/components/ConfirmModal.vue'
import AdminLayout from '~/layouts/admin.vue'

defineOptions({ layout: AdminLayout })

const form = useForm({
  studentName: '',
  schoolOrigin: ''
})

const isDirty = ref(false)
const showUnsavedLeaveModal = ref(false)
const isLeavingSilently = ref(false)
let pendingVisitTarget: { url: string | URL; options: Record<string, any> } | null = null

watch(
  () => form.data(),
  () => {
    isDirty.value = !!form.studentName || !!form.schoolOrigin
  },
  { deep: true }
)

const beforeUnloadHandler = (e: BeforeUnloadEvent) => {
  if (isDirty.value) {
    e.preventDefault()
    e.returnValue = ''
  }
}

const removeUnsavedGuard = router.on('before', (event) => {
  if (isLeavingSilently.value) return
  if (!isDirty.value) return

  event.preventDefault()
  pendingVisitTarget = {
    url: event.detail.visit.url,
    options: {
      method: event.detail.visit.method,
      data: event.detail.visit.data as any,
      replace: event.detail.visit.replace,
      preserveScroll: event.detail.visit.preserveScroll,
      preserveState: event.detail.visit.preserveState,
      only: event.detail.visit.only,
      except: event.detail.visit.except,
      headers: event.detail.visit.headers,
      errorBag: event.detail.visit.errorBag,
      forceFormData: event.detail.visit.forceFormData,
      queryStringArrayFormat: event.detail.visit.queryStringArrayFormat,
      async: event.detail.visit.async,
      showProgress: event.detail.visit.showProgress,
      prefetch: event.detail.visit.prefetch,
      fresh: event.detail.visit.fresh,
      reset: event.detail.visit.reset,
      preserveUrl: event.detail.visit.preserveUrl,
      invalidateCacheTags: event.detail.visit.invalidateCacheTags,
      viewTransition: event.detail.visit.viewTransition,
    },
  }
  showUnsavedLeaveModal.value = true
  return false
})

onMounted(() => {
  window.addEventListener('beforeunload', beforeUnloadHandler)
})

onBeforeUnmount(() => {
  removeUnsavedGuard()
  window.removeEventListener('beforeunload', beforeUnloadHandler)
  pendingVisitTarget = null
})

const submitForm = () => {
  form.post('/admin/interviews', {
    onSuccess: () => {
      isDirty.value = false
    }
  })
}

const confirmLeaveWithoutSave = () => {
  if (!pendingVisitTarget) return
  const target = pendingVisitTarget
  pendingVisitTarget = null
  showUnsavedLeaveModal.value = false
  isLeavingSilently.value = true
  router.visit(target.url, target.options)
  isLeavingSilently.value = false
}
</script>

<template>
  <Head title="Tambah Pendaftar Baru" />

  <div class="max-w-2xl mx-auto py-8">
    <div class="mb-8 flex items-center gap-4">
      <Link href="/admin/interviews" class="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-primary border border-outline-variant/20 hover:bg-white transition-all">
        <span class="material-symbols-outlined">arrow_back</span>
      </Link>
      <div>
        <h1 class="text-3xl font-black text-primary tracking-tighter font-headline mb-1">Tambah Pendaftar</h1>
        <p class="text-on-surface-variant font-body text-sm">Masukkan data calon siswa untuk memulai proses wawancara.</p>
      </div>
    </div>

    <div class="bg-card rounded-[2.5rem] shadow-xl border border-outline-variant/30 overflow-hidden">
      <div class="bg-surface-container-high p-8">
        <h3 class="text-xl font-bold text-primary font-headline tracking-tighter uppercase">Formulir Pendaftaran</h3>
      </div>

      <form @submit.prevent="submitForm" class="p-10 space-y-8 font-body">
        <div class="space-y-3">
          <label class="text-[10px] font-black text-outline uppercase tracking-widest block">Nama Lengkap Siswa</label>
          <input v-model="form.studentName" type="text" placeholder="Masukkan nama lengkap..." required
            class="w-full bg-background border border-outline-variant/20 rounded-2xl p-4 font-bold text-on-surface focus:ring-2 ring-primary outline-none transition-all" />
          <div v-if="form.errors.studentName" class="text-error text-xs font-bold">{{ form.errors.studentName }}</div>
        </div>

        <div class="space-y-3">
          <label class="text-[10px] font-black text-outline uppercase tracking-widest block">Asal Sekolah (SMP/MTs)</label>
          <input v-model="form.schoolOrigin" type="text" placeholder="Masukkan asal sekolah..." required
            class="w-full bg-background border border-outline-variant/20 rounded-2xl p-4 font-bold text-on-surface focus:ring-2 ring-primary outline-none transition-all" />
          <div v-if="form.errors.schoolOrigin" class="text-error text-xs font-bold">{{ form.errors.schoolOrigin }}</div>
        </div>

        <div class="flex gap-4 pt-4">
          <Link href="/admin/interviews" class="grow py-5 border-2 border-outline-variant/30 text-outline font-black rounded-2xl hover:bg-surface-container-low transition-all text-center">
            BATAL
          </Link>
          <button type="submit" :disabled="form.processing"
            class="grow-[2] py-5 bg-primary text-primary-foreground font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform disabled:opacity-50">
            {{ form.processing ? 'MEMPROSES...' : 'DAFTARKAN SEKARANG' }}
          </button>
        </div>
      </form>
    </div>
  </div>

  <ConfirmModal
    :show="showUnsavedLeaveModal"
    title="Perubahan belum disimpan"
    message="Simpan dulu sebelum keluar, reload, atau pindah halaman."
    confirm-text="Tetap Simpan"
    cancel-text="Tetap Di Halaman"
    variant="error"
    @close="showUnsavedLeaveModal = false"
    @confirm="confirmLeaveWithoutSave"
  />
</template>
