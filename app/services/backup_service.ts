import db from '@adonisjs/lucid/services/db'
import fs from 'node:fs'
import path from 'node:path'

export default class BackupService {
  private static tables = [
    'students', 
    'interviews', 
    'users', 
    'settings', 
    'majors', 
    'classes', 
    'audit_logs'
  ]

  static async runBackup() {
    const backupData: any = {}
    const backupDir = path.join(process.cwd(), 'backups')

    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true })
    }

    for (const table of this.tables) {
      try {
        const data = await db.from(table).select('*')
        backupData[table] = data
      } catch (e: any) {
        console.error(`[BackupService] Failed to backup table ${table}:`, e.message)
      }
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const fileName = `backup-${timestamp}.json`
    const filePath = path.join(backupDir, fileName)
    
    fs.writeFileSync(filePath, JSON.stringify(backupData, null, 2))
    
    return { fileName, filePath }
  }
}
