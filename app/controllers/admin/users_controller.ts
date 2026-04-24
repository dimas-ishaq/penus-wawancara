import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http'
import UserTransformer from '#transformers/user_transformer'
import vine from '@vinejs/vine'

export default class UsersController {
  /**
   * List all users
   */
  async index({ inertia, request }: HttpContext) {
    const page = request.input('page', 1)
    const search = request.input('search', '')?.toLowerCase()
    const perPage = 20

    let query = User.query()

    if (search) {
      query = query.where((q) => {
        q.whereRaw('LOWER(full_name) LIKE ?', [`%${search}%`])
          .orWhereRaw('LOWER(email) LIKE ?', [`%${search}%`])
      })
    }

    const users = await query
      .orderBy('fullName', 'asc')
      .paginate(page, perPage)

    users.baseUrl('/admin/users').queryString(request.qs())

    return inertia.render('admin/users', {
      users: {
        data: UserTransformer.transform(users.all()),
        meta: users.serialize().meta,
      },
      search,
    })
  }

  /**
   * Create a new user
   */
  async store({ request, response, session }: HttpContext) {
    const validator = vine.compile(
      vine.object({
        fullName: vine.string().optional(),
        email: vine.string().email().unique({ table: 'users', column: 'email' }),
        password: vine.string().minLength(8),
        role: vine.enum(['super_admin', 'admin', 'staff']),
      })
    )

    const payload = await request.validateUsing(validator)
    await User.create(payload)

    session.flash('success', 'Pengguna berhasil ditambahkan')
    return response.redirect().back()
  }

  /**
   * Update an existing user
   */
  async update({ request, params, response, session }: HttpContext) {
    const user = await User.findOrFail(params.id)
    
    const validator = vine.compile(
      vine.object({
        fullName: vine.string().optional(),
        email: vine.string().email().unique({ 
          table: 'users', 
          column: 'email',
          filter: (query) => { query.whereNot('id', user.id) }
        }),
        password: vine.string().minLength(8).optional(),
        role: vine.enum(['super_admin', 'admin', 'staff']),
      })
    )

    const payload = await request.validateUsing(validator)
    
    if (!payload.password) {
      delete payload.password
    }

    user.merge(payload)
    await user.save()

    session.flash('success', 'Data pengguna berhasil diperbarui')
    return response.redirect().back()
  }

  /**
   * Delete a user
   */
  async destroy({ params, response, session, auth }: HttpContext) {
    const user = await User.findOrFail(params.id)

    // Prevent deleting self
    if (user.id === auth.user?.id) {
      session.flash('error', 'Anda tidak dapat menghapus akun Anda sendiri')
      return response.redirect().back()
    }

    await user.delete()
    session.flash('success', 'Pengguna berhasil dihapus')
    return response.redirect().back()
  }
}
