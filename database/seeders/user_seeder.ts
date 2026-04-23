import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const users = [
      {
        fullName: 'Amirul Hadid Ramadan, S.Pd., M.Pd',
        email: 'amirul@smkpnb.id',
        password: 'smkpluspnb',
      },
      {
        fullName: 'Nugrah Dwi Saptaji, S.Psi',
        email: 'nugrah@smkpnb.id',
        password: 'smkpluspnb',
      },
      {
        fullName: 'Hanifan Nurfauzi, M. Ag',
        email: 'hanifan@smkpnb.id',
        password: 'smkpluspnb',
      },
      {
        fullName: 'Rohajon, S.T',
        email: 'rohajon@smkpnb.id',
        password: 'smkpluspnb',
      },
      {
        fullName: 'Wirya Aini, S.Pd., M.Pd',
        email: 'wirya@smkpnb.id',
        password: 'smkpluspnb',
      },
      {
        fullName: 'Muhamad Adib, S.E',
        email: 'muhamad@smkpnb.id',
        password: 'smkpluspnb',
      },
      {
        fullName: 'Fitri Rohmayasari, S.Pd',
        email: 'fitri@smkpnb.id',
        password: 'smkpluspnb',
      },
      {
        fullName: 'Ari Zulfikar, S.Pd',
        email: 'ari@smkpnb.id',
        password: 'smkpluspnb',
      },
      {
        fullName: 'Ardi Sukma, S.H',
        email: 'ardi@smkpnb.id',
        password: 'smkpluspnb',
      },
    ]

    for (const userData of users) {
      await User.updateOrCreate({ email: userData.email }, userData)
    }
    
    // Maintain default admin for safety
    await User.updateOrCreate(
      { email: 'admin@example.com' },
      {
        fullName: 'Administrator',
        password: 'password123',
        role: 'super_admin',
      }
    )
  }
}