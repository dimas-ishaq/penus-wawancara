import { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import AuditLog from '#models/audit_log'

export default class ProfileController {
  /**
   * Show profile page
   */
  async index({ inertia, auth }: HttpContext) {
    const user = auth.user!
    return inertia.render('admin/profile', {
      user: {
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    })
  }

  /**
   * Update profile
   */
  async update({ request, response, auth, session }: HttpContext) {
    const user = auth.user!
    
    const validator = vine.compile(
      vine.object({
        fullName: vine.string().minLength(3),
        password: vine.string().minLength(8).confirmed().optional(),
      })
    )

    const payload = await request.validateUsing(validator)
    
    if (!payload.password) {
      delete payload.password
    }

    user.merge(payload)
    await user.save()

    await AuditLog.log(user.id, 'updated', 'profile', String(user.id), 'Memperbarui profil mandiri')

    session.flash('success', 'Profil berhasil diperbarui')
    return response.redirect().back()
  }
}
