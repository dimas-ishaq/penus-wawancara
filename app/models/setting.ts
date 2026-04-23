import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class Setting extends BaseModel {
  @column({ isPrimary: true })
  declare key: string

  @column()
  declare value: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  public static async get(key: string, defaultValue: string | null = null): Promise<string | null> {
    const setting = await this.find(key)
    return setting ? setting.value : defaultValue
  }

  public static async set(key: string, value: string): Promise<void> {
    await this.updateOrCreate({ key }, { value })
  }
}
