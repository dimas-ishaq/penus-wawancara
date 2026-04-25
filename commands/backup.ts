import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import BackupService from '#services/backup_service'

export default class BackupData extends BaseCommand {
  static commandName = 'backup:data'
  static description = 'Backup key database tables to a JSON file'

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    this.logger.info('Starting backup...')

    try {
      const { fileName } = await BackupService.runBackup()
      this.logger.success(`Backup completed: ${fileName}`)
    } catch (error: any) {
      this.logger.error(`Backup failed: ${error.message}`)
    }
  }
}
