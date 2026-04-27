import { SettingSchema } from '#database/schema'

export default class Setting extends SettingSchema {
  public static async get(key: string, defaultValue: string | null = null): Promise<string | null> {
    const setting = await this.findBy('key', key)
    return setting ? setting.value : defaultValue
  }

  public static async set(key: string, value: string | null): Promise<void> {
    await this.updateOrCreate({ key }, { value })
  }
}
