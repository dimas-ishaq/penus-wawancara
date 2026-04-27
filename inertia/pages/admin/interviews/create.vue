<script setup lang="ts">
import { Head, useForm, Link } from '@inertiajs/vue3'
import { toast } from 'vue-sonner'
import AdminLayout from '~/layouts/admin.vue'

defineOptions({ layout: AdminLayout })

const form = useForm({
  studentName: '',
  schoolOrigin: ''
})

const submitForm = () => {
  form.post('/admin/interviews', {
    onSuccess: () => {
      toast.success('Pendaftar baru berhasil ditambahkan')
    }
  })
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
</template>
