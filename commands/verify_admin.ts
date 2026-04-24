import { BaseCommand } from '@adonisjs/core/ace'
import hash from '@adonisjs/core/services/hash'
import User from '#models/user'

export default class VerifyAdmin extends BaseCommand {
  static commandName = 'verify:admin'

  async run() {
    const email = 'admin@example.com'
    const password = 'password123'
    
    this.logger.info(`Checking user: ${email}`)
    const user = await User.findBy('email', email)
    
    if (!user) {
      this.logger.error('User not found')
      return
    }
    
    this.logger.info(`User found. Hashed password: ${user.password}`)
    
    const isValid = await hash.verify(user.password, password)
    this.logger.info(`Manual hash.verify: ${isValid}`)
    
    try {
      const verifiedUser = await User.verifyCredentials(email, password)
      this.logger.info(`User.verifyCredentials: SUCCESS (User ID: ${verifiedUser.id})`)
    } catch (error: any) {
      this.logger.error(`User.verifyCredentials: FAILED (${error.message})`)
    }
  }
}
