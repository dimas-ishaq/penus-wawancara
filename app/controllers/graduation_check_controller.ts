import { HttpContext } from '@adonisjs/core/http'
import Student from '#models/student'
import Setting from '#models/setting'

export default class GraduationCheckController {
  async check({ request, response }: HttpContext) {
    const nisn = request.input('nisn')

    const announcementDateStr = await Setting.get('graduation_announcement_at')
    if (announcementDateStr) {
      const { DateTime } = await import('luxon')
      
      // Parse target date as Asia/Jakarta
      const announcementDate = DateTime.fromISO(announcementDateStr, { zone: 'Asia/Jakarta' })
      // Get current time in Asia/Jakarta
      const now = DateTime.now().setZone('Asia/Jakarta')

      if (now < announcementDate) {
        return response.status(403).json({ 
          error: 'Pengumuman belum dirilis secara resmi.' 
        })
      }
    }

    if (!nisn) {
      return response.status(400).json({ error: 'NIS harus diisi.' })
    }

    const student = await Student.findBy('nisn', nisn)
    
    if (!student) {
      return response.status(404).json({ 
        error: 'Data siswa tidak ditemukan. Pastikan NIS yang Anda masukkan benar.' 
      })
    }

    // Fetch major name
    const { default: Major } = await import('#models/major')
    const major = await Major.findBy('code', student.majorCode)

    // Fetch Letter Settings
    const letter = {
      foundation: await Setting.get('letter_foundation', 'Yayasan Pelita Nusantara'),
      schoolName: await Setting.get('letter_school_name', 'SMK Plus Pelita Nusantara'),
      address: await Setting.get('letter_address', 'Jl. Raya Purwakarta - Cimahi, Jawa Barat'),
      phone: await Setting.get('letter_phone', '(022) 6670123'),
      email: await Setting.get('letter_email', 'info@smkpluspelnusa.sch.id'),
      website: await Setting.get('letter_website', 'www.smkpluspelnusa.sch.id'),
      subject: await Setting.get('letter_subject', 'Pemberitahuan Kelulusan'),
      city: await Setting.get('letter_city', 'Cimahi'),
      date: await Setting.get('letter_date', '15 Juli 2026'),
      principalName: await Setting.get('principal_name', 'Nama Kepala Sekolah, M.Pd.'),
      principalNip: await Setting.get('principal_nip', '19880210 201503 1 002'),
      numberFormat: await Setting.get('letter_number_format', '{nisn}/SMKP/{year}/2026'),
    }

    return response.json({
      name: student.name,
      nisn: student.nisn,
      class: student.class,
      majorName: major ? major.name : (student.majorCode || '-'),
      status: student.status,
      letter,
      academicYear: announcementDateStr ? new Date(announcementDateStr).getFullYear() : 2026
    })
  }
}
