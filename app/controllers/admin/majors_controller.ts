import { HttpContext } from '@adonisjs/core/http'
import Major from '#models/major'

export default class MajorsController {
  async index({ inertia }: HttpContext) {
    const majors = await Major.all()
    return inertia.render('admin/majors', {
      majors: majors.map(m => ({
        id: m.id,
        name: m.name,
        code: m.code
      }))
    })
  }

  async store({ request, response, session }: HttpContext) {
    const data = request.only(['name', 'code'])
    await Major.create(data)

    session.flash('success', 'Jurusan berhasil ditambahkan')
    return response.redirect().back()
  }

  async update({ params, request, response, session, auth }: HttpContext) {
    const major = await Major.findOrFail(params.id)
    const oldCode = major.code
    const data = request.only(['name', 'code'])
    
    major.merge(data)
    await major.save()

    // Database Synchronization Logic
    if (data.code && data.code !== oldCode) {
      const Interview = (await import('#models/interview')).default
      const Student = (await import('#models/student')).default
      const AuditLog = (await import('#models/audit_log')).default
      
      // Update Interviews
      const updatedInterviews = await Interview.query()
        .where('majorChoice', oldCode)
        .update({ majorChoice: data.code })
      
      // Update Students
      const updatedStudents = await Student.query()
        .where('majorCode', oldCode)
        .update({ majorCode: data.code })
      
      if (auth.user) {
        await AuditLog.log(
          auth.user.id, 
          'synchronized', 
          'major', 
          String(major.id), 
          `Sinkronisasi kode jurusan dari ${oldCode} ke ${data.code} (${updatedInterviews} wawancara, ${updatedStudents} siswa diperbarui)`
        )
      }
    }

    session.flash('success', 'Data jurusan berhasil diperbarui dan disinkronkan')
    return response.redirect().back()
  }

  async destroy({ params, response, session }: HttpContext) {
    const major = await Major.findOrFail(params.id)
    await major.delete()

    session.flash('success', 'Jurusan berhasil dihapus')
    return response.redirect().back()
  }
}
