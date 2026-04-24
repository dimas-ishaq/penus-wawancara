import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import { AuditLogSchema } from '#database/schema'

export default class AuditLog extends AuditLogSchema {
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  static async log(userId: number, action: string, resource: string, resourceId: string | null = null, details: string | null = null) {
    try {
      await this.create({
        userId,
        action,
        resource,
        resourceId,
        details
      })
    } catch (error) {
      console.error('Failed to create audit log:', error)
    }
  }
}