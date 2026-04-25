import { HttpContext } from '@adonisjs/core/http'
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

    // Fetch unique classes for the filter dropdown
    const classesData = await statsQuery.clone().distinct('class').orderBy('class', 'asc')
    const uniqueClasses = ['all', ...classesData.map(c => c.class)].filter(Boolean)

    return inertia.render('admin/graduation', {
      students: students.serialize(),
      search,
      uniqueClasses,
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

  async batchUpdate({ request, response, session, auth }: HttpContext) {
    const user = auth.user!
    const status = request.input('status')
    
    let query = Student.query().where('status', 'Pending')
    if (user.role !== 'super_admin') {
      query = query.where('userId', user.id)
    }

    await query.update({ status })

    session.flash('success', `Berhasil memperbarui status masal menjadi ${status}`)
    return response.redirect().back()
  }

  async importStudents({ request, response, session, auth }: HttpContext) {
    const user = auth.user!
    const studentsData = request.input('students') as any[]
    const capitalize = (str: string) => str.replace(/\b\w/g, (l) => l.toUpperCase())
    
    for (const data of studentsData) {
      const name = capitalize(data.name.trim().toLowerCase())
      // Find if exists to check ownership before update if needed,
      // but usually updateOrCreate is fine as it uses uniq key (nisn).
      // If we want to prevent Admin A from hijacking Admin B's student via import:
      const existing = await Student.findBy('nisn', String(data.nisn))
      if (existing && user.role !== 'super_admin' && existing.userId !== user.id) {
        continue // Skip students owned by others
      }

      await Student.updateOrCreate(
        { nisn: String(data.nisn) },
        {
          name,
          class: data.class,
          majorCode: data.majorCode || data.jurusan || null,
          status: data.status || 'Pending',
          skl: data.skl || data.SKL || null,
          userId: user.id
        }
      )
    }

    session.flash('success', `Berhasil mengimpor ${studentsData.length} data siswa`)
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
