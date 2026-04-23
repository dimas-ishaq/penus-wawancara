import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class RoleMiddleware {
  async handle(
    ctx: HttpContext,
    next: NextFn,
    options: {
      allowedRoles: string[]
    }
  ) {
    const user = ctx.auth.user

    if (!user || !options.allowedRoles.includes(user.role)) {
      ctx.session.flash('error', 'Anda tidak memiliki hak akses untuk halaman ini')
      return ctx.response.redirect('/admin/dashboard')
    }

    return next()
  }
}
