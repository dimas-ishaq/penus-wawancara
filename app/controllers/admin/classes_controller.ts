import { HttpContext } from '@adonisjs/core/http'
import Class from '#models/class'
import Major from '#models/major'
import AuditLog from '#models/audit_log'

export default class ClassesController {
  async index({ inertia }: HttpContext) {
    const classes = await Class.query().preload('major').orderBy('name', 'asc')
    const majors = await Major.query().orderBy('name', 'asc')

    return inertia.render('admin/classes', {
      classes: classes.map((c) => ({
        ...c.serialize(),
        majorName: c.major?.name || 'Unknown'
      })),
      majors: majors.map((m) => m.serialize())
    })
  }

  async store({ request, response, auth, session }: HttpContext) {
    const user = auth.user!
    const data = request.only(['name', 'majorId'])

    const cls = await Class.create({
      name: data.name,
      majorId: data.majorId
    })

    await AuditLog.log(user.id, 'created', 'class', String(cls.id), `Menambah kelas baru: ${cls.name}`)
    
    session.flash('success', `Kelas ${cls.name} berhasil ditambahkan`)
    return response.redirect().back()
  }

  async update({ request, response, params, auth, session }: HttpContext) {
    const user = auth.user!
    const data = request.only(['name', 'majorId'])
    
    const cls = await Class.findOrFail(params.id)
    cls.merge({
      name: data.name,
      majorId: data.majorId
    })
    await cls.save()

    await AuditLog.log(user.id, 'updated', 'class', String(cls.id), `Memperbarui data kelas: ${cls.name}`)

    session.flash('success', `Data kelas ${cls.name} berhasil diperbarui`)
    return response.redirect().back()
  }

  async destroy({ params, response, auth, session }: HttpContext) {
    const user = auth.user!
    const cls = await Class.findOrFail(params.id)
    const className = cls.name
    
    await cls.delete()
    await AuditLog.log(user.id, 'deleted', 'class', String(params.id), `Menghapus kelas: ${className}`)

    session.flash('success', `Kelas ${className} berhasil dihapus`)
    return response.redirect().back()
  }
}
