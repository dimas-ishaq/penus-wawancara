import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'interviews'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dateTime('interview_date').nullable()
      table.string('accompaniment').nullable()
      table.string('interviewer').nullable()
      
      // Question 1-4 (Siswa)
      table.string('info_source').nullable()
      table.text('reason_choosing_school').nullable()
      table.text('major_choice').nullable()
      table.text('long_term_goals').nullable()
      
      // Question 5 & 6 & 7 (Siswa)
      table.json('character_answers').nullable() // Q5 a-g
      table.text('special_activities').nullable() // Q6
      table.boolean('violation_agreement').defaultTo(false) // Q7
      
      // Parent Questions
      table.json('parent_commitments').nullable() // Q1-4
      table.string('living_with').nullable() // Q5
      table.string('emergency_contact').nullable() // Q6
      table.json('billing_details').nullable() // Q7 a-d
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumns(
        'interview_date',
        'accompaniment',
        'interviewer',
        'info_source',
        'reason_choosing_school',
        'major_choice',
        'long_term_goals',
        'character_answers',
        'special_activities',
        'violation_agreement',
        'parent_commitments',
        'living_with',
        'emergency_contact',
        'billing_details'
      )
    })
  }
}