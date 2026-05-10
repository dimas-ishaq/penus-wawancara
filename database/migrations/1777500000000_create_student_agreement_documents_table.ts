import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'student_agreement_documents'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('student_id').notNullable().references('id').inTable('interviews').onDelete('CASCADE')
      table.string('parent_agreement_file_name').nullable()
      table.string('parent_agreement_file_url').nullable()
      table.string('parent_agreement_google_drive_id').nullable()
      table.string('student_agreement_file_name').nullable()
      table.string('student_agreement_file_url').nullable()
      table.string('student_agreement_google_drive_id').nullable()
      table.integer('uploaded_by').unsigned().nullable().references('id').inTable('users').onDelete('SET NULL')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
