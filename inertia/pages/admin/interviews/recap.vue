<script setup lang="ts">
import { Head, useForm, Link, usePage } from '@inertiajs/vue3'
import { computed, ref, watch, onBeforeUnmount, onMounted } from 'vue'
import { toast } from 'vue-sonner'
import { DateTime } from 'luxon'
import AdminLayout from '~/layouts/admin.vue'

import { DatePicker } from '@/components/ui/date-picker'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

defineOptions({ layout: AdminLayout })

const props = defineProps<{
  interview: any
  majors: any[]
}>()

const page = usePage()
const currentUser = computed(() => page.props.user as any)

const openAccordion = ref<string | null>(null)
const toggleAccordion = (id: string) => {
  openAccordion.value = openAccordion.value === id ? null : id
}

const isEditingIdentity = ref(false)

const form = useForm({
  studentName: props.interview.studentName || '',
  schoolOrigin: props.interview.schoolOrigin || '',
  interviewDate: props.interview.interviewDate
    ? props.interview.interviewDate.split('T')[0]
    : DateTime.now().toISODate(),
  accompaniment: props.interview.accompaniment || '',
  interviewer: props.interview.interviewer || currentUser.value?.fullName || 'Admin PPDB',
  // Section 1
  infoSource: [
    'Kakak Alumni',
    'Orang Tua',
    'Kerabat/Saudara',
    'Tetangga/Teman',
    'Kakak Kelas',
    'Walikelas SMP',
    'Media Sosial',
  ].includes(props.interview.infoSource)
    ? props.interview.infoSource
    : props.interview.infoSource
      ? 'Lainnya'
      : '',
  infoSourceOther: [
    'Kakak Alumni',
    'Orang Tua',
    'Kerabat/Saudara',
    'Tetangga/Teman',
    'Kakak Kelas',
    'Walikelas SMP',
    'Media Sosial',
  ].includes(props.interview.infoSource)
    ? ''
    : props.interview.infoSource || '',
  reasonChoosingSchool: props.interview.reasonChoosingSchool || '',
  majorChoice: props.interview.majorChoice || '',
  selectedMajor: props.interview.majorChoice ? props.interview.majorChoice.split(' - ')[0] : '',
  majorReason:
    props.interview.majorChoice && props.interview.majorChoice.includes(' - ')
      ? props.interview.majorChoice.split(' - ').slice(1).join(' - ')
      : props.interview.majorChoice || '',
  longTermGoals: props.interview.longTermGoals || '',
  // Section 2
  characterAnswers: props.interview.characterAnswers || {
    homeDistance: '',
    travelMethod: '',
    arrival645Commitment: false,
    vehicleCommitment: false,
    presenceCommitment: false,
    alfaCommitment: false,
    disciplineCommitment: false,
    cleanlinessCommitment: false,
    allActivityCommitment: false,
  },
  specialActivities: props.interview.specialActivities || '',
  skillCommitment: props.interview.skillCommitment || false,
  entrepreneurCommitment: props.interview.entrepreneurCommitment || false,
  religiousCommitment: props.interview.religiousCommitment || false,
  violationAgreement: props.interview.violationAgreement || false,
  violationDetails: props.interview.violationDetails || {
    tauran: false,
    asusila: false,
    narkoba: false,
    kriminal: false,
    bullying: false,
    kekerasanGuru: false,
    menikah: false,
  },
  // Section 3
  parentCommitments: props.interview.parentCommitments || {
    fullSupport: false,
    laptopProvision: false,
    pklConsent: false,
    deviceCheckConsent: false,
    relationshipCommitment: false,
    financialCommitment: false,
  },
  livingWith: props.interview.livingWith || '',
  emergencyContact: props.interview.emergencyContact || '',
  emergencyContactPhone: props.interview.emergencyContactPhone || '',
  billingDetails: props.interview.billingDetails || {
    name: '',
    relationship: '',
    job: '',
    phone: '',
    otherSource: '',
    notes: props.interview.billingDetails?.notes || '',
  },
  notes: props.interview.notes || '',

})

// --- Autosave state ---
const AUTO_SAVE_KEY = `recap_autosave_${props.interview.id}`
const hasUnsavedChanges = ref(false)
const isSavingDraft = ref(false)
const lastSavedAt = ref<string | null>(null)
const autoSaveTimer = ref<ReturnType<typeof setTimeout> | null>(null)
const showUnsavedNotification = ref(false)
const notificationTimer = ref<ReturnType<typeof setTimeout> | null>(null)
const isResetModalOpen = ref(false)
const resetConfirmationText = ref('')
const isResetting = ref(false)

// Load saved draft from localStorage
const loadSavedDraft = () => {
  try {
    const saved = localStorage.getItem(AUTO_SAVE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      // Only restore if the interview ID matches
      if (parsed.interviewId === props.interview.id) {
        return parsed.formData
      }
    }
  } catch (e) {
    // Ignore parse errors
  }
  return null
}

// Save draft to localStorage
const saveDraftToStorage = (formData: any) => {
  try {
    const draft = {
      interviewId: props.interview.id,
      formData,
      savedAt: DateTime.now().toISO(),
      studentName: props.interview.studentName,
    }
    localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify(draft))
  } catch (e) {
    // Ignore storage errors (e.g., quota exceeded)
  }
}

// Clear saved draft
const clearSavedDraft = () => {
  localStorage.removeItem(AUTO_SAVE_KEY)
}

// Check if form has actual changes compared to original interview data
const checkForChanges = (currentForm: any): boolean => {
  const orig = props.interview

  // Compare non-object fields
  const simpleFields: [string, string][] = [
    ['studentName', 'studentName'],
    ['schoolOrigin', 'schoolOrigin'],
    ['accompaniment', 'accompaniment'],
    ['interviewer', 'interviewer'],
    ['infoSource', 'infoSource'],
    ['infoSourceOther', 'infoSourceOther'],
    ['reasonChoosingSchool', 'reasonChoosingSchool'],
    ['selectedMajor', 'majorChoice'],
    ['majorReason', 'majorReason'],
    ['longTermGoals', 'longTermGoals'],
    ['specialActivities', 'specialActivities'],
    ['violationAgreement', 'violationAgreement'],
    ['skillCommitment', 'skillCommitment'],
    ['entrepreneurCommitment', 'entrepreneurCommitment'],
    ['religiousCommitment', 'religiousCommitment'],
    ['livingWith', 'livingWith'],
    ['emergencyContact', 'emergencyContact'],
    ['emergencyContactPhone', 'emergencyContactPhone'],
  ]

  for (const [formKey, origKey] of simpleFields) {
    const fv = String(currentForm[formKey] ?? '')
    const ov = String(orig[origKey] ?? '')
    if (fv !== ov) return true
  }

  // Compare characterAnswers
  const ca = currentForm.characterAnswers || {}
  const oca = orig.characterAnswers || {}
  const caKeys = Object.keys(ca)
  for (const key of caKeys) {
    if (String(ca[key] ?? '') !== String(oca[key] ?? '')) return true
  }

  // Compare violationDetails
  const vd = currentForm.violationDetails || {}
  const ovd = orig.violationDetails || {}
  const vdKeys = Object.keys(vd)
  for (const key of vdKeys) {
    if (String(vd[key] ?? '') !== String(ovd[key] ?? '')) return true
  }

  // Compare parentCommitments
  const pc = currentForm.parentCommitments || {}
  const opc = orig.parentCommitments || {}
  const pcKeys = Object.keys(pc)
  for (const key of pcKeys) {
    if (String(pc[key] ?? '') !== String(opc[key] ?? '')) return true
  }

  // Compare billingDetails
  const bd = currentForm.billingDetails || {}
  const obd = orig.billingDetails || {}
  const bdKeys = Object.keys(bd)
  for (const key of bdKeys) {
    if (String(bd[key] ?? '') !== String(obd[key] ?? '')) return true
  }

  // Compare interviewDate
  const currentDate = currentForm.interviewDate || ''
  const origDate = orig.interviewDate ? orig.interviewDate.split('T')[0] : ''
  if (currentDate !== origDate) return true

  return false
}

// Debounced auto-save
const debouncedAutoSave = () => {
  if (autoSaveTimer.value) clearTimeout(autoSaveTimer.value)

  // Mark as having unsaved changes immediately
  hasUnsavedChanges.value = checkForChanges(form.data())

  autoSaveTimer.value = setTimeout(() => {
    if (hasUnsavedChanges.value && !form.processing) {
      performAutoSave()
    }
  }, 2000)
}

const performAutoSave = () => {
  isSavingDraft.value = true

  const formData = {
    studentName: form.data().studentName,
    schoolOrigin: form.data().schoolOrigin,
    interviewDate: form.data().interviewDate,
    accompaniment: form.data().accompaniment,
    interviewer: form.data().interviewer,
    infoSource: form.data().infoSource,
    infoSourceOther: form.data().infoSourceOther,
    reasonChoosingSchool: form.data().reasonChoosingSchool,
    selectedMajor: form.data().selectedMajor,
    majorReason: form.data().majorReason,
    longTermGoals: form.data().longTermGoals,
    notes: form.data().notes,
    characterAnswers: { ...form.data().characterAnswers },
    specialActivities: form.data().specialActivities,
    skillCommitment: form.data().skillCommitment,
    entrepreneurCommitment: form.data().entrepreneurCommitment,
    religiousCommitment: form.data().religiousCommitment,
    violationAgreement: form.data().violationAgreement,
    violationDetails: { ...form.data().violationDetails },
    parentCommitments: { ...form.data().parentCommitments },
    livingWith: form.data().livingWith,
    emergencyContact: form.data().emergencyContact,
    emergencyContactPhone: form.data().emergencyContactPhone,
    billingDetails: { ...form.data().billingDetails },

  }

  saveDraftToStorage(formData)
  lastSavedAt.value = DateTime.now().toLocaleString(DateTime.DATETIME_SHORT)
  isSavingDraft.value = false

  // Show notification briefly
  showUnsavedNotification.value = true
  if (notificationTimer.value) clearTimeout(notificationTimer.value)
  notificationTimer.value = setTimeout(() => {
    showUnsavedNotification.value = false
  }, 3000)
}

// Restore draft if available
const savedDraft = loadSavedDraft()
const hasSavedDraft = !!savedDraft

const restoreDraft = () => {
  if (!savedDraft) return

  const d = savedDraft

  form.studentName = d.studentName || form.studentName
  form.schoolOrigin = d.schoolOrigin || form.schoolOrigin
  form.interviewDate = d.interviewDate || form.interviewDate
  form.accompaniment = d.accompaniment || form.accompaniment
  form.interviewer = d.interviewer || form.interviewer
  form.infoSource = d.infoSource || form.infoSource
  form.infoSourceOther = d.infoSourceOther || form.infoSourceOther
  form.reasonChoosingSchool = d.reasonChoosingSchool || form.reasonChoosingSchool
  form.selectedMajor = d.selectedMajor || form.selectedMajor
  form.majorReason = d.majorReason || form.majorReason
  form.longTermGoals = d.longTermGoals || form.longTermGoals
  form.notes = d.notes || form.notes

  if (d.characterAnswers) {
    form.characterAnswers = { ...form.characterAnswers, ...d.characterAnswers }
  }
  form.specialActivities = d.specialActivities || form.specialActivities
  form.skillCommitment = d.skillCommitment ?? form.skillCommitment
  form.entrepreneurCommitment = d.entrepreneurCommitment ?? form.entrepreneurCommitment
  form.religiousCommitment = d.religiousCommitment ?? form.religiousCommitment
  form.violationAgreement = d.violationAgreement ?? form.violationAgreement

  if (d.violationDetails) {
    form.violationDetails = { ...form.violationDetails, ...d.violationDetails }
  }
  if (d.parentCommitments) {
    form.parentCommitments = { ...form.parentCommitments, ...d.parentCommitments }
  }
  form.livingWith = d.livingWith || form.livingWith
  form.emergencyContact = d.emergencyContact || form.emergencyContact
  form.emergencyContactPhone = d.emergencyContactPhone || form.emergencyContactPhone
  if (d.billingDetails) {
    form.billingDetails = { ...form.billingDetails, ...d.billingDetails }
  }


  toast.success('Draft autosave berhasil dipulihkan')
  hasUnsavedChanges.value = true
}

const dismissDraftRestore = () => {
  // Clear the draft and don't restore
  clearSavedDraft()
  toast.info('Draft diabaikan')
}

// Watch for form changes to trigger auto-save
watch(
  () => form.data(),
  () => {
    debouncedAutoSave()
  },
  { deep: true }
)

// Warn before leaving with unsaved changes
const beforeUnloadHandler = (e: BeforeUnloadEvent) => {
  if (hasUnsavedChanges.value) {
    e.preventDefault()
    e.returnValue = ''
  }
}

onMounted(() => {
  window.addEventListener('beforeunload', beforeUnloadHandler)
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', beforeUnloadHandler)
  if (autoSaveTimer.value) clearTimeout(autoSaveTimer.value)
  if (notificationTimer.value) clearTimeout(notificationTimer.value)

  // Final auto-save on unmount if there are unsaved changes
  if (hasUnsavedChanges.value && !form.processing) {
    performAutoSave()
  }
})


const submitRecap = () => {
  // Handle infoSource "Lainnya"
  const finalInfoSource = form.infoSource === 'Lainnya' ? form.infoSourceOther : form.infoSource

  form
    .transform((data) => ({
      ...data,
      infoSource: finalInfoSource,
    }))
    .put(`/admin/interviews/${props.interview.id}/recap`, {
      onSuccess: () => {
        toast.success('Hasil wawancara berhasil disimpan')
        clearSavedDraft()
        hasUnsavedChanges.value = false
        lastSavedAt.value = null
        showUnsavedNotification.value = false
      },
      onError: (errors) => {
        const errorCount = Object.keys(errors).length
        toast.error(`Gagal menyimpan: Ada ${errorCount} data yang tidak valid atau belum diisi`)
      },
    })
}

const handleReset = () => {
  if (resetConfirmationText.value.toLowerCase() !== 'reset') {
    toast.error('Konfirmasi gagal: Silahkan ketik kata "reset" dengan benar')
    return
  }

  isResetting.value = true
  form.put(`/admin/interviews/${props.interview.id}/reset`, {
    onSuccess: () => {
      toast.success('Data wawancara berhasil dikosongkan')
      clearSavedDraft()
      isResetModalOpen.value = false
      resetConfirmationText.value = ''
    },
    onFinish: () => {
      isResetting.value = false
    }
  })
}
</script>

<template>
  <Head :title="'Input Hasil: ' + interview.studentName" />

  <div class="max-w-4xl mx-auto py-8">
    <div class="mb-8 flex justify-between items-start">
      <div class="flex items-center gap-4">
        <Link
          href="/admin/interviews"
          class="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-primary border border-outline-variant/20 hover:bg-white transition-all"
        >
          <span class="material-symbols-outlined">arrow_back</span>
        </Link>
        <div>
          <h1
            class="text-3xl font-black text-primary tracking-tighter font-headline mb-1 uppercase"
          >
            Formulir Wawancara
          </h1>
          <p class="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">
            Lengkapi seluruh data hasil seleksi wawancara
          </p>
        </div>
      </div>
      <!-- Autosave Status -->
      <div class="flex-shrink-0 flex items-center gap-3">
        <!-- Draft Restore Banner -->
        <div
          v-if="hasSavedDraft && !lastSavedAt"
          class="flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300"
        >
          <span class="material-symbols-outlined text-amber-600 text-sm">history</span>
          <span
            class="text-[10px] font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider"
            >Draft tersedia</span
          >
          <button
            @click="restoreDraft"
            class="text-[10px] font-black text-amber-700 dark:text-amber-300 underline hover:no-underline"
          >
            Pulihkan
          </button>
          <button
            @click="dismissDraftRestore"
            class="text-[10px] font-bold text-amber-600 dark:text-amber-500 hover:text-amber-800 ml-1"
          >
            ✕
          </button>
        </div>
        <!-- Saving indicator -->
        <div
          v-if="isSavingDraft"
          class="flex items-center gap-2 px-3 py-1.5 bg-surface-container-low rounded-xl border border-outline-variant/20"
        >
          <svg
            class="animate-spin h-3.5 w-3.5 text-primary"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            ></path>
          </svg>
          <span class="text-[9px] font-black text-primary uppercase tracking-widest"
            >Menyimpan...</span
          >
        </div>
        <!-- Unsaved changes indicator -->
        <div
          v-else-if="hasUnsavedChanges && !showUnsavedNotification"
          class="flex items-center gap-2 px-3 py-1.5 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800/50"
        >
          <span class="material-symbols-outlined text-amber-600 text-sm">edit_note</span>
          <span
            class="text-[9px] font-black text-amber-700 dark:text-amber-400 uppercase tracking-widest"
            >Belum disimpan</span
          >
        </div>
        <!-- Saved notification -->
        <div
          v-else-if="showUnsavedNotification && lastSavedAt"
          class="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800/50 animate-in fade-in duration-200"
        >
          <span class="material-symbols-outlined text-emerald-600 text-sm">check_circle</span>
          <span
            class="text-[8px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-wider"
            >Tersimpan {{ lastSavedAt }}</span
          >
        </div>
        <!-- All saved -->
        <div
          v-else-if="!hasUnsavedChanges && lastSavedAt"
          class="flex items-center gap-2 px-3 py-1.5 bg-surface-container-low rounded-xl border border-outline-variant/20"
        >
          <span class="material-symbols-outlined text-emerald-600 text-sm">cloud_done</span>
          <span class="text-[9px] font-black text-emerald-700 uppercase tracking-widest"
            >Tersimpan</span
          >
        </div>
      </div>
    </div>

    <div
      class="bg-card rounded-[2.5rem] shadow-xl border border-outline-variant/30 overflow-hidden flex flex-col font-body"
    >
      <!-- Header -->
      <div class="bg-surface-container-high p-8 sm:p-10 border-b border-outline-variant/20">
        <div class="flex items-center gap-6">
          <div
            class="w-16 h-16 rounded-[2rem] bg-primary/10 flex items-center justify-center text-primary shadow-inner"
          >
            <span class="material-symbols-outlined text-3xl">assignment_ind</span>
          </div>
          <div class="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="space-y-1 grow">
              <div v-if="!isEditingIdentity">
                <h4
                  class="text-2xl font-black text-primary font-headline tracking-tighter uppercase"
                >
                  {{ form.studentName }}
                </h4>
                <div class="flex items-center gap-3">
                  <span
                    class="px-3 py-1 bg-emerald-600 text-white text-[9px] font-black rounded-lg tracking-wider transition-colors shrink-0"
                    >{{ interview.id }}</span
                  >
                  <span
                    class="text-xs text-on-surface-variant font-bold uppercase tracking-widest"
                    >{{ form.schoolOrigin }}</span
                  >
                </div>
              </div>

              <div v-else class="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <div class="space-y-1">
                  <label class="text-[9px] font-black text-primary uppercase tracking-[0.2em] ml-1"
                    >Nama Lengkap Siswa</label
                  >
                  <input
                    v-model="form.studentName"
                    type="text"
                    class="w-full bg-white dark:bg-stone-900 border-2 border-primary rounded-xl px-4 py-2 text-lg font-black text-primary outline-none focus:ring-4 ring-primary/10 transition-all"
                    placeholder="Nama Siswa..."
                  />
                  <p
                    v-if="form.errors.studentName"
                    class="text-[10px] font-black text-red-500 uppercase mt-1 ml-1"
                  >
                    {{ form.errors.studentName }}
                  </p>
                </div>
                <div class="space-y-1">
                  <label
                    class="text-[9px] font-black text-on-surface-variant uppercase tracking-[0.2em] ml-1"
                    >Asal Sekolah Siswa</label
                  >
                  <input
                    v-model="form.schoolOrigin"
                    type="text"
                    class="w-full bg-white dark:bg-stone-900 border-2 border-outline-variant rounded-xl px-4 py-2 text-xs font-bold text-on-surface-variant outline-none focus:border-primary transition-all uppercase"
                    placeholder="Asal Sekolah..."
                  />
                  <p
                    v-if="form.errors.schoolOrigin"
                    class="text-[10px] font-black text-red-500 uppercase mt-1 ml-1"
                  >
                    {{ form.errors.schoolOrigin }}
                  </p>
                </div>
              </div>
            </div>

            <button
              @click.prevent="isEditingIdentity = !isEditingIdentity"
              class="shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all"
              :class="
                isEditingIdentity
                  ? 'bg-primary text-white shadow-lg'
                  : 'bg-surface-container-low text-primary border border-primary/20 hover:bg-white'
              "
            >
              <span class="material-symbols-outlined text-sm">{{
                isEditingIdentity ? 'check_circle' : 'edit_square'
              }}</span>
              {{ isEditingIdentity ? 'Selesai Edit' : 'Edit Data Siswa' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Form Content -->
      <form @submit.prevent="submitRecap" class="p-8 sm:p-12 space-y-12">
        <div
          class="flex items-center gap-2 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 rounded-2xl"
        >
          <span class="material-symbols-outlined text-amber-600 text-sm">info</span>
          <p
            class="text-[10px] font-bold text-amber-800 dark:text-amber-400 uppercase tracking-widest"
          >
            Note: Tanda (*) menunjukkan kolom yang wajib diisi atau diklik
          </p>
        </div>
        <!-- Section I: Identitas & Aspirasi -->
        <div class="space-y-8">
          <h4
            class="text-sm font-black text-primary uppercase tracking-[0.2em] flex items-center gap-3"
          >
            <span class="w-2 h-2 rounded-full bg-primary"></span>
            I. Identitas & Aspirasi
          </h4>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="space-y-3">
              <label
                class="text-[10px] font-black text-outline dark:text-white/60 uppercase tracking-widest"
                >Tanggal Wawancara <span class="text-red-500">*</span></label
              >
              <DatePicker v-model="form.interviewDate" class="font-bold text-primary" required />
              <p
                v-if="form.errors.interviewDate"
                class="text-[9px] font-bold text-red-500 uppercase"
              >
                {{ form.errors.interviewDate }}
              </p>
            </div>
            <div class="space-y-3">
              <label
                class="text-[10px] font-black text-outline dark:text-white/60 uppercase tracking-widest"
                >Pewawancara <span class="text-red-500">*</span></label
              >
              <input
                type="text"
                v-model="form.interviewer"
                placeholder="Nama Pewawancara..."
                required
                readonly
                class="w-full bg-surface-container-low dark:bg-stone-950/40 border border-outline-variant/10 rounded-2xl p-4 font-bold text-primary/50 dark:text-white/50 cursor-not-allowed outline-none shadow-inner"
              />
            </div>
            <div class="space-y-3">
              <label
                class="text-[10px] font-black text-outline dark:text-white/60 uppercase tracking-widest"
                >Pendamping Wawancara <span class="text-red-500">*</span></label
              >
              <input
                type="text"
                v-model="form.accompaniment"
                placeholder="Nama Pendamping..."
                class="w-full bg-surface-container-low dark:bg-stone-950/60 border border-outline-variant/20 rounded-2xl p-4 font-bold text-primary dark:text-white focus:ring-2 ring-primary dark:focus:ring-primary-fixed-dim transition-all outline-none shadow-inner"
              />
              <p
                v-if="form.errors.accompaniment"
                class="text-[9px] font-bold text-red-500 uppercase"
              >
                {{ form.errors.accompaniment }}
              </p>
            </div>
          </div>

          <div class="space-y-4">
            <label
              class="text-[10px] font-black text-outline dark:text-white/60 uppercase tracking-widest block"
              >1. Dari mana ananda mengetahui SMK Plus Pelita Nusantara?
              <span class="text-red-500">*</span></label
            >
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <label
                v-for="opt in [
                  'Kakak Alumni',
                  'Orang Tua',
                  'Kerabat/Saudara',
                  'Tetangga/Teman',
                  'Kakak Kelas',
                  'Walikelas SMP',
                  'Media Sosial',
                  'Lainnya',
                ]"
                :key="opt"
                class="flex items-center gap-3 p-4 rounded-2xl border border-outline-variant/20 cursor-pointer hover:bg-primary/5 transition-colors"
                :class="{ 'bg-primary/10 border-primary/30': form.infoSource === opt }"
              >
                <input type="radio" :value="opt" v-model="form.infoSource" class="accent-primary" />
                <span class="text-xs font-bold text-primary">{{ opt }}</span>
              </label>
            </div>

            <!-- Conditional Input for Lainnya -->
            <div v-if="form.infoSource === 'Lainnya'" class="animate-fade-in pt-2">
              <input
                type="text"
                v-model="form.infoSourceOther"
                placeholder="Sebutkan sumber lainnya..."
                class="w-full bg-background dark:bg-stone-950/60 border-2 border-primary/20 rounded-2xl px-6 py-4 text-sm font-bold text-primary dark:text-white focus:border-primary outline-none transition-all shadow-inner"
                required
              />
            </div>
          </div>

          <div class="space-y-3">
            <label
              class="text-[10px] font-black text-outline dark:text-white/60 uppercase tracking-widest block"
              >2. Mengapa pilih SMK Plus Pelita Nusantara untuk menjadi pilihan sekolah?
              <span class="text-red-500">*</span></label
            >
            <textarea
              v-model="form.reasonChoosingSchool"
              rows="3"
              required
              class="w-full bg-background dark:bg-stone-950/60 border border-outline-variant/20 rounded-2xl p-6 text-sm text-on-surface focus:ring-2 ring-primary dark:text-white dark:focus:ring-primary-fixed-dim transition-all resize-none shadow-inner"
            ></textarea>
            <p
              v-if="form.errors.reasonChoosingSchool"
              class="text-[9px] font-bold text-red-500 uppercase"
            >
              {{ form.errors.reasonChoosingSchool }}
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-3">
              <label
                class="text-[10px] font-black text-outline dark:text-white/60 uppercase tracking-widest block"
                >3. Jurusan apa yang dipilih? mengapa? <span class="text-red-500">*</span></label
              >
              <div class="flex flex-col gap-4">
                <Select v-model="form.selectedMajor">
                  <SelectTrigger
                    class="w-full bg-surface-container-low border-outline-variant/20 rounded-2xl h-14 px-6 font-bold text-primary ring-offset-background focus:ring-2 ring-primary"
                  >
                    <SelectValue placeholder="Pilih Jurusan..." />
                  </SelectTrigger>
                  <SelectContent class="rounded-2xl border-outline-variant/20 shadow-2xl">
                    <SelectGroup>
                      <SelectItem
                        v-for="major in majors"
                        :key="major.id"
                        :value="major.code"
                        class="font-bold text-primary rounded-xl focus:bg-primary/10"
                      >
                        {{ major.name }} ({{ major.code }})
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <textarea
                  v-model="form.majorReason"
                  rows="3"
                  placeholder="Alasan memilih jurusan..."
                  class="w-full bg-background dark:bg-stone-950/60 border border-outline-variant/20 rounded-2xl p-6 text-sm text-on-surface focus:ring-2 ring-primary dark:text-white dark:focus:ring-primary-fixed-dim transition-all resize-none shadow-inner"
                ></textarea>
                <p
                  v-if="form.errors.selectedMajor"
                  class="text-[9px] font-bold text-red-500 uppercase"
                >
                  {{ form.errors.selectedMajor }}
                </p>
                <p
                  v-if="form.errors.majorReason"
                  class="text-[9px] font-bold text-red-500 uppercase"
                >
                  {{ form.errors.majorReason }}
                </p>
              </div>
            </div>
            <div class="space-y-3">
              <label
                class="text-[10px] font-black text-outline dark:text-white/60 uppercase tracking-widest block"
                >4. Cita-cita atau harapan jangka panjang?
                <span class="text-red-500">*</span></label
              >
              <textarea
                v-model="form.longTermGoals"
                rows="3"
                required
                class="w-full bg-surface-container-low dark:bg-stone-950/60 border border-outline-variant/20 rounded-2xl p-6 text-sm text-primary dark:text-white focus:ring-2 ring-primary dark:focus:ring-primary-fixed-dim transition-all outline-none shadow-inner"
              ></textarea>
              <p
                v-if="form.errors.longTermGoals"
                class="text-[9px] font-bold text-red-500 uppercase"
              >
                {{ form.errors.longTermGoals }}
              </p>
            </div>
          </div>
        </div>

        <div class="h-px bg-outline-variant/10 dark:bg-white/10"></div>

        <!-- Section II: Karakter & Disiplin -->
        <div class="space-y-8">
          <h4
            class="text-sm font-black text-secondary uppercase tracking-[0.2em] flex items-center gap-3"
          >
            <span class="w-2 h-2 rounded-full bg-secondary"></span>
            II. Karakter & Disiplin
          </h4>

          <div class="bg-primary/5 dark:bg-primary/10 p-8 rounded-[2rem] border border-primary/10">
            <h4
              class="text-xs font-black text-primary dark:text-primary-fixed-dim uppercase tracking-[0.2em] mb-6"
            >
              5. Kesanggupan Success by Character
            </h4>

            <div
              class="mb-8 p-6 bg-white/50 dark:bg-stone-950/60 rounded-2xl border border-primary/20 dark:border-stone-800/50 shadow-inner"
            >
              <p
                class="text-xs font-black text-primary dark:text-stone-300 leading-relaxed uppercase tracking-tight text-center italic"
              >
                "DI SMK Plus Pelita Nusantara memiliki moto success by character, apakah kamu
                sanggup mendukung program sekolah yang terkait dengan pendidikan karakter?"
              </p>
            </div>

            <div class="space-y-6">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="text-[10px] font-bold text-outline dark:text-white/60 uppercase"
                    >a) Berapa jarak rumah ke sekolah?</label
                  >
                  <input
                    type="number"
                    v-model="form.characterAnswers.homeDistance"
                    placeholder="0"
                    class="w-full bg-background border border-outline-variant/20 rounded-xl p-3 text-sm text-on-surface dark:text-white"
                  />
                  <p
                    v-if="form.errors['characterAnswers.homeDistance']"
                    class="text-[9px] font-bold text-red-500 uppercase"
                  >
                    {{ form.errors['characterAnswers.homeDistance'] }}
                  </p>
                </div>
                <div class="space-y-2">
                  <label class="text-[10px] font-bold text-outline dark:text-white/60 uppercase"
                    >b) Bagaimana berangkat ke sekolah?</label
                  >
                  <Select v-model="form.characterAnswers.travelMethod">
                    <SelectTrigger
                      class="w-full bg-background border-outline-variant/20 rounded-xl h-11 px-4 text-sm text-on-surface ring-offset-background focus:ring-2 ring-primary"
                    >
                      <SelectValue placeholder="Pilih transportasi..." />
                    </SelectTrigger>
                    <SelectContent class="rounded-xl border-outline-variant/20 shadow-xl">
                      <SelectGroup>
                        <SelectItem
                          v-for="opt in [
                            'Motor (Sendiri)',
                            'Motor (Diantar)',
                            'Angkutan Umum',
                            'Jalan Kaki',
                            'Sepeda',
                            'Mobil (Diantar)',
                            'Lainnya',
                          ]"
                          :key="opt"
                          :value="opt"
                          class="text-sm rounded-lg"
                        >
                          {{ opt }}
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <p
                    v-if="form.errors['characterAnswers.travelMethod']"
                    class="text-[9px] font-bold text-red-500 uppercase"
                  >
                    {{ form.errors['characterAnswers.travelMethod'] }}
                  </p>
                </div>
              </div>

              <div class="space-y-4 pt-4 border-t border-outline-variant/10">
                <label
                  v-for="(label, key) in {
                    arrival645Commitment: 'c) Sanggup hadir di sekolah pukul 06.45 WIB?',
                    vehicleCommitment:
                      'd) Sanggup menggunakan kendaraan standar & parkir di tempat yang disediakan?',
                    presenceCommitment:
                      'e) Sanggup hadir mengikuti kegiatan pembelajaran Senin - Sabtu?',
                    alfaCommitment: 'f) Siap dikembalikan ke ortu bila Alfa > 7 kali?',
                    disciplineCommitment: 'g) Siap menjalankan disiplin sesuai aturan sekolah?',
                    cleanlinessCommitment: 'h) Siap aktif menjaga kebersihan (seperti piket)?',
                    allActivityCommitment:
                      'i) Aktif mengikuti seluruh kegiatan yang diselenggarakan sekolah?',
                  }"
                  :key="key"
                  class="flex items-center gap-4 p-4 rounded-xl border border-outline-variant/10 cursor-pointer hover:bg-white dark:hover:bg-surface-container-high transition-all"
                >
                  <input
                    type="checkbox"
                    v-model="form.characterAnswers[key]"
                    class="w-5 h-5 accent-primary rounded-lg"
                  />
                  <div class="flex-1">
                    <span
                      class="text-xs font-bold text-primary dark:text-primary-fixed-dim leading-tight"
                      >{{ label }}</span
                    >
                    <p
                      v-if="form.errors[`characterAnswers.${key}`]"
                      class="text-[9px] font-bold text-red-500 uppercase mt-1"
                    >
                      {{ form.errors[`characterAnswers.${key}`] }}
                    </p>
                  </div>
                </label>
              </div>

              <!-- Catatan Khusus -->
              <div class="space-y-2 pt-6 border-t border-outline-variant/10">
                <label class="text-[10px] font-bold text-outline dark:text-white/60 uppercase">
                  Tambah Catatan
                </label>
                <textarea
                  v-model="form.notes"
                  placeholder="Tambahkan catatan khusus mengenai karakter atau disiplin siswa..."
                  class="w-full bg-background border border-outline-variant/20 rounded-xl p-4 text-sm text-on-surface dark:text-white min-h-[120px] focus:ring-2 ring-primary/20 outline-none transition-all"
                ></textarea>
                <p
                  v-if="form.errors.notes"
                  class="text-[9px] font-bold text-red-500 uppercase mt-1"
                >
                  {{ form.errors.notes }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="h-px bg-outline-variant/10 dark:bg-white/10"></div>

        <!-- Section III: Softskill & Hardskill -->
        <div class="space-y-8">
          <h4
            class="text-sm font-black text-emerald-600 uppercase tracking-[0.2em] flex items-center gap-3"
          >
            <span class="w-2 h-2 rounded-full bg-emerald-600"></span>
            III. Softskill & Hardskill
          </h4>

          <div
            class="bg-emerald-50 dark:bg-stone-900/50 p-8 rounded-[2rem] border border-emerald-100 dark:border-stone-800/50 space-y-6"
          >
            <label
              class="flex items-center gap-4 p-6 bg-white dark:bg-stone-800/50 rounded-2xl border-2 border-emerald-200 dark:border-stone-700/50 cursor-pointer shadow-sm"
            >
              <input
                type="checkbox"
                v-model="form.skillCommitment"
                required
                class="w-6 h-6 accent-emerald-600 rounded-lg"
              />
              <div class="flex-1">
                <span
                  class="text-xs font-black text-emerald-800 dark:text-stone-200 uppercase tracking-tight"
                >
                  Apakah kamu siap mengikuti kegiatan softskill dan hardskill yang telah ditetapkan
                  oleh sekolah? <span class="text-red-500">*</span>
                </span>
                <p
                  v-if="form.errors.skillCommitment"
                  class="text-[9px] font-bold text-red-500 uppercase mt-1"
                >
                  {{ form.errors.skillCommitment }}
                </p>
              </div>
            </label>

            <div class="space-y-3">
              <!-- Accordion Items -->
              <div
                v-for="(item, id) in {
                  softskill: {
                    title: 'Softskill',
                    icon: 'psychology',
                    content: [
                      'Public Speaking / Muhadhoroh',
                      'Literasi',
                      'Latihan Dasar Kepemimpinan (LDK)',
                      'Seminar Pra PKL',
                      'English Course',
                    ],
                  },
                  hardskill: {
                    title: 'Hardskill',
                    icon: 'terminal',
                    content: [
                      'Workshop (WS)',
                      'Praktik Kerja Lapangan (PKL)',
                      'Kunjungan Industri',
                      'Ekstrakurikuler',
                      'Program Unggulan',
                    ],
                  },
                  organisasi: {
                    title: 'Organisasi Pendukung',
                    icon: 'groups',
                    content: ['OSIS', 'MPK', 'Devacto'],
                  },
                }"
                :key="id"
                class="border border-emerald-200/50 dark:border-stone-800/50 rounded-2xl overflow-hidden bg-white/50 dark:bg-stone-950/60 shadow-inner"
              >
                <button
                  @click.prevent="toggleAccordion(id)"
                  class="w-full p-5 flex items-center justify-between hover:bg-emerald-100/50 dark:hover:bg-stone-800/50 transition-colors"
                >
                  <div class="flex items-center gap-4">
                    <span class="material-symbols-outlined text-emerald-600 dark:text-stone-400">{{
                      item.icon
                    }}</span>
                    <span
                      class="text-[11px] font-black text-emerald-900 dark:text-stone-300 uppercase tracking-widest"
                      >{{ item.title }}</span
                    >
                  </div>
                  <span
                    class="material-symbols-outlined text-emerald-400 dark:text-stone-500 transition-transform duration-300"
                    :class="{ 'rotate-180': openAccordion === id }"
                    >expand_more</span
                  >
                </button>
                <div v-show="openAccordion === id" class="p-5 pt-0 animate-fade-in">
                  <ul class="space-y-2">
                    <li v-for="point in item.content" :key="point" class="flex items-center gap-3">
                      <span class="w-1 h-1 rounded-full bg-emerald-400 dark:bg-stone-500"></span>
                      <span
                        class="text-[11px] font-bold text-emerald-700/80 dark:text-stone-400 uppercase tracking-tight"
                        >{{ point }}</span
                      >
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="h-px bg-outline-variant/10 dark:bg-white/10"></div>

        <!-- Section IV: Entrepreneurship -->
        <div class="space-y-8">
          <h4
            class="text-sm font-black text-amber-600 uppercase tracking-[0.2em] flex items-center gap-3"
          >
            <span class="w-2 h-2 rounded-full bg-amber-600"></span>
            IV. Entrepreneurship
          </h4>

          <div
            class="bg-amber-50 dark:bg-stone-900/50 p-8 rounded-[2rem] border border-amber-100 dark:border-stone-800/50 space-y-6"
          >
            <label
              class="flex items-center gap-4 p-6 bg-white dark:bg-stone-800/50 rounded-2xl border-2 border-amber-200 dark:border-stone-700/50 cursor-pointer shadow-sm"
            >
              <input
                type="checkbox"
                v-model="form.entrepreneurCommitment"
                required
                class="w-6 h-6 accent-amber-600 rounded-lg"
              />
              <div class="flex-1">
                <span
                  class="text-xs font-black text-amber-800 dark:text-stone-200 uppercase tracking-tight"
                >
                  Apakah kamu siap mengikuti kegiatan entrepreneur?
                  <span class="text-red-500">*</span>
                </span>
                <p
                  v-if="form.errors.entrepreneurCommitment"
                  class="text-[9px] font-bold text-red-500 uppercase mt-1"
                >
                  {{ form.errors.entrepreneurCommitment }}
                </p>
              </div>
            </label>

            <div
              class="p-6 bg-white/50 dark:bg-stone-950/60 rounded-2xl border border-amber-200/50 dark:border-stone-800/50 shadow-inner"
            >
              <ul class="space-y-3">
                <li
                  v-for="point in [
                    'Materi didalam dan diluar kelas',
                    'Praktik di sekolah (Market Day dan Preneur Day)',
                    'Praktik diluar sekolah',
                    'Seminar Kewirausahaan',
                  ]"
                  :key="point"
                  class="flex items-center gap-4"
                >
                  <span class="material-symbols-outlined text-amber-500 dark:text-stone-400 text-sm"
                    >rocket_launch</span
                  >
                  <span
                    class="text-[11px] font-bold text-amber-900/80 dark:text-stone-300 uppercase tracking-tight"
                    >{{ point }}</span
                  >
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="h-px bg-outline-variant/10 dark:bg-white/10"></div>

        <!-- Section V: Religious -->
        <div class="space-y-8">
          <h4
            class="text-sm font-black text-sky-600 uppercase tracking-[0.2em] flex items-center gap-3"
          >
            <span class="w-2 h-2 rounded-full bg-sky-600"></span>
            V. Religious
          </h4>

          <div
            class="bg-sky-50 dark:bg-stone-900/50 p-8 rounded-[2rem] border border-sky-100 dark:border-stone-800/50 space-y-6"
          >
            <label
              class="flex items-center gap-4 p-6 bg-white dark:bg-stone-800/50 rounded-2xl border-2 border-sky-200 dark:border-stone-700/50 cursor-pointer shadow-sm"
            >
              <input
                type="checkbox"
                v-model="form.religiousCommitment"
                required
                class="w-6 h-6 accent-sky-600 rounded-lg"
              />
              <div class="flex-1">
                <span
                  class="text-xs font-black text-sky-800 dark:text-stone-200 uppercase tracking-tight"
                >
                  Apakah kamu siap mengikuti kegiatan religious? <span class="text-red-500">*</span>
                </span>
                <p
                  v-if="form.errors.religiousCommitment"
                  class="text-[9px] font-bold text-red-500 uppercase mt-1"
                >
                  {{ form.errors.religiousCommitment }}
                </p>
              </div>
            </label>

            <div class="space-y-4">
              <div
                class="flex items-start gap-4 p-4 bg-white/50 dark:bg-stone-950/60 rounded-xl border border-sky-200/50 dark:border-stone-800/50 shadow-inner"
              >
                <span
                  class="material-symbols-outlined text-sky-500 dark:text-stone-400 text-sm mt-0.5"
                  >verified_user</span
                >
                <span
                  class="text-[11px] font-bold text-sky-900/80 dark:text-stone-300 uppercase tracking-tight"
                  >Menjalankan kewajiban sesuai dengan kepercayaan agama masing-masing</span
                >
              </div>

              <!-- Accordions -->
              <div class="space-y-3">
                <div
                  v-for="(item, id) in {
                    islam: {
                      title: 'Bagi yang Beragama Islam',
                      icon: 'mosque',
                      content: [
                        'Sholat Dhuha, Baca Quran dan Bahasa (DUQUBA)',
                        'Solat Dhuhur dan Asar Berjamaah',
                        'Doa dan Dzikir setelah sholat',
                        'Zakat dan Qurban',
                        'Menyelesaikan tadarus 30Juz selama menjadi murid',
                      ],
                    },
                    nonIslam: {
                      title: 'Bagi yang Beragama Non-Islam',
                      icon: 'church',
                      content: ['Ibadah Pagi', 'Ibadah Siang', 'Ibadah Sore'],
                    },
                  }"
                  :key="id"
                  class="border border-sky-200/50 dark:border-stone-800/50 rounded-2xl overflow-hidden bg-white/50 dark:bg-stone-950/60 shadow-inner"
                >
                  <button
                    @click.prevent="toggleAccordion(id)"
                    class="w-full p-5 flex items-center justify-between hover:bg-sky-100/50 transition-colors"
                  >
                    <div class="flex items-center gap-4">
                      <span class="material-symbols-outlined text-sky-600 dark:text-stone-400">{{
                        item.icon
                      }}</span>
                      <span
                        class="text-[11px] font-black text-sky-900 dark:text-stone-300 uppercase tracking-widest"
                        >{{ item.title }}</span
                      >
                    </div>
                    <span
                      class="material-symbols-outlined text-sky-400 transition-transform duration-300"
                      :class="{ 'rotate-180': openAccordion === id }"
                      >expand_more</span
                    >
                  </button>
                  <div v-show="openAccordion === id" class="p-5 pt-0 animate-fade-in">
                    <ul class="space-y-2">
                      <li
                        v-for="point in item.content"
                        :key="point"
                        class="flex items-center gap-3"
                      >
                        <span class="w-1 h-1 rounded-full bg-sky-400 dark:bg-stone-500"></span>
                        <span
                          class="text-[11px] font-bold text-sky-700/80 dark:text-stone-400 uppercase tracking-tight"
                          >{{ point }}</span
                        >
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  class="flex items-start gap-4 p-4 bg-white/50 dark:bg-stone-950/60 rounded-xl border border-sky-200/50 dark:border-stone-800/50 shadow-inner"
                >
                  <span
                    class="material-symbols-outlined text-sky-500 dark:text-stone-400 text-sm mt-0.5"
                    >event</span
                  >
                  <span
                    class="text-[11px] font-bold text-sky-900/80 dark:text-stone-300 uppercase tracking-tight"
                    >Memperingati hari raya keagamaan sesuai kepercayaan masing-masing</span
                  >
                </div>
                <div
                  class="flex items-start gap-4 p-4 bg-white/50 dark:bg-stone-950/60 rounded-xl border border-sky-200/50 dark:border-stone-800/50 shadow-inner"
                >
                  <span
                    class="material-symbols-outlined text-sky-500 dark:text-stone-400 text-sm mt-0.5"
                    >volunteer_activism</span
                  >
                  <span
                    class="text-[11px] font-bold text-sky-900/80 dark:text-stone-300 uppercase tracking-tight"
                    >Berpartisipasi dalam kegiatan sosial (Kedukaan, Bencana Alam, Berbagi
                    Kasih)</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="h-px bg-outline-variant/10 dark:bg-white/10"></div>

        <!-- Section VI: Kesimpulan Komitmen Kurikulum -->
        <div class="space-y-4">
          <h4
            class="text-sm font-black text-primary uppercase tracking-[0.2em] flex items-center gap-3"
          >
            <span class="w-2 h-2 rounded-full bg-primary"></span>
            VI. Kesimpulan Komitmen Kurikulum
          </h4>
          <div
            class="bg-surface-container-low p-8 rounded-[2rem] border border-outline-variant/20 space-y-4"
          >
            <label
              class="text-[10px] font-black text-outline dark:text-white/60 uppercase tracking-widest block leading-relaxed"
            >
              Apakah kamu siap mengikuti seluruh kegiatan Trampil (Softskill & Hardskill),
              Entrepreneur, dan Religius yang telah ditetapkan sekolah? Berikan alasannya:
              <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="form.specialActivities"
              rows="4"
              placeholder="Tuliskan alasan kesanggupan di sini..."
              required
              class="w-full bg-white border border-outline-variant/20 rounded-2xl p-6 text-sm font-bold text-primary dark:text-white focus:ring-2 ring-primary dark:focus:ring-primary-fixed-dim transition-all outline-none resize-none shadow-sm"
            ></textarea>
            <p
              v-if="form.errors.specialActivities"
              class="text-[9px] font-bold text-red-500 uppercase"
            >
              {{ form.errors.specialActivities }}
            </p>
          </div>
        </div>

        <div class="h-px bg-outline-variant/10 dark:bg-white/10"></div>

        <!-- Section VII: Pelanggaran Luar Biasa -->
        <div class="space-y-8">
          <h4
            class="text-sm font-black text-red-600 uppercase tracking-[0.2em] flex items-center gap-3"
          >
            <span class="w-2 h-2 rounded-full bg-red-600"></span>
            VII. Pelanggaran Luar Biasa
          </h4>

          <div
            class="bg-red-600 p-8 rounded-[2rem] border-4 border-red-700/20 space-y-6 relative overflow-hidden shadow-2xl shadow-red-900/30"
          >
            <div class="space-y-4 relative z-10">
              <div
                class="flex items-center gap-4 bg-white/10 p-6 rounded-2xl border border-white/20 mb-4 backdrop-blur-md"
              >
                <div
                  class="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-red-600 shadow-lg"
                >
                  <span class="material-symbols-outlined">report</span>
                </div>
                <div>
                  <h4
                    class="text-sm font-black text-white uppercase tracking-widest leading-none mb-1"
                  >
                    Peringatan Keras
                  </h4>
                  <p class="text-[10px] font-bold text-white/80 uppercase tracking-tight">
                    Pelanggaran di bawah ini berakibat siswa dikembalikan ke orang tua
                  </p>
                </div>
              </div>

              <div class="grid grid-cols-1 gap-2">
                <label
                  v-for="(label, key) in {
                    tauran:
                      'a) Merencanakan, mendukung, ikut serta, dan/atau menonton kegiatan tauran',
                    asusila: 'b) Melakukan tindakan asusila (seks bebas)',
                    narkoba: 'c) Mengkonsumsi dan/atau mengedarkan narkoba',
                    kriminal:
                      'd) Melakukan tindakan kriminal yang dibuktikan dengan catatan kepolisian',
                    bullying:
                      'e) Melakukan perundungan/perilaku yang menyakiti orang lain secara sengaja maupun berulang (Bullying)',
                    kekerasanGuru: 'f) Melakukan kekerasan fisik kepada guru',
                    menikah: 'g) Menikah dalam status murid',
                  }"
                  :key="key"
                  class="flex items-start gap-4 p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 cursor-pointer hover:bg-white/20 transition-all group"
                >
                  <input
                    type="checkbox"
                    v-model="form.violationDetails[key]"
                    required
                    class="w-5 h-5 accent-red-600 shadow-sm"
                  />
                  <div class="flex-1">
                    <span class="text-[11px] font-black text-white uppercase leading-relaxed"
                      >{{ label }} <span class="text-red-500">*</span></span
                    >
                    <p
                      v-if="form.errors[`violationDetails.${key}`]"
                      class="text-[9px] font-bold text-white/80 uppercase mt-1"
                    >
                      {{ form.errors[`violationDetails.${key}`] }}
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <label
              class="flex items-center gap-4 p-6 bg-white text-red-600 rounded-2xl cursor-pointer shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all relative z-10 border-2 border-white/20"
            >
              <input
                type="checkbox"
                v-model="form.violationAgreement"
                required
                class="w-6 h-6 accent-red-600"
              />
              <div class="flex flex-col">
                <span class="text-[11px] font-black uppercase tracking-widest leading-none mb-1"
                  >SAYA MEMAHAMI & SETUJU DENGAN KONSEKUENSI DI ATAS
                  <span class="text-red-500">*</span></span
                >
                <p
                  v-if="form.errors.violationAgreement"
                  class="text-[9px] font-bold text-red-900 uppercase mt-1"
                >
                  {{ form.errors.violationAgreement }}
                </p>
                <span class="text-[9px] font-bold opacity-70 uppercase tracking-tighter"
                  >Konfirmasi ini bersifat mutlak dan tidak dapat diganggu gugat</span
                >
              </div>
            </label>
          </div>
        </div>

        <div class="h-px bg-outline-variant/10 dark:bg-white/10"></div>

        <!-- Section VIII: Orang Tua & Pembiayaan -->
        <div class="space-y-8">
          <h4
            class="text-sm font-black text-tertiary uppercase tracking-[0.2em] flex items-center gap-3"
          >
            <span class="w-2 h-2 rounded-full bg-tertiary"></span>
            VIII. Orang Tua & Pembiayaan
          </h4>

          <div class="space-y-4">
            <h4 class="text-xs font-black text-primary uppercase tracking-[0.2em] mb-4">
              Wawancara Orang Tua
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label
                v-for="(label, key) in {
                  fullSupport: '1. Sanggup mendukung sepenuhnya program sekolah?',
                  laptopProvision: '2. Sanggup menyediakan laptop untuk ujian/pembelajaran?',
                  pklConsent: '3. Bersedia bila PKL dilakukan di tempat yang jauh (JABODETABEK)?',
                  deviceCheckConsent:
                    '4. Bersedia diperiksa HP/Laptop bila ada penyelidikan kasus?',
                  relationshipCommitment:
                    '5. Bersedia menjalin hubungan baik dengan sekolah terkait komunikasi dan kehadiran sekolah (rapat, pengambilan raport dan penyelesaian masalah murid)',
                }"
                :key="key"
                class="flex items-center gap-4 p-4 rounded-xl border border-outline-variant/10 cursor-pointer hover:bg-primary/5 transition-all"
              >
                <input
                  type="checkbox"
                  v-model="form.parentCommitments[key]"
                  required
                  class="w-5 h-5 accent-secondary"
                />
                <div class="flex-1">
                  <span class="text-[11px] font-bold text-primary leading-tight"
                    >{{ label }} <span class="text-red-500">*</span></span
                  >
                  <p
                    v-if="form.errors[`parentCommitments.${key}`]"
                    class="text-[9px] font-bold text-red-500 uppercase mt-1"
                  >
                    {{ form.errors[`parentCommitments.${key}`] }}
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-3">
              <label
                class="text-[10px] font-black text-outline dark:text-white/60 uppercase tracking-widest block"
                >6. Ananda tinggal bersama siapa? <span class="text-red-500">*</span></label
              >
              <input
                type="text"
                v-model="form.livingWith"
                required
                class="w-full bg-surface-container-low border border-outline-variant/20 rounded-2xl p-4 font-bold text-primary dark:text-white outline-none"
              />
              <p v-if="form.errors.livingWith" class="text-[9px] font-bold text-red-500 uppercase">
                {{ form.errors.livingWith }}
              </p>
            </div>
            <div class="space-y-3">
              <label
                class="text-[10px] font-black text-outline dark:text-white/60 uppercase tracking-widest block"
                >7. Siapa yang dihubungi bila ada keadaan darurat?
                <span class="text-red-500">*</span></label
              >
              <input
                type="text"
                v-model="form.emergencyContact"
                required
                class="w-full bg-surface-container-low border border-outline-variant/20 rounded-2xl p-4 font-bold text-primary dark:text-white outline-none"
              />
              <p
                v-if="form.errors.emergencyContact"
                class="text-[9px] font-bold text-red-500 uppercase"
              >
                {{ form.errors.emergencyContact }}
              </p>
            </div>
            <div class="space-y-3">
              <label
                class="text-[10px] font-black text-outline dark:text-white/60 uppercase tracking-widest block"
                >8. No. Telepon Kontak Darurat <span class="text-red-500">*</span></label
              >
              <input
                type="text"
                v-model="form.emergencyContactPhone"
                required
                class="w-full bg-surface-container-low border border-outline-variant/20 rounded-2xl p-4 font-bold text-primary dark:text-white outline-none"
              />
              <p
                v-if="form.errors.emergencyContactPhone"
                class="text-[9px] font-bold text-red-500 uppercase"
              >
                {{ form.errors.emergencyContactPhone }}
              </p>
            </div>
          </div>

          <div
            class="bg-primary/5 dark:bg-primary/10 p-8 rounded-[2rem] border border-primary/20 space-y-6"
          >
            <div class="space-y-4">
              <h4
                class="text-xs font-black text-primary dark:text-primary-fixed-dim uppercase tracking-[0.2em]"
              >
                9. Komitmen Pembiayaan
              </h4>
              <p
                class="text-[11px] font-bold text-primary/80 dark:text-primary-fixed-dim/80 leading-relaxed italic"
              >
                "SMK Plus Pelita Nusantara adalah sekolah swasta, sehingga sumber dana terbesar
                didapat dari orang tua murid, adapun dari pemerintah dana digunakan untuk
                mengembangkan sarana dan prasarana sekolah yang digunakan untuk murid. Bapak Ibu
                bersedia untuk memenuhi kewajiban pembiayaan sampai dengan lulus?"
              </p>
            </div>
            <label
              class="flex items-center gap-4 p-4 bg-white dark:bg-surface-container-high rounded-xl border-2 border-primary/20 cursor-pointer hover:bg-primary/5 transition-all"
            >
              <input
                type="checkbox"
                v-model="form.parentCommitments.financialCommitment"
                required
                class="w-6 h-6 accent-primary"
              />
              <div class="flex-1">
                <span
                  class="text-xs font-black text-primary dark:text-primary-fixed-dim uppercase tracking-tight"
                  >Sanggup & Bersedia Memenuhi Kewajiban Pembiayaan
                  <span class="text-red-500">*</span></span
                >
                <p
                  v-if="form.errors['parentCommitments.financialCommitment']"
                  class="text-[9px] font-bold text-red-500 uppercase mt-1"
                >
                  {{ form.errors['parentCommitments.financialCommitment'] }}
                </p>
              </div>
            </label>
          </div>

          <div
            class="bg-surface-container-low p-8 rounded-[2rem] border border-outline-variant/10 space-y-6"
          >
            <h4
              class="text-xs font-black text-outline dark:text-white/60 uppercase tracking-[0.2em]"
            >
              10. Penanggung Jawab Pembiayaan
            </h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-[9px] font-black text-outline dark:text-white/60 uppercase"
                  >Nama Lengkap <span class="text-red-500">*</span></label
                >
                <input
                  type="text"
                  v-model="form.billingDetails.name"
                  required
                  class="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl p-3 text-sm font-bold text-on-surface dark:text-white"
                />
                <p
                  v-if="form.errors['billingDetails.name']"
                  class="text-[9px] font-bold text-red-500 uppercase"
                >
                  {{ form.errors['billingDetails.name'] }}
                </p>
              </div>
              <div class="space-y-2">
                <label class="text-[9px] font-black text-outline dark:text-white/60 uppercase"
                  >Hubungan Keluarga <span class="text-red-500">*</span></label
                >
                <input
                  type="text"
                  v-model="form.billingDetails.relationship"
                  required
                  class="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl p-3 text-sm font-bold text-on-surface dark:text-white"
                />
                <p
                  v-if="form.errors['billingDetails.relationship']"
                  class="text-[9px] font-bold text-red-500 uppercase"
                >
                  {{ form.errors['billingDetails.relationship'] }}
                </p>
              </div>
              <div class="space-y-2">
                <label class="text-[9px] font-black text-outline dark:text-white/60 uppercase"
                  >Pekerjaan <span class="text-red-500">*</span></label
                >
                <input
                  type="text"
                  v-model="form.billingDetails.job"
                  required
                  class="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl p-3 text-sm font-bold text-on-surface dark:text-white"
                />
                <p
                  v-if="form.errors['billingDetails.job']"
                  class="text-[9px] font-bold text-red-500 uppercase"
                >
                  {{ form.errors['billingDetails.job'] }}
                </p>
              </div>
              <div class="space-y-2">
                <label class="text-[9px] font-black text-outline dark:text-white/60 uppercase"
                  >No. Telepon / WA <span class="text-red-500">*</span></label
                >
                <input
                  type="text"
                  v-model="form.billingDetails.phone"
                  required
                  class="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl p-3 text-sm font-bold text-on-surface dark:text-white"
                />
                <p
                  v-if="form.errors['billingDetails.phone']"
                  class="text-[9px] font-bold text-red-500 uppercase"
                >
                  {{ form.errors['billingDetails.phone'] }}
                </p>
              </div>
              <div class="space-y-2">
                <label class="text-[9px] font-black text-outline dark:text-white/60 uppercase"
                  >Sumber Pembiayaan Lain <span class="text-red-500">*</span></label
                >
                <input
                  type="text"
                  v-model="form.billingDetails.otherSource"
                  required
                  class="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl p-3 text-sm font-bold text-primary dark:text-white"
                />
                <p
                  v-if="form.errors['billingDetails.otherSource']"
                  class="text-[9px] font-bold text-red-500 uppercase"
                >
                  {{ form.errors['billingDetails.otherSource'] }}
                </p>
              </div>

              <!-- Catatan Khusus Billing -->
              <div class="col-span-full space-y-2 mt-4 pt-6 border-t border-outline-variant/10">
                <label class="text-[9px] font-black text-outline dark:text-white/60 uppercase">
                  Catatan Khusus
                </label>
                <textarea
                  v-model="form.billingDetails.notes"
                  placeholder="Tambahkan catatan khusus mengenai pembiayaan atau komitmen orang tua..."
                  class="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl p-4 text-sm font-bold text-primary dark:text-white min-h-[100px] outline-none focus:ring-2 ring-primary/20 transition-all"
                ></textarea>
                <p
                  v-if="form.errors['billingDetails.notes']"
                  class="text-[9px] font-bold text-red-500 uppercase mt-1"
                >
                  {{ form.errors['billingDetails.notes'] }}
                </p>
              </div>
            </div>
          </div>
        </div>



        <!-- Footer -->
        <div class="pt-8 flex justify-between items-center border-t border-outline-variant/10">
          <button
            type="button"
            @click="isResetModalOpen = true"
            class="px-6 py-4 bg-red-50 text-red-600 font-black rounded-2xl hover:bg-red-100 transition-all flex items-center gap-2 border border-red-200"
          >
            <span class="material-symbols-outlined text-sm">restart_alt</span>
            RESET DATA
          </button>
          
          <div class="flex gap-4">
            <Link
              href="/admin/interviews"
              class="px-8 py-5 border-2 border-outline-variant/30 text-outline dark:text-white/60 font-black rounded-2xl hover:bg-surface-container-low transition-all flex items-center gap-3"
            >
              BATAL
            </Link>
            <button
              type="submit"
              :disabled="form.processing"
              class="px-12 py-5 bg-emerald-600 text-white font-black rounded-2xl shadow-xl shadow-emerald-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3 disabled:opacity-50"
            >
              {{ form.processing ? 'MENYIMPAN...' : 'SIMPAN HASIL WAWANCARA' }}
              <span class="material-symbols-outlined">done_all</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>

  <!-- Reset Confirmation Modal -->
  <Teleport to="body">
    <div v-if="isResetModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/80 backdrop-blur-md" @click="isResetModalOpen = false"></div>
      
      <div class="relative bg-card w-full max-w-md rounded-[2.5rem] shadow-2xl border border-outline-variant/30 overflow-hidden animate-in zoom-in-95 duration-200">
        <div class="p-8 space-y-6">
          <div class="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center text-red-600 mx-auto">
            <span class="material-symbols-outlined text-4xl">warning</span>
          </div>
          
          <div class="text-center space-y-2">
            <h3 class="text-xl font-black text-primary uppercase tracking-tight font-headline">Konfirmasi Reset Data</h3>
            <p class="text-sm text-on-surface-variant font-medium">Tindakan ini akan mengosongkan seluruh hasil wawancara yang telah diisi. Data tidak dapat dikembalikan.</p>
          </div>
          
          <div class="space-y-3">
            <label class="text-[10px] font-black text-red-600 uppercase tracking-widest block text-center">
              Ketik kata <span class="underline">reset</span> untuk melanjutkan
            </label>
            <input 
              v-model="resetConfirmationText"
              type="text"
              class="w-full bg-surface-container-low border-2 border-red-100 rounded-2xl px-6 py-4 text-center text-lg font-black text-red-600 outline-none focus:border-red-500 transition-all uppercase"
              placeholder="Ketik di sini..."
              @keyup.enter="handleReset"
            />
          </div>
          
          <div class="grid grid-cols-2 gap-4 pt-4">
            <button 
              @click="isResetModalOpen = false"
              class="py-4 bg-surface-container-high text-outline font-black rounded-2xl hover:bg-white transition-all uppercase tracking-widest text-xs"
            >
              BATAL
            </button>
            <button 
              @click="handleReset"
              :disabled="resetConfirmationText.toLowerCase() !== 'reset' || isResetting"
              class="py-4 bg-red-600 text-white font-black rounded-2xl shadow-lg shadow-red-600/20 hover:bg-red-700 transition-all uppercase tracking-widest text-xs disabled:opacity-50 disabled:grayscale"
            >
              {{ isResetting ? 'PROSES...' : 'YA, RESET DATA' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
