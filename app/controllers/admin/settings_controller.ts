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
    const logo = (await Setting.get('logo_path')) || '/assets/logo_penus.png'
    const kopSurat = await Setting.get('kop_surat_path')
    const brandName = await Setting.get('brand_name', 'SMK PLUS PELITA NUSANTARA')
    const academicYear = await Setting.get('academic_year', '2024/2025')
    
    return inertia.render('admin/settings', {
      logo: logo || undefined,
      kopSurat: kopSurat || undefined,
      academicYear: academicYear || undefined,
      brandName: brandName || undefined,
    })
  }

  /**
   * Update general settings
   */
  async updateGeneral({ request, response, session }: HttpContext) {
    const academicYear = request.input('academicYear')
    const brandName = request.input('brandName')

    if (!academicYear || !brandName) {
      session.flash('error', 'Tahun ajaran dan Nama Brand tidak boleh kosong')
      return response.redirect().back()
    }

    await Setting.set('academic_year', academicYear)
    await Setting.set('brand_name', brandName)

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

  /**
   * Update Kop Surat (Private Asset)
   */
  async updateKopSurat({ request, response, session }: HttpContext) {
    const kopFile = request.file('kopSurat', {
      size: '5mb',
      extnames: ['jpg', 'png', 'jpeg'],
    })

    if (!kopFile) {
      session.flash('error', 'Pilih file kop surat terlebih dahulu')
      return response.redirect().back()
    }

    if (!kopFile.isValid) {
      session.flash('error', kopFile.errors[0].message)
      return response.redirect().back()
    }

    // Create directory if not exists
    const storagePath = app.makePath('storage', 'uploads', 'settings')
    await fs.mkdir(storagePath, { recursive: true })

    const fileName = `kop_surat_${new Date().getTime()}.${kopFile.extname}`
    await kopFile.move(storagePath, {
      name: fileName,
      overwrite: true,
    })

    // Get old kop to delete it
    const oldKop = await Setting.get('kop_surat_path')
    if (oldKop) {
        try {
            await fs.unlink(oldKop)
        } catch (error) {
            // Ignore
        }
    }

    const fullPath = join(storagePath, fileName)
    await Setting.set('kop_surat_path', fullPath)

    session.flash('success', 'Kop Surat berhasil diperbarui')
    return response.redirect().back()
  }

  /**
   * Proxy to serve private assets (if needed for preview)
   */
  async servePrivateAsset({ params, response }: HttpContext) {
    const path = await Setting.get(params.key)
    if (!path) {
      return response.notFound()
    }
    return response.download(path)
  }
}
