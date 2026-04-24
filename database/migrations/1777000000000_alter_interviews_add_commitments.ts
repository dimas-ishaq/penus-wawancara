import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'interviews'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.boolean('skill_commitment').defaultTo(false)
      table.boolean('entrepreneur_commitment').defaultTo(false)
      table.boolean('religious_commitment').defaultTo(false)
      table.json('violation_details').nullable()
      table.string('emergency_contact_phone').nullable()
      table.text('major_reason').nullable()
      table.string('info_source_other').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumns('skill_commitment', 'entrepreneur_commitment', 'religious_commitment', 'violation_details', 'emergency_contact_phone', 'major_reason', 'info_source_other')
    })
  }
}
