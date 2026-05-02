import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'students'

  async up() {
    this.schema.raw(`
      UPDATE ${this.tableName} 
      SET status = 'Ditunda' 
      WHERE status IN ('Ditangguhkan', 'Di Tangguhkan', 'Di Tunda')
    `)
  }

  async down() {
    // There's no perfect way to revert because we don't know which one was 'Ditangguhkan' 
    // and which one was already 'Ditunda' if that was possible.
    // But for consistency, we'll leave it as 'Ditunda'.
  }
}
