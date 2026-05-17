import { HttpContext } from '@adonisjs/core/http'
import Setting from '#models/setting'
import app from '@adonisjs/core/services/app'
import { join } from 'node:path'
import fs from 'node:fs/promises'
import GoogleDriveService from '#services/google_drive_service'

export default class SettingsController {
  /**
   * Display settings page
   */
  async index({ inertia }: HttpContext) {
    const logo = (await Setting.get('logo_path')) || '/assets/logo_penus.png'
    const kopSurat = await Setting.get('kop_surat_path')
    const brandName = await Setting.get('brand_name', 'SMK PLUS PELITA NUSANTARA')
    const brandShortName = await Setting.get('brand_short_name', 'PENUS')
    const academicYear = await Setting.get('academic_year', '2024/2025')
    
    const googleType = await Setting.get('google_drive_type', 'oauth')
    const googleClientId = await Setting.get('google_drive_client_id')
    const googleClientSecret = await Setting.get('google_drive_client_secret')
    const googleRefreshToken = await Setting.get('google_drive_refresh_token')
    const googleClientEmail = await Setting.get('google_drive_client_email')
    const googlePrivateKey = await Setting.get('google_drive_private_key')
    const googleParentFolderId = await Setting.get('google_drive_parent_folder_id')
    const googleStudentFolderId = await Setting.get('google_drive_student_folder_id')
    
    return inertia.render('admin/settings', {
      logo,
      kopSurat,
      academicYear,
      brandName,
      brandShortName,
      googleDrive: {
        type: googleType || 'oauth',
        clientId: googleClientId || '',
        clientSecret: googleClientSecret || '',
        refreshToken: googleRefreshToken || '',
        clientEmail: googleClientEmail || '',
        privateKey: googlePrivateKey || '',
        parentFolderId: googleParentFolderId || '',
        studentFolderId: googleStudentFolderId || ''
      }
    })
  }

  /**
   * Update general settings
   */
  async updateGeneral({ request, response, session }: HttpContext) {
    const academicYear = request.input('academicYear')
    const brandName = request.input('brandName')
    const brandShortName = request.input('brandShortName')

    if (!academicYear || !brandName || !brandShortName) {
      session.flash('error', 'Seluruh field pengaturan umum wajib diisi')
      return response.redirect().back()
    }

    await Setting.set('academic_year', academicYear)
    await Setting.set('brand_name', brandName)
    await Setting.set('brand_short_name', brandShortName)

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

  /**
   * Update Google Drive settings
   */
  async updateGoogleDrive({ request, response, session }: HttpContext) {
    const type = request.input('type', 'oauth')
    const clientId = request.input('clientId')
    const clientSecret = request.input('clientSecret')
    const refreshToken = request.input('refreshToken')
    const clientEmail = request.input('clientEmail')
    const privateKey = request.input('privateKey')
    const parentFolderId = request.input('parentFolderId')
    const studentFolderId = request.input('studentFolderId')

    await Setting.set('google_drive_type', type)
    await Setting.set('google_drive_client_id', clientId)
    await Setting.set('google_drive_client_secret', clientSecret)
    await Setting.set('google_drive_refresh_token', refreshToken)
    await Setting.set('google_drive_client_email', clientEmail)
    await Setting.set('google_drive_private_key', privateKey)
    await Setting.set('google_drive_parent_folder_id', parentFolderId)
    await Setting.set('google_drive_student_folder_id', studentFolderId)

    session.flash('success', 'Pengaturan Google Drive berhasil diperbarui')
    return response.redirect().back()
  }

  async verifyGoogleDrive({ request, response }: HttpContext) {
    const type = request.input('type')
    const clientId = request.input('clientId')
    const clientSecret = request.input('clientSecret')
    const refreshToken = request.input('refreshToken')
    const clientEmail = request.input('clientEmail')
    const privateKey = request.input('privateKey')
    const folderId = request.input('folderId')?.trim()

    console.log('Verify Input - Email:', clientEmail)
    console.log('Verify Input - Key Presence:', !!privateKey)
    console.log('Verify Input - Folder ID:', folderId)
    
    try {
      const result = await GoogleDriveService.verify(folderId, {
        type,
        clientId,
        clientSecret,
        refreshToken,
        clientEmail,
        privateKey
      })
      return response.json(result)
    } catch (error) {
      return response.status(400).json({
        success: false,
        message: (error as any).message
      })
    }
  }

  async googleAuth({ response }: HttpContext) {
    try {
      const url = await GoogleDriveService.getAuthUrl()
      return response.redirect().toPath(url)
    } catch (error) {
      console.error('Google Auth Error:', error)
      return response.status(400).send((error as any).message)
    }
  }

  async googleCallback({ request, response, session }: HttpContext) {
    const code = request.input('code')
    if (!code) {
      session.flash('error', 'Otorisasi dibatalkan atau kode tidak ditemukan.')
      return response.redirect().toPath('/admin/settings')
    }

    try {
      const tokens = await GoogleDriveService.getTokensFromCode(code)
      
      // Save refresh token to settings
      if (tokens.refresh_token) {
        await Setting.set('google_drive_refresh_token', tokens.refresh_token)
      }
      
      session.flash('success', 'Berhasil terhubung ke Google Drive!')
    } catch (error) {
      console.error('Google Callback Error:', error)
      session.flash('error', 'Gagal mendapatkan token: ' + (error as any).message)
    }

    return response.redirect().toPath('/admin/settings')
  }
}
