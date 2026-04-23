import Interview from '#models/interview'
import Major from '#models/major'
import type { HttpContext } from '@adonisjs/core/http'
import { utils, write } from 'xlsx'
import { DateTime } from 'luxon'

export default class InterviewsController {
  async index({ inertia, auth }: HttpContext) {
    const user = auth.user!
    let query = Interview.query()

    if (user.role !== 'super_admin') {
      query = query.where('userId', user.id)
    }

    const interviews = await query.orderBy('createdAt', 'desc')
    return inertia.render('admin/interviews', {
      interviews: interviews.map((i) => i.serialize()),
    })
  }

  async create({ inertia }: HttpContext) {
    return inertia.render('admin/interviews/create', {})
  }

  async export({ request, response, auth }: HttpContext) {
    const user = auth.user!
    const { startDate, endDate } = request.qs()

    let query = Interview.query()

    if (user.role !== 'super_admin') {
      query = query.where('userId', user.id)
    }

    if (startDate) {
      query = query.where('created_at', '>=', DateTime.fromISO(startDate).startOf('day').toFormat('yyyy-MM-dd HH:mm:ss'))
    }
    if (endDate) {
      query = query.where('created_at', '<=', DateTime.fromISO(endDate).endOf('day').toFormat('yyyy-MM-dd HH:mm:ss'))
    }

    const data = await query.orderBy('createdAt', 'desc')

    const worksheetData = data.map((i) => ({
      'ID Pendaftaran': i.id,
      'Nama Siswa': i.studentName,
      'Asal Sekolah': i.schoolOrigin,
      'Status': i.status,
      'Catatan': i.notes,
      'Tanggal Pembuatan': i.createdAt?.toFormat('yyyy-MM-dd HH:mm'),
    }))

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
    
    // Generate simple ID PPDB-XXX
    const countData = await Interview.query().count('* as total')
    const total = (countData[0] as any).$extras.total
    const nextId = `PPDB-${String(total + 1).padStart(3, '0')}`

    await Interview.create({
      id: nextId,
      studentName: data.studentName,
      schoolOrigin: data.schoolOrigin,
      status: 'Pending',
      userId: user.id
    })

    return response.redirect().toRoute('admin.interviews')
  }

  async editRecap({ inertia, params, auth }: HttpContext) {
    const user = auth.user!
    let query = Interview.query().where('id', params.id)

    if (user.role !== 'super_admin') {
      query = query.where('userId', user.id)
    }

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
    
    if (user.role !== 'super_admin') {
      query = query.where('userId', user.id)
    }

    const interview = await query.firstOrFail()
    const data = request.all()

    interview.merge({
      interviewDate: data.interviewDate ? DateTime.fromISO(data.interviewDate) : null,
      accompaniment: data.accompaniment,
      interviewer: user.fullName || user.email, // Automatically set based on logged-in user
      infoSource: data.infoSource,
      reasonChoosingSchool: data.reasonChoosingSchool,
      majorChoice: data.majorChoice,
      longTermGoals: data.longTermGoals,
      characterAnswers: data.characterAnswers,
      specialActivities: data.specialActivities,
      violationAgreement: data.violationAgreement,
      parentCommitments: data.parentCommitments,
      livingWith: data.livingWith,
      emergencyContact: data.emergencyContact,
      billingDetails: data.billingDetails,
      status: 'Done',
    })

    await interview.save()
    return response.redirect().toRoute('admin.interviews')
  }

  async pdf({ params, view, auth }: HttpContext) {
    const user = auth.user!
    let query = Interview.query().where('id', params.id)

    if (user.role !== 'super_admin') {
      query = query.where('userId', user.id)
    }

    const interview = await query.firstOrFail()
    
    // Fetch branding logo
    const Setting = (await import('#models/setting')).default
    const logo = await Setting.get('logo_path')

    return view.render('admin/interview_report', {
      interview: interview.serialize(),
      logo: logo
    })
  }

  async destroy({ params, response, auth, session }: HttpContext) {
    const user = auth.user!
    let query = Interview.query().where('id', params.id)

    if (user.role !== 'super_admin') {
      query = query.where('userId', user.id)
    }

    const interview = await query.firstOrFail()
    await interview.delete()

    session.flash('success', `Data wawancara ${interview.studentName} berhasil dihapus`)
    return response.redirect().back()
  }
}
