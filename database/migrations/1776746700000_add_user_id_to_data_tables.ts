import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.alterTable('students', (table) => {
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('SET NULL')
    })

    this.schema.alterTable('interviews', (table) => {
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('SET NULL')
    })
  }

  async down() {
    this.schema.alterTable('students', (table) => {
      table.dropColumn('user_id')
    })

    this.schema.alterTable('interviews', (table) => {
      table.dropColumn('user_id')
    })
  }
}
