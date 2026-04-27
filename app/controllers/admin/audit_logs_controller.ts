import AuditLog from '#models/audit_log'
import type { HttpContext } from '@adonisjs/core/http'

export default class AuditLogsController {
  async index({ inertia, request }: HttpContext) {
    const page = request.input('page', 1)
    const perPage = 20

    const logs = await AuditLog.query()
      .preload('user')
      .orderBy('createdAt', 'desc')
      .paginate(page, perPage)

    logs.baseUrl('/admin/audit-logs').queryString(request.qs())

    return inertia.render('admin/audit_logs', {
      logs: {
        data: logs.all().map((log) => ({
          ...log.serialize(),
          user: log.user ? {
            fullName: log.user.fullName,
            email: log.user.email
          } : null
        })),
        meta: logs.serialize().meta,
      }
    })
  }

  async clear({ response, session, auth }: HttpContext) {
    const user = auth.user!
    await AuditLog.query().delete()
    
    // Log the clear action itself
    await AuditLog.log(user.id, 'deleted', 'audit_log', 'all', 'Membersihkan seluruh log aktivitas')
    
    session.flash('success', 'Seluruh log aktivitas berhasil dihapus')
    return response.redirect().back()
  }
}