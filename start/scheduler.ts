import BackupService from '#services/backup_service'

/**
 * Simple background scheduler to run backups.
 * This runs every 24 hours.
 */
const BACKUP_INTERVAL = 24 * 60 * 60 * 1000 // 24 hours

export async function startScheduler() {
  console.log('[Scheduler] Background tasks started...')
  
  setInterval(async () => {
    try {
      console.log('[Scheduler] Running scheduled backup...')
      const { fileName } = await BackupService.runBackup()
      console.log('[Scheduler] Backup completed:', fileName)
    } catch (error: any) {
      console.error('[Scheduler] Backup failed:', error.message)
    }
  }, BACKUP_INTERVAL)
}

// Start immediately on app boot
startScheduler()
