import { BaseCommand } from '@adonisjs/core/ace'
import hash from '@adonisjs/core/services/hash'

export default class TestHash extends BaseCommand {
  static commandName = 'test:hash'

  async run() {
    const password = 'password123'
    const hashed = await hash.make(password)
    const isValid = await hash.verify(hashed, password)
    
    this.logger.info(`Password: ${password}`)
    this.logger.info(`Hashed: ${hashed}`)
    this.logger.info(`Is valid: ${isValid}`)
  }
}
