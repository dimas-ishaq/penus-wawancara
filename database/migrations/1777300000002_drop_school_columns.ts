import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableNameInterviews = 'interviews'
  protected tableNameUsers = 'users'

  async up() {
    this.schema.alterTable(this.tableNameInterviews, (table) => {
      table.dropColumn('interviewer_school')
    })
    this.schema.alterTable(this.tableNameUsers, (table) => {
      table.dropColumn('school')
    })
  }

  async down() {
    this.schema.alterTable(this.tableNameInterviews, (table) => {
      table.string('interviewer_school').nullable()
    })
    this.schema.alterTable(this.tableNameUsers, (table) => {
      table.string('school').nullable()
    })
  }
}
