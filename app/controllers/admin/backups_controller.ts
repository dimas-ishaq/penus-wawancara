import { HttpContext } from '@adonisjs/core/http'
import BackupService from '#services/backup_service'
import fs from 'node:fs'
import path from 'node:path'

export default class BackupsController {
  private backupDir = path.join(process.cwd(), 'backups')

  async index({ inertia }: HttpContext) {
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true })
    }

    const files = fs.readdirSync(this.backupDir)
      .filter(file => file.endsWith('.json'))
      .map(file => {
        const stats = fs.statSync(path.join(this.backupDir, file))
        return {
          name: file,
          size: (stats.size / 1024).toFixed(2) + ' KB',
          createdAt: stats.birthtime.toISOString()
        }
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return inertia.render('admin/backups', { backups: files })
  }

  async store({ response, session }: HttpContext) {
    try {
      await BackupService.runBackup()
      
      session.flash('success', 'Backup data berhasil dibuat.')
      return response.redirect().back()
    } catch (error: any) {
      session.flash('error', 'Gagal membuat backup: ' + error.message)
      return response.redirect().back()
    }
  }

  async download({ params, response }: HttpContext) {
    const fileName = params.name
    const filePath = path.join(this.backupDir, fileName)

    if (!fs.existsSync(filePath)) {
      return response.status(404).send('File tidak ditemukan')
    }

    return response.download(filePath)
  }

  async destroy({ params, response, session }: HttpContext) {
    const fileName = params.name
    const filePath = path.join(this.backupDir, fileName)

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
      session.flash('success', 'Backup berhasil dihapus.')
    }

    return response.redirect().back()
  }
}
