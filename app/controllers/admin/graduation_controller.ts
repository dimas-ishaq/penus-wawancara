import { HttpContext } from '@adonisjs/core/http'
import Setting from '#models/setting'
import Student from '#models/student'

export default class GraduationController {
  async index({ inertia, auth }: HttpContext) {
    const user = auth.user!
    const announcementDate = await Setting.get('graduation_announcement_at')
    
    let query = Student.query()
    // Admin only sees their own students
    if (user.role !== 'super_admin') {
      query = query.where('userId', user.id)
    }
    
    const students = await query
    
    return inertia.render('admin/graduation', {
      announcementDate: announcementDate || undefined,
      students: students.map(s => ({
        id: s.id,
        nisn: s.nisn,
        name: s.name,
        class: s.class,
        majorCode: s.majorCode,
        status: s.status
      }))
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
    
    for (const data of studentsData) {
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
          name: data.name,
          class: data.class,
          majorCode: data.majorCode || data.jurusan || null,
          status: data.status || 'Pending',
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
