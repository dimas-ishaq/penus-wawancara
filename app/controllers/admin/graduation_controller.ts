import { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import Setting from '#models/setting'
import Student from '#models/student'

export default class GraduationController {
  async index({ inertia, auth, request }: HttpContext) {
    const user = auth.user!
    const page = request.input('page', 1)
    const search = request.input('search', '')?.toLowerCase()
    const perPage = 20
    
    let query = Student.query()
    if (user.role !== 'super_admin') {
      query = query.where('userId', user.id)
    }

    if (search) {
      query = query.where((q) => {
        q.whereRaw('LOWER(name) LIKE ?', [`%${search}%`])
          .orWhereRaw('LOWER(nisn) LIKE ?', [`%${search}%`])
          .orWhereRaw('LOWER(class) LIKE ?', [`%${search}%`])
      })
    }

    const students = await query
      .orderBy('name', 'asc')
      .paginate(page, perPage)

    students.baseUrl('/admin/graduation').queryString(request.qs())
    
    // Fetch stats for the whole ownership scope (ignoring search/pagination)
    let statsQuery = Student.query()
    if (user.role !== 'super_admin') {
      statsQuery = statsQuery.where('userId', user.id)
    }
    const totalCount = await statsQuery.clone().count('* as total')
    const lulusCount = await statsQuery.clone().where('status', 'Lulus').count('* as total')
    const tidakLulusCount = await statsQuery.clone().where('status', 'Tidak lulus').count('* as total')

    // Fetch unique classes for the filter dropdown (from existing students)
    const classesData = await statsQuery.clone().distinct('class').orderBy('class', 'asc')
    const uniqueClasses = ['all', ...classesData.map(c => c.class)].filter(Boolean)

    // Fetch ALL classes and majors for the "Add Student" form
    const Class = (await import('#models/class')).default
    const Major = (await import('#models/major')).default
    const allClasses = await Class.query().orderBy('name', 'asc')
    const allMajors = await Major.query().orderBy('name', 'asc')

    return inertia.render('admin/graduation', {
      students: students.serialize(),
      search,
      uniqueClasses,
      allClasses: allClasses.map(c => c.serialize()),
      allMajors: allMajors.map(m => m.serialize()),
      stats: {
        total: (totalCount[0] as any).$extras.total,
        lulus: (lulusCount[0] as any).$extras.total,
        tidakLulus: (tidakLulusCount[0] as any).$extras.total,
      }
    })
  }

  async updateSettings({ request, response, session }: HttpContext) {
    const announcementAt = request.input('announcementAt')
    await Setting.set('graduation_announcement_at', announcementAt)
    
    session.flash('success', 'Pengaturan waktu pengumuman berhasil diperbarui')
    return response.redirect().back()
  }

  async store({ request, response, auth, session }: HttpContext) {
    const user = auth.user!
    const data = request.only(['nisn', 'name', 'class', 'majorCode', 'status'])
    
    // Check if nisn already exists
    const existing = await Student.findBy('nisn', data.nisn)
    if (existing) {
      session.flash('error', `Siswa dengan NISN ${data.nisn} sudah terdaftar`)
      return response.redirect().back()
    }

    const capitalize = (str: string) => str.replace(/\b\w/g, (l) => l.toUpperCase())
    const name = capitalize(data.name.trim().toLowerCase())

    await Student.create({
      nisn: String(data.nisn),
      name,
      class: data.class,
      majorCode: data.majorCode || null,
      status: data.status || 'Pending',
      userId: user.id
    })

    session.flash('success', `Berhasil menambahkan siswa ${name}`)
    return response.redirect().back()
  }

  async updateStudentStatus({ params, request, response, session, auth }: HttpContext) {
    const user = auth.user!
    let query = Student.query().where('id', params.id)
    
    if (user.role !== 'super_admin') {
      query = query.where('userId', user.id)
    }

    const student = await query.firstOrFail()
    student.status = request.input('status')
    await student.save()

    session.flash('success', `Status ${student.name} berhasil diperbarui`)
    return response.redirect().back()
  }


  async importStudents({ request, response, session, auth }: HttpContext) {
    const user = auth.user!
    const studentsData = request.input('students') as any[]
    
    if (!studentsData || !Array.isArray(studentsData) || studentsData.length === 0) {
      session.flash('error', 'Data siswa tidak ditemukan atau format tidak valid')
      return response.redirect().back()
    }

    const capitalize = (str: string) => str.replace(/\b\w/g, (l) => l.toUpperCase())
    
    try {
      await db.transaction(async (trx) => {
        for (const data of studentsData) {
          if (!data.nisn || !data.name) continue

          const name = capitalize(data.name.trim().toLowerCase())
          
          // Find if exists to check ownership
          const existing = await Student.query({ client: trx }).where('nisn', String(data.nisn)).first()
          if (existing && user.role !== 'super_admin' && existing.userId !== user.id) {
            continue // Skip students owned by others
          }

          const status = (data.status || 'Pending').toString().toLowerCase().trim()
          const normalizedStatus = status === 'di tangguhkan' || status === 'ditangguhkan' || status === 'di tunda' ? 'Ditunda' : (data.status || 'Pending')

          await Student.updateOrCreate(
            { nisn: String(data.nisn) },
            {
              name,
              class: data.class || '',
              majorCode: data.majorCode || data.jurusan || null,
              status: normalizedStatus,
              userId: user.id
            },
            { client: trx }
          )
        }
      })

      session.flash('success', `Berhasil mengimpor ${studentsData.length} data siswa`)
    } catch (error) {
      console.error('Import Error:', error)
      session.flash('error', 'Gagal mengimpor data siswa. Terjadi kesalahan pada sistem.')
    }

    return response.redirect().back()
  }

  async update({ params, request, response, auth, session }: HttpContext) {
    const user = auth.user!
    const data = request.only(['nisn', 'name', 'class', 'majorCode', 'status'])
    
    let query = Student.query().where('id', params.id)
    if (user.role !== 'super_admin') {
      query = query.where('userId', user.id)
    }

    const student = await query.firstOrFail()
    
    // Check if nisn changed and if new nisn already exists
    if (data.nisn && String(data.nisn) !== student.nisn) {
      const existing = await Student.findBy('nisn', data.nisn)
      if (existing) {
        session.flash('error', `Siswa dengan NISN ${data.nisn} sudah terdaftar`)
        return response.redirect().back()
      }
    }

    const capitalize = (str: string) => str.replace(/\b\w/g, (l) => l.toUpperCase())
    const name = data.name ? capitalize(data.name.trim().toLowerCase()) : student.name

    student.merge({
      nisn: data.nisn ? String(data.nisn) : student.nisn,
      name,
      class: data.class || student.class,
      majorCode: data.majorCode || student.majorCode,
      status: data.status || student.status
    })
    
    await student.save()

    session.flash('success', `Berhasil memperbarui data siswa ${name}`)
    return response.redirect().back()
  }

  async destroy({ params, response, auth, session }: HttpContext) {
    const user = auth.user!
    let query = Student.query().where('id', params.id)

    if (user.role !== 'super_admin') {
      query = query.where('userId', user.id)
    }

    const student = await query.firstOrFail()
    await student.delete()

    session.flash('success', `Data siswa ${student.name} berhasil dihapus`)
    return response.redirect().back()
  }
}
