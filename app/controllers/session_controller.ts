import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'

export default class SessionController {
  async create({ inertia }: HttpContext) {
    return inertia.render('auth/login', {})
  }

  async store({ request, auth, response, session }: HttpContext) {
    const { email, password } = request.all()
    const trimmedEmail = email?.trim()
    
    console.log(`Login attempt for: "${trimmedEmail}" (password length: ${password?.length})`)

    try {
      // 1. Cari user berdasarkan email
      const user = await User.findBy('email', trimmedEmail)
      
      if (!user) {
        console.log(`User NOT found for email: ${trimmedEmail}`)
        session.flash('errors', { login: 'Email atau password salah.' })
        return response.redirect().back()
      }

      console.log(`User found: ${user.email}. Hash in DB: ${user.password?.substring(0, 20)}...`)

      // 2. Verifikasi password secara manual
      const isPasswordValid = await hash.verify(user.password, password)
      console.log(`Manual password verification result: ${isPasswordValid}`)

      if (!isPasswordValid) {
        session.flash('errors', { login: 'Email atau password salah.' })
        return response.redirect().back()
      }

      // 3. Login jika valid
      await auth.use('web').login(user)
      return response.redirect().toRoute('admin.dashboard')
    } catch (error) {
      console.error('Login error detail:', error)
      session.flash('errors', { login: 'Terjadi kesalahan pada sistem.' })
      return response.redirect().back()
    }
  }

  async destroy({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    response.redirect().toRoute('session.create')
  }
}
