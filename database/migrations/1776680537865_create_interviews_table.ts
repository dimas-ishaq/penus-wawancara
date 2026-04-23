import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'interviews'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary().notNullable()
      table.string('student_name').notNullable()
      table.string('school_origin').notNullable()
      table.string('status').notNullable().defaultTo('Pending')
      table.integer('academic_score').defaultTo(0)
      table.integer('technical_score').defaultTo(0)
      table.integer('attitude_score').defaultTo(0)
      table.integer('total_score').defaultTo(0)
      table.text('notes').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}