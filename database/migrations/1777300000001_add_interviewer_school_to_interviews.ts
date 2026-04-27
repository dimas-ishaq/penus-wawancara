import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'interviews'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('interviewer_school').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('interviewer_school')
    })
  }
}
