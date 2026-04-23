import { HttpContext } from '@adonisjs/core/http'
import Setting from '#models/setting'
import app from '@adonisjs/core/services/app'
import { join } from 'node:path'
import fs from 'node:fs/promises'

export default class SettingsController {
  /**
   * Display settings page
   */
  async index({ inertia }: HttpContext) {
    const logo = await Setting.get('logo_path')
    const academicYear = await Setting.get('academic_year', '2024/2025')
    
    return inertia.render('admin/settings', {
      logo: logo || undefined,
      academicYear: academicYear || undefined,
    })
  }

  /**
   * Update general settings
   */
  async updateGeneral({ request, response, session }: HttpContext) {
    const academicYear = request.input('academicYear')

    if (!academicYear) {
      session.flash('error', 'Tahun ajaran tidak boleh kosong')
      return response.redirect().back()
    }

    await Setting.set('academic_year', academicYear)

    session.flash('success', 'Pengaturan umum berhasil diperbarui')
    return response.redirect().back()
  }

  /**
   * Update application logo
   */
  async updateLogo({ request, response, session }: HttpContext) {
    const logoFile = request.file('logo', {
      size: '2mb',
      extnames: ['jpg', 'png', 'jpeg', 'svg', 'webp'],
    })

    if (!logoFile) {
      session.flash('error', 'Pilih file logo terlebih dahulu')
      return response.redirect().back()
    }

    if (!logoFile.isValid) {
      session.flash('error', logoFile.errors[0].message)
      return response.redirect().back()
    }

    // Move to public/uploads/logo
    const fileName = `${new Date().getTime()}.${logoFile.extname}`
    await logoFile.move(app.publicPath('uploads/logo'), {
      name: fileName,
      overwrite: true,
    })

    // Get old logo to delete it
    const oldLogo = await Setting.get('logo_path')
    if (oldLogo && oldLogo.startsWith('/uploads/logo/')) {
        try {
            await fs.unlink(join(app.publicPath(), oldLogo))
        } catch (error) {
            // Ignore if file not found
        }
    }

    const logoPath = `/uploads/logo/${fileName}`
    await Setting.set('logo_path', logoPath)

    session.flash('success', 'Logo berhasil diperbarui')
    return response.redirect().back()
  }
}
