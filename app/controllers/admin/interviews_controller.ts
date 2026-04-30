import User from '#models/user'
import Interview from '#models/interview'
import Major from '#models/major'
import type { HttpContext } from '@adonisjs/core/http'
import { utils, write } from 'xlsx'
import { DateTime } from 'luxon'
import AuditLog from '#models/audit_log'
import { createInterviewValidator, updateRecapValidator } from '#validators/interview'

export default class InterviewsController {
  async index({ inertia, request, auth }: HttpContext) {
    const user = auth.user!
    const { startDate, endDate, status, search, major } = request.qs()
    let interviewer = request.qs().interviewer

    // If user is staff, they can only see their own interviews
    const isStaff = user.role === 'staff'
    // Default interviewer is now null (All) as requested

    const interviewersQuery = User.query()
      .whereNotNull('fullName')
      .orderBy('fullName', 'asc')
    
    if (isStaff) {
      interviewersQuery.where('id', user.id)
    }
    
    const staffUsers = await interviewersQuery
    const interviewersList = [...new Set(staffUsers.map((u) => u.fullName!).filter(Boolean))]

    let query = Interview.query()

    if (search) {
      const lowerSearch = search.toLowerCase()
      query = query.where((q) => {
        q.whereRaw('LOWER(student_name) LIKE ?', [`%${lowerSearch}%`])
          .orWhereRaw('LOWER(school_origin) LIKE ?', [`%${lowerSearch}%`])
          .orWhere('id', 'like', `%${lowerSearch}%`)
      })
    }

    if (status) {
      query = query.where('status', status)
    }

    if (interviewer) {
      query = query.where('interviewer', interviewer)
    }

    if (major) {
      query = query.where('majorChoice', major)
    }

    if (startDate) {
      query = query.where('interviewDate', '>=', startDate)
    }

    if (endDate) {
      query = query.where('interviewDate', '<=', endDate)
    }

    const page = request.input('page', 1)
    const perPage = request.input('perPage', 20)

    const interviews = await query
      .orderBy('createdAt', 'desc')
      .orderBy('id', 'asc')
      .paginate(page, perPage)

    interviews.baseUrl('/admin/interviews').queryString(request.qs())
    const majors = await Major.query().orderBy('name', 'asc')
    return inertia.render('admin/interviews', {
      interviews: interviews.serialize(),
      search,
      interviewers: interviewersList,
      majors: majors.map((m) => m.serialize()),
      filters: {
        status,
        interviewer,
        startDate,
        endDate,
        major,
      },
      isStaff,
    })
  }

  async create({ inertia }: HttpContext) {
    return inertia.render('admin/interviews/create', {})
  }

  async export({ request, response }: HttpContext) {
    const { startDate, endDate, status, search, major } = request.qs()
    let interviewer = request.qs().interviewer

    // If user is staff, they can only see their own interviews
    // Default interviewer is now null (All) as requested

    let query = Interview.query()

    if (search) {
      const lowerSearch = search.toLowerCase()
      query = query.where((q) => {
        q.whereRaw('LOWER(student_name) LIKE ?', [`%${lowerSearch}%`])
          .orWhereRaw('LOWER(school_origin) LIKE ?', [`%${lowerSearch}%`])
          .orWhere('id', 'like', `%${lowerSearch}%`)
      })
    }

    if (status) {
      query = query.where('status', status)
    }

    if (interviewer) {
      query = query.where('interviewer', interviewer)
    }

    if (major) {
      query = query.where('majorChoice', major)
    }

    if (startDate) {
      query = query.where('interviewDate', '>=', startDate)
    }

    if (endDate) {
      query = query.where('interviewDate', '<=', endDate)
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
        // --- PROFIL SISWA ---
        'ID Pendaftaran': i.id,
        'Nama Siswa': i.studentName,
        'Asal Sekolah': i.schoolOrigin,
        'Status': i.status,
        'Pewawancara': i.interviewer || '-',
        'Pendamping': i.accompaniment || '-',
        'Tanggal Wawancara': i.interviewDate ? i.interviewDate.toFormat('yyyy-MM-dd') : '-',

        // --- I. IDENTITAS & ASPIRASI ---
        'Sumber Informasi': i.infoSource || '-',
        'Alasan Pilih Sekolah': i.reasonChoosingSchool || '-',
        'Pilihan Jurusan': fullMajor || '-',
        'Alasan Pilih Jurusan': i.majorReason || '-',
        'Cita-cita / Harapan': i.longTermGoals || '-',

        // --- II. KARAKTER & DISIPLIN ---
        'Jarak Rumah (km)': i.characterAnswers?.homeDistance || '-',
        'Metode Berangkat': i.characterAnswers?.travelMethod || '-',
        'Sanggup Hadir 06.45': i.characterAnswers?.arrival645Commitment ? 'Y' : 'T',
        'Sanggup Kendaraan Standar': i.characterAnswers?.vehicleCommitment ? 'Y' : 'T',
        'Sanggup Hadir Senin-Sabtu': i.characterAnswers?.presenceCommitment ? 'Y' : 'T',
        'Siap Bila Alfa > 7': i.characterAnswers?.alfaCommitment ? 'Y' : 'T',
        'Siap Jalankan Disiplin': i.characterAnswers?.disciplineCommitment ? 'Y' : 'T',
        'Siap Jaga Kebersihan': i.characterAnswers?.cleanlinessCommitment ? 'Y' : 'T',
        'Aktif Seluruh Kegiatan': i.characterAnswers?.allActivityCommitment ? 'Y' : 'T',

        // --- III-V. KOMITMEN KURIKULUM ---
        'Siap Softskill/Hardskill': i.skillCommitment ? 'Y' : 'T',
        'Siap Entrepreneurship': i.entrepreneurCommitment ? 'Y' : 'T',
        'Siap Religious Program': i.religiousCommitment ? 'Y' : 'T',
        'Alasan Kesanggupan Kurikulum': i.specialActivities || '-',

        // --- VII. PELANGGARAN LUAR BIASA ---
        'Setuju Konsekuensi Pelanggaran': i.violationAgreement ? 'Y' : 'T',
        'Pelanggaran - Tauran': i.violationDetails?.tauran ? 'Y' : 'T',
        'Pelanggaran - Asusila': i.violationDetails?.asusila ? 'Y' : 'T',
        'Pelanggaran - Narkoba': i.violationDetails?.narkoba ? 'Y' : 'T',
        'Pelanggaran - Kriminal': i.violationDetails?.kriminal ? 'Y' : 'T',
        'Pelanggaran - Bullying': i.violationDetails?.bullying ? 'Y' : 'T',
        'Pelanggaran - Kekerasan Guru': i.violationDetails?.kekerasanGuru ? 'Y' : 'T',
        'Pelanggaran - Menikah': i.violationDetails?.menikah ? 'Y' : 'T',

        // --- VIII. ORANG TUA & PEMBIAYAAN ---
        'Dukung Program Sekolah': i.parentCommitments?.fullSupport ? 'Y' : 'T',
        'Sanggup Sediakan Laptop': i.parentCommitments?.laptopProvision ? 'Y' : 'T',
        'Setuju PKL Jauh': i.parentCommitments?.pklConsent ? 'Y' : 'T',
        'Setuju Periksa Device': i.parentCommitments?.deviceCheckConsent ? 'Y' : 'T',
        'Hubungan Baik dg Sekolah': i.parentCommitments?.relationshipCommitment ? 'Y' : 'T',
        'Tinggal Bersama': i.livingWith || '-',
        'Kontak Darurat': i.emergencyContact || '-',
        'No. HP Darurat': i.emergencyContactPhone || '-',
        'Sanggup Biaya s/d Lulus': i.parentCommitments?.financialCommitment ? 'Y' : 'T',

        // --- DATA PENANGGUNG JAWAB ---
        'Nama Penanggung Jawab': i.billingDetails?.name || '-',
        'Hubungan Keluarga': i.billingDetails?.relationship || '-',
        'Pekerjaan': i.billingDetails?.job || '-',
        'No. Telp/WA': i.billingDetails?.phone || '-',
        'Sumber Dana Lain': i.billingDetails?.otherSource || '-',

        // --- PENILAIAN & CATATAN ---
        'Skor Akademik': i.academicScore || 0,
        'Skor Teknis': i.technicalScore || 0,
        'Skor Sikap': i.attitudeScore || 0,
        'Total Skor': i.totalScore || 0,
        'Catatan Pewawancara': i.notes || '-',
        'Waktu Input Laporan': i.createdAt?.toFormat('yyyy-MM-dd HH:mm'),
      }
    })

    const ws = utils.json_to_sheet(worksheetData)
    const wb = utils.book_new()
    utils.book_append_sheet(wb, ws, 'Data Wawancara')

    const buf = write(wb, { type: 'buffer', bookType: 'xlsx' })
    
    const clientTime = request.input('clientTime')
    const fileNameDate = clientTime 
      ? DateTime.fromISO(clientTime).toFormat('dd-MM-yyyy_HH-mm-ss')
      : DateTime.local().toFormat('dd-MM-yyyy_HH-mm-ss')

    response.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    response.header('Content-Disposition', `attachment; filename=interviews_${fileNameDate}.xlsx`)
    return response.send(buf)
  }

  async store({ request, response, auth }: HttpContext) {
    const user = auth.user!
    const data = await createInterviewValidator.validate(request.all())
    
    // Capitalize names
    const capitalize = (str: string) => str.replace(/\b\w/g, (l) => l.toUpperCase())
    const studentName = capitalize(data.studentName.toLowerCase())
    const schoolOrigin = capitalize(data.schoolOrigin.toLowerCase())
    
    // Generate simple ID PPDB-XXX
    const countData = await Interview.query().count('* as total')
    const total = Number((countData[0] as any).$extras.total || 0)
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
    const data = await updateRecapValidator.validate(request.all())
    const capitalize = (str: string) => str.replace(/\b\w/g, (l) => l.toUpperCase())

    interview.merge({
      studentName: capitalize(data.studentName.toLowerCase()),
      schoolOrigin: capitalize(data.schoolOrigin.toLowerCase()),
      interviewDate: data.interviewDate ? DateTime.fromISO(data.interviewDate) : null,
      accompaniment: data.accompaniment ? capitalize(data.accompaniment.toLowerCase()) : null,
      interviewer: data.interviewer,
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
      academicScore: data.academicScore || 0,
      technicalScore: data.technicalScore || 0,
      attitudeScore: data.attitudeScore || 0,
      totalScore: (data.academicScore || 0) + (data.technicalScore || 0) + (data.attitudeScore || 0),
      status: 'Done',
    })

    await interview.save()
    await AuditLog.log(user.id, 'updated', 'interview', interview.id, `Melakukan rekap/update data wawancara untuk ${interview.studentName}`)
    return response.redirect().toRoute('admin.interviews')
  }

  async reset({ response, params, auth }: HttpContext) {
    const user = auth.user!
    let query = Interview.query().where('id', params.id)

    const interview = await query.firstOrFail()

    interview.merge({
      interviewDate: null,
      accompaniment: null,
      interviewer: null,
      infoSource: null,
      infoSourceOther: null,
      reasonChoosingSchool: null,
      majorChoice: null,
      majorReason: null,
      longTermGoals: null,
      characterAnswers: null,
      skillCommitment: false,
      entrepreneurCommitment: false,
      religiousCommitment: false,
      violationAgreement: false,
      parentCommitments: null,
      livingWith: null,
      emergencyContact: null,
      emergencyContactPhone: null,
      billingDetails: null,
      violationDetails: null,
      notes: null,
      status: 'Pending',
      academicScore: 0,
      technicalScore: 0,
      attitudeScore: 0,
      totalScore: 0,
    })

    await interview.save()
    await AuditLog.log(user.id, 'reset', 'interview', interview.id, `Mereset data wawancara untuk ${interview.studentName}`)
    
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

    // Fetch branding settings
    const Setting = (await import('#models/setting')).default
    const logo = (await Setting.get('logo_path')) || '/assets/logo_penus.png'
    const academicYear = await Setting.get('academic_year', '2024/2025')
    const brandName = await Setting.get('brand_name', 'SMK PLUS PELITA NUSANTARA')
    const kopSuratPath = await Setting.get('kop_surat_path')
    
    let kopSuratBase64 = null
    if (kopSuratPath) {
      try {
        const fs = await import('node:fs/promises')
        const { extname } = await import('node:path')
        const imageBuffer = await fs.readFile(kopSuratPath)
        const extension = extname(kopSuratPath).replace('.', '')
        kopSuratBase64 = `data:image/${extension};base64,${imageBuffer.toString('base64')}`
      } catch (error) {
        // Ignore if file error
      }
    }

    return view.render('admin/interview_report', {
      interview: serializedInterview,
      logo: logo,
      kopSurat: kopSuratBase64,
      academicYear: academicYear,
      brandName: brandName
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
