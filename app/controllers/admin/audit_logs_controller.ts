import AuditLog from '#models/audit_log'
import type { HttpContext } from '@adonisjs/core/http'

export default class AuditLogsController {
  async index({ inertia, request }: HttpContext) {
    const search = request.input('search')
    const page = request.input('page', 1)
    const perPage = 20

    const query = AuditLog.query().preload('user')

    if (search) {
      query.where((q) => {
        q.where('action', 'like', `%${search}%`)
          .orWhere('details', 'like', `%${search}%`)
          .orWhere('resource', 'like', `%${search}%`)
          .orWhereHas('user', (userQuery) => {
            userQuery.where('fullName', 'like', `%${search}%`)
          })
      })
    }

    const logs = await query
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