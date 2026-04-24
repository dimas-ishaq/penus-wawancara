import Interview from '#models/interview'
import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
  async run() {
    const admin = await User.first()
    if (!admin) return

    const firstNames = ['Budi', 'Siti', 'Agus', 'Lani', 'Joko', 'Dewi', 'Andi', 'Rina', 'Tono', 'Maya', 'Rizky', 'Putri', 'Fajar', 'Siska', 'Hendra']
    const lastNames = ['Santoso', 'Pratiwi', 'Hidayat', 'Lestari', 'Saputra', 'Wijaya', 'Kusuma', 'Sari', 'Gunawan', 'Putri', 'Ramadhan', 'Aulia', 'Kurniawan', 'Fitriani', 'Permana']
    const schools = ['SMPN 1 Bogor', 'SMPN 2 Bogor', 'SMP Plus Al-Azhar', 'SMP IT Nurul Fikri', 'SMP BPK Penabur', 'SMP Regina Pacis', 'SMPN 3 Cibinong', 'SMP Insan Kamil']
    const sources = ['Media Sosial', 'Website', 'Teman/Keluarga', 'Brosur', 'Guru SMP', 'Lainnya']
    const majors = ['PPLG', 'TJKT', 'DKV', 'AKL', 'MPLB']
    const travelMethods = ['Motor Sendiri', 'Diantar Orang Tua', 'Angkutan Umum', 'Jalan Kaki', 'Ojek Online']

    const interviews = []

    for (let i = 1; i <= 100; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
      const status = Math.random() > 0.3 ? 'Done' : 'Pending'
      
      interviews.push({
        id: `PPDB-${String(i).padStart(3, '0')}`,
        studentName: `${firstName} ${lastName}`,
        schoolOrigin: schools[Math.floor(Math.random() * schools.length)],
        status: status,
        userId: admin.id,
        interviewDate: status === 'Done' ? DateTime.now().minus({ days: Math.floor(Math.random() * 30) }) : null,
        interviewer: 'Admin Interviewer',
        accompaniment: 'Orang Tua',
        infoSource: sources[Math.floor(Math.random() * sources.length)],
        reasonChoosingSchool: 'Sekolah ini memiliki reputasi yang sangat baik dan fasilitas yang lengkap untuk menunjang pembelajaran serta lingkungan yang agamis.',
        majorChoice: majors[Math.floor(Math.random() * majors.length)],
        majorReason: 'Saya sangat tertarik dengan bidang ini dan ingin mengembangkan karir di industri teknologi masa depan.',
        longTermGoals: 'Menjadi seorang profesional yang ahli di bidangnya dan dapat berkontribusi positif bagi masyarakat serta membangun karir yang cemerlang.',
        
        characterAnswers: {
          homeDistance: Math.floor(Math.random() * 20) + 1,
          travelMethod: travelMethods[Math.floor(Math.random() * travelMethods.length)],
          arrival645Commitment: true,
          vehicleCommitment: true,
          presenceCommitment: true,
          alfaCommitment: true,
          disciplineCommitment: true,
          cleanlinessCommitment: true,
          allActivityCommitment: true,
        },
        
        specialActivities: 'Saya sanggup mengikuti seluruh kegiatan karena ingin menjadi pribadi yang disiplin dan trampil.',
        skillCommitment: true,
        entrepreneurCommitment: true,
        religiousCommitment: true,
        violationAgreement: true,
        
        violationDetails: {
          tauran: true,
          asusila: true,
          narkoba: true,
          kriminal: true,
          bullying: true,
          kekerasanGuru: true,
          menikah: true
        },
        
        parentCommitments: {
          fullSupport: true,
          laptopProvision: true,
          pklConsent: true,
          deviceCheckConsent: true,
          relationshipCommitment: true,
          financialCommitment: true,
        },
        
        livingWith: 'Orang Tua',
        emergencyContact: 'Ayah Kandung',
        emergencyContactPhone: '0812' + Math.floor(Math.random() * 100000000).toString().padStart(8, '0'),
        
        billingDetails: {
          name: `${lastName} Senior`,
          relationship: 'Ayah',
          job: 'Karyawan Swasta',
          phone: '0813' + Math.floor(Math.random() * 100000000).toString().padStart(8, '0'),
          otherSource: '-',
        }
      })
    }

    // Use updateOrCreateMany to avoid duplicate key errors if run multiple times
    await Interview.updateOrCreateMany('id', interviews)
  }
}