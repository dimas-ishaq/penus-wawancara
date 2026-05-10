import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import AgreementDocumentService from '#services/agreement_document_service'
import Major from '#models/major'
// import AgreementDocumentExport from '#exports/agreement_document_export'

@inject()
export default class AgreementDocumentsController {
  constructor(protected service: AgreementDocumentService) {}

  async index({ inertia, request }: HttpContext) {
    const filters = request.qs()
    const interviews = await this.service.getInterviews(filters)
    const majors = await Major.query().orderBy('name', 'asc')

    return inertia.render('admin/agreement-documents/index', {
      interviews: interviews.map(i => i.serialize()),
      majors: majors.map(m => m.serialize()),
      filters: {
        search: filters.search || '',
        major: filters.major || 'all',
        status: filters.status || 'all'
      }
    })
  }

  async search({ request, response }: HttpContext) {
    const search = request.input('q', '')
    const interviews = await this.service.searchInterviews(search)
    return response.json(interviews.map(i => ({
      id: i.id,
      name: i.studentName,
      major: i.majorChoice
    })))
  }

  async add({ request, response, auth, session }: HttpContext) {
    const studentId = request.input('studentId')
    try {
      await this.service.addStudent(studentId, auth.user!.id)
      session.flash('success', 'Siswa berhasil ditambahkan ke manajemen surat perjanjian')
    } catch (error) {
      session.flash('error', 'Gagal menambahkan siswa')
    }
    return response.redirect().back()
  }

  async remove({ request, response, auth, session }: HttpContext) {
    const studentId = request.input('studentId')
    try {
      await this.service.removeStudent(studentId, auth.user!.id)
      session.flash('success', 'Siswa berhasil dihapus dari manajemen surat perjanjian')
    } catch (error) {
      session.flash('error', 'Gagal menghapus siswa')
    }
    return response.redirect().back()
  }

  async uploadParent({ request, response, auth, session }: HttpContext) {
    const studentId = request.input('studentId')
    const file = request.file('file', {
      size: '10mb',
      extnames: ['pdf', 'jpg', 'jpeg', 'png']
    })

    if (!file) {
      session.flash('error', 'Pilih file terlebih dahulu')
      return response.redirect().back()
    }

    if (!file.isValid) {
      session.flash('error', file.errors[0].message)
      return response.redirect().back()
    }

    try {
      await this.service.uploadParentAgreement(studentId, file, auth.user!.id)
      session.flash('success', 'Surat perjanjian orang tua berhasil diunggah')
    } catch (error) {
      session.flash('error', 'Gagal mengunggah surat perjanjian')
    }

    return response.redirect().back()
  }

  async uploadStudent({ request, response, auth, session }: HttpContext) {
    const studentId = request.input('studentId')
    const file = request.file('file', {
      size: '10mb',
      extnames: ['pdf', 'jpg', 'jpeg', 'png']
    })

    if (!file) {
      session.flash('error', 'Pilih file terlebih dahulu')
      return response.redirect().back()
    }

    if (!file.isValid) {
      session.flash('error', file.errors[0].message)
      return response.redirect().back()
    }

    try {
      await this.service.uploadStudentAgreement(studentId, file, auth.user!.id)
      session.flash('success', 'Surat perjanjian siswa berhasil diunggah')
    } catch (error) {
      session.flash('error', 'Gagal mengunggah surat perjanjian')
    }

    return response.redirect().back()
  }

  async deleteParent({ params, response, auth, session }: HttpContext) {
    try {
      await this.service.deleteParentAgreement(params.id, auth.user!.id)
      session.flash('success', 'Surat perjanjian orang tua berhasil dihapus')
    } catch (error) {
      session.flash('error', 'Gagal menghapus surat perjanjian')
    }

    return response.redirect().back()
  }

  async deleteStudent({ params, response, auth, session }: HttpContext) {
    try {
      await this.service.deleteStudentAgreement(params.id, auth.user!.id)
      session.flash('success', 'Surat perjanjian siswa berhasil dihapus')
    } catch (error) {
      session.flash('error', 'Gagal menghapus surat perjanjian')
    }

    return response.redirect().back()
  }

  async export({ request, response }: HttpContext) {
    const filters = request.qs()
    const interviews = await this.service.getInterviews(filters)
    const AgreementDocumentExport = (await import('#exports/agreement_document_export')).default
    return new AgreementDocumentExport(interviews).download(response)
  }
}
