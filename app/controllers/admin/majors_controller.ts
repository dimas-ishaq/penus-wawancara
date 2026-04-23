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

  async update({ params, request, response, session }: HttpContext) {
    const major = await Major.findOrFail(params.id)
    const data = request.only(['name', 'code'])
    
    major.merge(data)
    await major.save()

    session.flash('success', 'Data jurusan berhasil diperbarui')
    return response.redirect().back()
  }

  async destroy({ params, response, session }: HttpContext) {
    const major = await Major.findOrFail(params.id)
    await major.delete()

    session.flash('success', 'Jurusan berhasil dihapus')
    return response.redirect().back()
  }
}
