import vine, { SimpleMessagesProvider } from '@vinejs/vine'
export const messages = {
  'required': 'Kolom ini wajib diisi atau diklik',
  'minLength': 'Minimal {{ min }} karakter',
  'studentName.minLength': 'Nama siswa harus memiliki minimal 3 karakter',
  'schoolOrigin.minLength': 'Asal sekolah harus memiliki minimal 3 karakter',
  'accepted': 'Kolom ini wajib disetujui atau diklik',
  'characterAnswers.homeDistance.number': 'Jarak rumah harus berupa angka',
}

vine.messagesProvider = new SimpleMessagesProvider(messages)

export const createInterviewValidator = vine.compile(
  vine.object({
    studentName: vine.string().minLength(3),
    schoolOrigin: vine.string().minLength(3),
  })
)

export const updateRecapValidator = vine.compile(
  vine.object({
    studentName: vine.string().minLength(3),
    schoolOrigin: vine.string().minLength(3),
    interviewDate: vine.string(),
    interviewer: vine.string(),
    accompaniment: vine.string().nullable(),
    infoSource: vine.string(),
    reasonChoosingSchool: vine.string(),
    selectedMajor: vine.string(),
    majorReason: vine.string(),
    longTermGoals: vine.string(),
    characterAnswers: vine.object({
      homeDistance: vine.number(),
      travelMethod: vine.string(),
      arrival645Commitment: vine.accepted(),
      vehicleCommitment: vine.accepted(),
      presenceCommitment: vine.accepted(),
      alfaCommitment: vine.accepted(),
      disciplineCommitment: vine.accepted(),
      cleanlinessCommitment: vine.accepted(),
      allActivityCommitment: vine.accepted(),
    }),
    skillCommitment: vine.accepted(),
    entrepreneurCommitment: vine.accepted(),
    religiousCommitment: vine.accepted(),
    specialActivities: vine.string(),
    violationAgreement: vine.accepted(),
    violationDetails: vine.object({
      tauran: vine.accepted(),
      asusila: vine.accepted(),
      narkoba: vine.accepted(),
      kriminal: vine.accepted(),
      bullying: vine.accepted(),
      kekerasanGuru: vine.accepted(),
      menikah: vine.accepted(),
    }),
    parentCommitments: vine.object({
      fullSupport: vine.accepted(),
      laptopProvision: vine.accepted(),
      pklConsent: vine.accepted(),
      deviceCheckConsent: vine.accepted(),
      relationshipCommitment: vine.accepted(),
      financialCommitment: vine.accepted(),
    }),
    livingWith: vine.string(),
    emergencyContact: vine.string(),
    emergencyContactPhone: vine.string(),
    billingDetails: vine.object({
      name: vine.string(),
      relationship: vine.string(),
      job: vine.string(),
      phone: vine.string(),
      otherSource: vine.string(),
      notes: vine.string().nullable().optional(),
    }),
    notes: vine.string().nullable().optional(),

  })
)
