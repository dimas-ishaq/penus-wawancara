import Interview from '#models/interview'
import Major from '#models/major'
import type { HttpContext } from '@adonisjs/core/http'
import { utils, write } from 'xlsx'
import { DateTime } from 'luxon'
import AuditLog from '#models/audit_log'
import { updateRecapValidator } from '#validators/interview'

export default class InterviewsController {
  async index({ inertia, request }: HttpContext) {
    const page = request.input('page', 1)
    const perPage = request.input('perPage', 20)
    const search = request.input('search', '')?.toLowerCase()

    const status = request.input('status')
    const startDate = request.input('startDate')
    const endDate = request.input('endDate')

    let query = Interview.query()

    if (search) {
      query = query.where((q) => {
        q.whereRaw('LOWER(student_name) LIKE ?', [`%${search}%`])
          .orWhereRaw('LOWER(school_origin) LIKE ?', [`%${search}%`])
          .orWhere('id', 'like', `%${search}%`)
      })
    }

    if (status) {
      query = query.where('status', status)
    }

    if (startDate) {
      query = query.where('interviewDate', '>=', startDate)
    }

    if (endDate) {
      query = query.where('interviewDate', '<=', endDate)
    }

    const interviews = await query
      .orderBy('createdAt', 'desc')
      .orderBy('id', 'asc')
      .paginate(page, perPage)

    interviews.baseUrl('/admin/interviews').queryString(request.qs())
    return inertia.render('admin/interviews', {
      interviews: interviews.serialize(),
      search,
    })
  }

  async create({ inertia }: HttpContext) {
    return inertia.render('admin/interviews/create', {})
  }

  async export({ request, response }: HttpContext) {
    const { startDate, endDate } = request.qs()

    let query = Interview.query()

    if (startDate) {
      query = query.where('created_at', '>=', DateTime.fromISO(startDate).startOf('day').toFormat('yyyy-MM-dd HH:mm:ss'))
    }
    if (endDate) {
      query = query.where('created_at', '<=', DateTime.fromISO(endDate).endOf('day').toFormat('yyyy-MM-dd HH:mm:ss'))
    }

    const data = await query.orderBy('createdAt', 'desc')

    // Fetch all majors to map code to full name for export
    const majors = await Major.all()
    const majorMap = new Map(majors.map((m) => [m.code, m.name]))

    const worksheetData = data.map((i) => {
      // Map major abbreviation to full name if exists
      let fullMajor = i.majorChoice
      if (i.majorChoice && majorMap.has(i.majorChoice)) {
        fullMajor = `${i.majorChoice} - ${majorMap.get(i.majorChoice)}`
      }

      return {
        'ID Pendaftaran': i.id,
        'Nama Siswa': i.studentName,
        'Asal Sekolah': i.schoolOrigin,
        'Status': i.status,
        'Pewawancara': i.interviewer || '-',
        'Pendamping': i.accompaniment || '-',
        'Sumber Informasi': i.infoSource || '-',
        'Alasan Sekolah': i.reasonChoosingSchool || '-',
        'Jurusan': fullMajor || '-',
        'Alasan Jurusan': i.majorReason || '-',
        'Cita-cita': i.longTermGoals || '-',
        'Tinggal Dengan': i.livingWith || '-',
        'Kontak Darurat': i.emergencyContact || '-',
        'HP Kontak Darurat': i.emergencyContactPhone || '-',

        // Section II: Karakter
        'Jarak Rumah (km)': i.characterAnswers?.homeDistance || '-',
        'Metode Berangkat': i.characterAnswers?.travelMethod || '-',
        'Komitmen 06.45': i.characterAnswers?.arrival645Commitment ? 'Y' : 'T',
        'Komitmen Kendaraan': i.characterAnswers?.vehicleCommitment ? 'Y' : 'T',
        'Komitmen Kehadiran': i.characterAnswers?.presenceCommitment ? 'Y' : 'T',
        'Komitmen Alfa': i.characterAnswers?.alfaCommitment ? 'Y' : 'T',
        'Komitmen Disiplin': i.characterAnswers?.disciplineCommitment ? 'Y' : 'T',
        'Komitmen Kebersihan': i.characterAnswers?.cleanlinessCommitment ? 'Y' : 'T',
        'Komitmen Seluruh Kegiatan': i.characterAnswers?.allActivityCommitment ? 'Y' : 'T',

        // Section III-V: Softskill, Entrepreneur, Religious
        'Komitmen Softskill/Hardskill': i.skillCommitment ? 'Y' : 'T',
        'Komitmen Entrepreneur': i.entrepreneurCommitment ? 'Y' : 'T',
        'Komitmen Religious': i.religiousCommitment ? 'Y' : 'T',
        'Alasan Kesanggupan Kegiatan': i.specialActivities || '-',

        // Section VII: Pelanggaran
        'Setuju Aturan Pelanggaran': i.violationAgreement ? 'Y' : 'T',
        'Pelanggaran - Tauran': i.violationDetails?.tauran ? 'Y' : 'T',
        'Pelanggaran - Asusila': i.violationDetails?.asusila ? 'Y' : 'T',
        'Pelanggaran - Narkoba': i.violationDetails?.narkoba ? 'Y' : 'T',
        'Pelanggaran - Kriminal': i.violationDetails?.kriminal ? 'Y' : 'T',
        'Pelanggaran - Bullying': i.violationDetails?.bullying ? 'Y' : 'T',
        'Pelanggaran - Kekerasan Guru': i.violationDetails?.kekerasanGuru ? 'Y' : 'T',
        'Pelanggaran - Menikah': i.violationDetails?.menikah ? 'Y' : 'T',

        // Section VIII: Orang Tua
        'Ortu - Dukung Program': i.parentCommitments?.fullSupport ? 'Y' : 'T',
        'Ortu - Laptop': i.parentCommitments?.laptopProvision ? 'Y' : 'T',
        'Ortu - PKL Jauh': i.parentCommitments?.pklConsent ? 'Y' : 'T',
        'Ortu - Periksa Device': i.parentCommitments?.deviceCheckConsent ? 'Y' : 'T',
        'Ortu - Hubungan Baik': i.parentCommitments?.relationshipCommitment ? 'Y' : 'T',
        'Ortu - Keuangan': i.parentCommitments?.financialCommitment ? 'Y' : 'T',

        // Billing Details
        'Nama Penanggung Jawab': i.billingDetails?.name || '-',
        'Hubungan Penanggung Jawab': i.billingDetails?.relationship || '-',
        'Pekerjaan Penanggung Jawab': i.billingDetails?.job || '-',
        'HP Penanggung Jawab': i.billingDetails?.phone || '-',
        'Sumber Biaya Lain': i.billingDetails?.otherSource || '-',

        'Catatan': i.notes || '-',
        'Tanggal Wawancara': i.interviewDate ? i.interviewDate.toFormat('yyyy-MM-dd') : '-',
        'Tanggal Input': i.createdAt?.toFormat('yyyy-MM-dd HH:mm'),
      }
    })

    const ws = utils.json_to_sheet(worksheetData)
    const wb = utils.book_new()
    utils.book_append_sheet(wb, ws, 'Data Wawancara')

    const buf = write(wb, { type: 'buffer', bookType: 'xlsx' })

    response.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    response.header('Content-Disposition', `attachment; filename=interviews_${DateTime.local().toFormat('yyyy-MM-dd')}.xlsx`)
    return response.send(buf)
  }

  async store({ request, response, auth }: HttpContext) {
    const user = auth.user!
    const data = request.only(['studentName', 'schoolOrigin'])
    
    // Capitalize names
    const capitalize = (str: string) => str.replace(/\b\w/g, (l) => l.toUpperCase())
    const studentName = capitalize(data.studentName.toLowerCase())
    const schoolOrigin = capitalize(data.schoolOrigin.toLowerCase())
    
    // Generate simple ID PPDB-XXX
    const countData = await Interview.query().count('* as total')
    const total = (countData[0] as any).$extras.total
    const nextId = `PPDB-${String(total + 1).padStart(3, '0')}`

    const interview = await Interview.create({
      id: nextId,
      studentName,
      schoolOrigin,
      status: 'Pending',
      userId: user.id
    })

    await AuditLog.log(user.id, 'created', 'interview', interview.id, `Membuat data wawancara untuk ${interview.studentName}`)

    return response.redirect().toRoute('admin.interviews')
  }

  async editRecap({ inertia, params }: HttpContext) {
    let query = Interview.query().where('id', params.id)

    const interview = await query.firstOrFail()
    const majors = await Major.query().orderBy('name', 'asc')
    
    return inertia.render('admin/interviews/recap', {
      interview: interview.serialize(),
      majors: majors.map(m => m.serialize())
    })
  }

  async updateRecap({ request, response, params, auth }: HttpContext) {
    const user = auth.user!
    let query = Interview.query().where('id', params.id)
    
    const interview = await query.firstOrFail()
    const data = await request.validateUsing(updateRecapValidator)
    const capitalize = (str: string) => str.replace(/\b\w/g, (l) => l.toUpperCase())

    interview.merge({
      interviewDate: data.interviewDate ? DateTime.fromISO(data.interviewDate) : null,
      accompaniment: data.accompaniment ? capitalize(data.accompaniment.toLowerCase()) : null,
      interviewer: user.fullName || user.email, // Automatically set based on logged-in user
      infoSource: data.infoSource,
      reasonChoosingSchool: data.reasonChoosingSchool,
      majorChoice: data.selectedMajor,
      majorReason: data.majorReason,
      longTermGoals: data.longTermGoals,
      characterAnswers: data.characterAnswers,
      specialActivities: data.specialActivities,
      violationAgreement: data.violationAgreement,
      parentCommitments: data.parentCommitments,
      skillCommitment: data.skillCommitment,
      entrepreneurCommitment: data.entrepreneurCommitment,
      religiousCommitment: data.religiousCommitment,
      violationDetails: data.violationDetails,
      livingWith: data.livingWith,
      emergencyContact: data.emergencyContact,
      emergencyContactPhone: data.emergencyContactPhone,
      billingDetails: data.billingDetails,
      status: 'Done',
    })

    await interview.save()
    await AuditLog.log(user.id, 'updated', 'interview', interview.id, `Melakukan rekap/update data wawancara untuk ${interview.studentName}`)
    return response.redirect().toRoute('admin.interviews')
  }

  async pdf({ params, view }: HttpContext) {
    let query = Interview.query().where('id', params.id)

    const interview = await query.firstOrFail()
    
    // Fetch all majors to map code to full name
    const Major = (await import('#models/major')).default
    const majors = await Major.all()
    const majorMap = new Map(majors.map(m => [m.code, m.name]))
    
    const serializedInterview = interview.serialize()
    
    // Map abbreviation to full name if exists
    if (serializedInterview.majorChoice && majorMap.has(serializedInterview.majorChoice)) {
      serializedInterview.majorName = majorMap.get(serializedInterview.majorChoice)
    } else {
      serializedInterview.majorName = serializedInterview.majorChoice
    }

    // Handle infoSource "Lainnya"
    if (serializedInterview.infoSource === 'Lainnya' && serializedInterview.infoSourceOther) {
      serializedInterview.infoSource = `Lainnya (${serializedInterview.infoSourceOther})`
    }

    // Fetch branding logo
    const Setting = (await import('#models/setting')).default
    const logo = await Setting.get('logo_path')

    return view.render('admin/interview_report', {
      interview: serializedInterview,
      logo: logo
    })
  }

  async destroy({ params, response, auth, session }: HttpContext) {
    const user = auth.user!
    let query = Interview.query().where('id', params.id)

    const interview = await query.firstOrFail()
    await interview.delete()
    await AuditLog.log(user.id, 'deleted', 'interview', interview.id, `Menghapus data wawancara ${interview.studentName}`)

    session.flash('success', `Data wawancara ${interview.studentName} berhasil dihapus`)
    return response.redirect().back()
  }

  async importInterviews({ request, response, auth, session }: HttpContext) {
    const user = auth.user!
    const studentsData = request.input('students') as any[]
    
    // Get current count to start incrementing IDs
    const countData = await Interview.query().count('* as total')
    let currentTotal = Number((countData[0] as any).$extras.total)

    const createdInterviews = []
    const capitalize = (str: string) => str.replace(/\b\w/g, (l) => l.toUpperCase())
    
    for (const data of studentsData) {
      const studentName = capitalize(data.studentName.trim().toLowerCase())
      const schoolOrigin = capitalize(data.schoolOrigin.trim().toLowerCase())

      // Check if student with same name and school already exists to avoid duplicates
      const existing = await Interview.query()
        .where('studentName', studentName)
        .where('schoolOrigin', schoolOrigin)
        .first()
        
      if (existing) continue

      currentTotal++
      const nextId = data.id || `PPDB-${String(currentTotal).padStart(3, '0')}`

      const interview = await Interview.create({
        id: nextId,
        studentName,
        schoolOrigin,
        status: 'Pending',
        userId: user.id
      })
      
      createdInterviews.push(interview)
    }

    if (createdInterviews.length > 0) {
      await AuditLog.log(user.id, 'imported', 'interview', 'bulk', `Mengimpor ${createdInterviews.length} data wawancara`)
    }

    session.flash('success', `Berhasil mengimpor ${createdInterviews.length} data wawancara`)
    return response.redirect().back()
  }
}
