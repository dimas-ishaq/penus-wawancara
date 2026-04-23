<script setup lang="ts">
import { Head, useForm, Link, usePage } from '@inertiajs/vue3'
import { computed } from 'vue'
import AdminLayout from '~/layouts/admin.vue'

defineOptions({ layout: AdminLayout })

const props = defineProps<{
  interview: any
  majors: any[]
}>()

const page = usePage()
const currentUser = computed(() => page.props.user as any)

const form = useForm({
  interviewDate: props.interview.interviewDate ? props.interview.interviewDate.split('T')[0] : new Date().toISOString().split('T')[0],
  accompaniment: props.interview.accompaniment || '',
  interviewer: props.interview.interviewer || currentUser.value?.fullName || 'Admin PPDB',
  // Section 1
  infoSource: props.interview.infoSource || '',
  reasonChoosingSchool: props.interview.reasonChoosingSchool || '',
  majorChoice: props.interview.majorChoice || '',
  selectedMajor: props.interview.majorChoice ? props.interview.majorChoice.split(' - ')[0] : '',
  majorReason: props.interview.majorChoice && props.interview.majorChoice.includes(' - ') 
    ? props.interview.majorChoice.split(' - ').slice(1).join(' - ') 
    : props.interview.majorChoice || '',
  longTermGoals: props.interview.longTermGoals || '',
  // Section 2
  characterAnswers: props.interview.characterAnswers || {
    homeDistance: '',
    travelMethod: '',
    vehicleCommitment: false,
    presenceCommitment: false,
    alfaCommitment: false,
    disciplineCommitment: false,
    cleanlinessCommitment: false
  },
  specialActivities: props.interview.specialActivities || '',
  violationAgreement: props.interview.violationAgreement || false,
  // Section 3
  parentCommitments: props.interview.parentCommitments || {
    fullSupport: false,
    laptopProvision: false,
    pklConsent: false,
    deviceCheckConsent: false
  },
  livingWith: props.interview.livingWith || '',
  emergencyContact: props.interview.emergencyContact || '',
  billingDetails: props.interview.billingDetails || {
    name: '',
    relationship: '',
    job: '',
    otherSource: ''
  }
})

const submitRecap = () => {
  form.majorChoice = `${form.selectedMajor} - ${form.majorReason}`
  form.put(`/admin/interviews/${props.interview.id}/recap`)
}
</script>

<template>
  <Head :title="'Input Hasil: ' + interview.studentName" />

  <div class="max-w-4xl mx-auto py-8">
    <div class="mb-8 flex justify-between items-center">
      <div class="flex items-center gap-4">
        <Link href="/admin/interviews" class="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-primary border border-outline-variant/20 hover:bg-white transition-all">
          <span class="material-symbols-outlined">arrow_back</span>
        </Link>
        <div>
          <h1 class="text-3xl font-black text-primary tracking-tighter font-headline mb-1">{{ interview.studentName }}</h1>
          <p class="text-xs text-on-surface-variant font-bold uppercase tracking-widest">{{ interview.id }} • {{ interview.schoolOrigin }}</p>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-[2.5rem] shadow-xl border border-outline-variant/30 overflow-hidden flex flex-col font-body">
      <!-- Header -->
      <div class="bg-surface-container-high p-8 border-b border-outline-variant/20">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <span class="material-symbols-outlined">assignment_ind</span>
          </div>
          <div>
            <h4 class="text-lg font-black text-primary font-headline tracking-tight">Formulir Hasil Wawancara</h4>
            <p class="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Lengkapi seluruh data hasil seleksi wawancara</p>
          </div>
        </div>
      </div>

      <!-- Form Content -->
      <form @submit.prevent="submitRecap" class="p-8 sm:p-12 space-y-12">
        <!-- Section I: Identitas & Aspirasi -->
        <div class="space-y-8">
          <h4 class="text-sm font-black text-primary uppercase tracking-[0.2em] flex items-center gap-3">
             <span class="w-2 h-2 rounded-full bg-primary"></span>
             I. Identitas & Aspirasi
          </h4>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-3">
              <label class="text-[10px] font-black text-outline uppercase tracking-widest">Tanggal Wawancara</label>
              <input type="date" v-model="form.interviewDate"
                class="w-full bg-surface-container-low border border-outline-variant/20 rounded-2xl p-4 font-bold text-primary focus:ring-2 ring-primary outline-none transition-all" />
            </div>
            <div class="space-y-3">
              <label class="text-[10px] font-black text-outline uppercase tracking-widest">Pewawancara</label>
              <input type="text" v-model="form.interviewer" readonly
                class="w-full bg-surface-container-low/50 border border-outline-variant/20 rounded-2xl p-4 font-bold text-outline cursor-not-allowed outline-none transition-all" />
            </div>
          </div>

          <div class="space-y-4">
            <label class="text-[10px] font-black text-outline uppercase tracking-widest block">1. Dari mana ananda mengetahui SMK Plus Pelita Nusantara?</label>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <label
                v-for="opt in ['Kakak Alumni', 'Kerabat/Saudara', 'Tetangga/Teman', 'Kakak Kelas', 'Walikelas SMP', 'Media Sosial', 'Lainnya']"
                :key="opt"
                class="flex items-center gap-3 p-4 rounded-2xl border border-outline-variant/20 cursor-pointer hover:bg-primary/5 transition-colors"
                :class="{ 'bg-primary/10 border-primary/30': form.infoSource === opt }">
                <input type="radio" :value="opt" v-model="form.infoSource" class="accent-primary" />
                <span class="text-xs font-bold text-primary">{{ opt }}</span>
              </label>
            </div>
          </div>

          <div class="space-y-3">
            <label class="text-[10px] font-black text-outline uppercase tracking-widest block">2. Mengapa pilih SMK Plus Pelita Nusantara untuk menjadi pilihan sekolah?</label>
            <textarea v-model="form.reasonChoosingSchool" rows="3"
              class="w-full bg-surface-container-low border border-outline-variant/20 rounded-2xl p-6 text-sm text-primary focus:ring-2 ring-primary outline-none transition-all resize-none"></textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-3">
              <label class="text-[10px] font-black text-outline uppercase tracking-widest block">3. Jurusan apa yang dipilih? mengapa?</label>
              <div class="flex flex-col gap-4">
                <select v-model="form.selectedMajor"
                  class="w-full bg-surface-container-low border border-outline-variant/20 rounded-2xl p-4 font-bold text-primary focus:ring-2 ring-primary outline-none transition-all">
                  <option value="" disabled>Pilih Jurusan...</option>
                  <option v-for="major in majors" :key="major.id" :value="major.name">
                    {{ major.name }} ({{ major.code }})
                  </option>
                </select>
                <textarea v-model="form.majorReason" rows="3" placeholder="Alasan memilih jurusan..."
                  class="w-full bg-surface-container-low border border-outline-variant/20 rounded-2xl p-6 text-sm text-primary focus:ring-2 ring-primary outline-none transition-all resize-none"></textarea>
              </div>
            </div>
            <div class="space-y-3">
              <label class="text-[10px] font-black text-outline uppercase tracking-widest block">4. Cita-cita atau harapan jangka panjang?</label>
              <textarea v-model="form.longTermGoals" rows="3"
                class="w-full bg-surface-container-low border border-outline-variant/20 rounded-2xl p-6 text-sm text-primary focus:ring-2 ring-primary outline-none transition-all resize-none"></textarea>
            </div>
          </div>
        </div>

        <div class="h-px bg-outline-variant/10"></div>

        <!-- Section II: Karakter & Disiplin -->
        <div class="space-y-8">
          <h4 class="text-sm font-black text-secondary uppercase tracking-[0.2em] flex items-center gap-3">
             <span class="w-2 h-2 rounded-full bg-secondary"></span>
             II. Karakter & Disiplin
          </h4>

          <div class="bg-primary/5 p-8 rounded-[2rem] border border-primary/10">
            <h4 class="text-xs font-black text-primary uppercase tracking-[0.2em] mb-6">5. Kesanggupan Success by Character</h4>
            <div class="space-y-6">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="text-[10px] font-bold text-outline uppercase">a) Berapa jarak rumah ke sekolah?</label>
                  <input type="text" v-model="form.characterAnswers.homeDistance" placeholder="... km"
                    class="w-full bg-white border border-outline-variant/20 rounded-xl p-3 text-sm text-primary outline-none" />
                </div>
                <div class="space-y-2">
                  <label class="text-[10px] font-bold text-outline uppercase">b) Bagaimana berangkat ke sekolah?</label>
                  <select v-model="form.characterAnswers.travelMethod"
                    class="w-full bg-white border border-outline-variant/20 rounded-xl p-3 text-sm text-primary outline-none">
                    <option value="" disabled>Pilih transportasi...</option>
                    <option v-for="opt in ['Motor (Sendiri)', 'Motor (Diantar)', 'Angkutan Umum', 'Jalan Kaki', 'Sepeda', 'Mobil (Diantar)', 'Lainnya']" :key="opt" :value="opt">
                      {{ opt }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="space-y-4 pt-4 border-t border-outline-variant/10">
                <label v-for="(label, key) in {
                  vehicleCommitment: 'c) Sanggup menggunakan kendaraan standar & parkir di tempat yang disediakan?',
                  presenceCommitment: 'd) Sanggup hadir mengikuti kegiatan pembelajaran Senin - Sabtu?',
                  alfaCommitment: 'e) Siap dikembalikan ke ortu bila Alfa > 7 kali?',
                  disciplineCommitment: 'f) Siap menjalankan disiplin sesuai aturan sekolah?',
                  cleanlinessCommitment: 'g) Siap aktif menjaga kebersihan (seperti piket)?'
                }" :key="key"
                  class="flex items-center gap-4 p-4 rounded-xl border border-outline-variant/10 cursor-pointer hover:bg-white transition-all">
                  <input type="checkbox" v-model="form.characterAnswers[key]"
                      class="w-5 h-5 accent-primary rounded-lg" />
                  <span class="text-xs font-bold text-primary leading-tight">{{ label }}</span>
                </label>
              </div>
            </div>
          </div>

          <div class="space-y-3">
            <label class="text-[10px] font-black text-outline uppercase tracking-widest block">6. Siap mengikuti kegiatan Trampil, Entrepreneur, dan Religius? (Jawaban singkat)</label>
            <input type="text" v-model="form.specialActivities"
              class="w-full bg-surface-container-low border border-outline-variant/20 rounded-2xl p-4 font-bold text-primary outline-none" />
          </div>

          <div class="bg-error/5 p-8 rounded-[2rem] border border-error/20 space-y-4">
            <h4 class="text-xs font-black text-error uppercase tracking-[0.2em]">7. Pelanggaran luar biasa dengan sanksi dikembalikan ke orang tua</h4>
            <p class="text-[10px] text-error/70 font-medium leading-relaxed italic">
              Tauran, Asusila, Narkoba, Kriminal, Bullying, Kekerasan Fisik ke Guru, Menikah dalam status murid.
            </p>
            <label
              class="flex items-center gap-4 p-4 bg-white rounded-xl border-2 border-error/30 cursor-pointer">
              <input type="checkbox" v-model="form.violationAgreement" required
                class="w-6 h-6 accent-error" />
              <span class="text-xs font-black text-error uppercase tracking-tighter">SAYA MEMAHAMI & SETUJU DENGAN KONSEKUENSI DI ATAS</span>
            </label>
          </div>
        </div>

        <div class="h-px bg-outline-variant/10"></div>

        <!-- Section III: Orang Tua & Pembiayaan -->
        <div class="space-y-8">
          <h4 class="text-sm font-black text-tertiary uppercase tracking-[0.2em] flex items-center gap-3">
             <span class="w-2 h-2 rounded-full bg-tertiary"></span>
             III. Orang Tua & Pembiayaan
          </h4>

          <div class="space-y-4">
            <h4 class="text-xs font-black text-primary uppercase tracking-[0.2em] mb-4">Wawancara Orang Tua</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label v-for="(label, key) in {
                fullSupport: '1. Sanggup mendukung sepenuhnya program sekolah?',
                laptopProvision: '2. Sanggup menyediakan laptop untuk ujian/pembelajaran?',
                pklConsent: '3. Bersedia bila PKL dilakukan di tempat yang jauh?',
                deviceCheckConsent: '4. Bersedia diperiksa HP/Laptop bila ada kasus?'
              }" :key="key"
                class="flex items-center gap-4 p-4 rounded-xl border border-outline-variant/10 cursor-pointer hover:bg-primary/5 transition-all">
                <input type="checkbox" v-model="form.parentCommitments[key]"
                  class="w-5 h-5 accent-secondary" />
                <span class="text-[11px] font-bold text-primary leading-tight">{{ label }}</span>
              </label>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-3">
              <label class="text-[10px] font-black text-outline uppercase tracking-widest block">5. Ananda tinggal bersama siapa?</label>
              <input type="text" v-model="form.livingWith"
                class="w-full bg-surface-container-low border border-outline-variant/20 rounded-2xl p-4 font-bold text-primary outline-none" />
            </div>
            <div class="space-y-3">
              <label class="text-[10px] font-black text-outline uppercase tracking-widest block">6. Siapa yang dihubungi bila ada keadaan darurat?</label>
              <input type="text" v-model="form.emergencyContact"
                class="w-full bg-surface-container-low border border-outline-variant/20 rounded-2xl p-4 font-bold text-primary outline-none" />
            </div>
          </div>

          <div class="bg-surface-container-low p-8 rounded-[2rem] border border-outline-variant/10 space-y-6">
            <h4 class="text-xs font-black text-outline uppercase tracking-[0.2em]">7. Penanggung Jawab Pembiayaan</h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-[9px] font-black text-outline uppercase">Nama Lengkap</label>
                <input type="text" v-model="form.billingDetails.name"
                  class="w-full bg-white border border-outline-variant/20 rounded-xl p-3 text-sm font-bold text-primary outline-none" />
              </div>
              <div class="space-y-2">
                <label class="text-[9px] font-black text-outline uppercase">Hubungan Keluarga</label>
                <input type="text" v-model="form.billingDetails.relationship"
                  class="w-full bg-white border border-outline-variant/20 rounded-xl p-3 text-sm font-bold text-primary outline-none" />
              </div>
              <div class="space-y-2">
                <label class="text-[9px] font-black text-outline uppercase">Pekerjaan</label>
                <input type="text" v-model="form.billingDetails.job"
                  class="w-full bg-white border border-outline-variant/20 rounded-xl p-3 text-sm font-bold text-primary outline-none" />
              </div>
              <div class="space-y-2">
                <label class="text-[9px] font-black text-outline uppercase">Sumber Pembiayaan Lain</label>
                <input type="text" v-model="form.billingDetails.otherSource"
                  class="w-full bg-white border border-outline-variant/20 rounded-xl p-3 text-sm font-bold text-primary outline-none" />
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="pt-8 flex justify-end gap-4 border-t border-outline-variant/10">
          <Link href="/admin/interviews"
            class="px-8 py-5 border-2 border-outline-variant/30 text-outline font-black rounded-2xl hover:bg-surface-container-low transition-all flex items-center gap-3">
            BATAL
          </Link>
          <button type="submit" :disabled="form.processing"
            class="px-12 py-5 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform flex items-center gap-3 disabled:opacity-50">
            {{ form.processing ? 'MENYIMPAN...' : 'SIMPAN HASIL WAWANCARA' }}
            <span class="material-symbols-outlined">done_all</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
