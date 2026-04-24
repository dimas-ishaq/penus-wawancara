import { InterviewSchema } from '#database/schema'
import { belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import { DateTime } from 'luxon'

export default class Interview extends InterviewSchema {
  @column()
  declare userId: number

  @column.dateTime()
  declare interviewDate: DateTime | null

  @column()
  declare interviewer: string | null

  @column()
  declare accompaniment: string | null

  @column()
  declare infoSource: string | null

  @column()
  declare infoSourceOther: string | null

  @column()
  declare reasonChoosingSchool: string | null

  @column()
  declare majorChoice: string | null

  @column()
  declare majorReason: string | null

  @column()
  declare longTermGoals: string | null

  @column({
    prepare: (value) => (value ? JSON.stringify(value) : null),
    consume: (value) => {
      if (typeof value === 'string') {
        try {
          return JSON.parse(value)
        } catch {
          return value
        }
      }
      return value
    },
  })
  declare characterAnswers: any

  @column()
  declare skillCommitment: boolean

  @column()
  declare entrepreneurCommitment: boolean

  @column()
  declare religiousCommitment: boolean

  @column()
  declare violationAgreement: boolean

  @column({
    prepare: (value) => (value ? JSON.stringify(value) : null),
    consume: (value) => {
      if (typeof value === 'string') {
        try {
          return JSON.parse(value)
        } catch {
          return value
        }
      }
      return value
    },
  })
  declare parentCommitments: any

  @column()
  declare livingWith: string | null

  @column()
  declare emergencyContact: string | null

  @column()
  declare emergencyContactPhone: string | null

  @column({
    prepare: (value) => (value ? JSON.stringify(value) : null),
    consume: (value) => {
      if (typeof value === 'string') {
        try {
          return JSON.parse(value)
        } catch {
          return value
        }
      }
      return value
    },
  })
  declare billingDetails: any

  @column({
    prepare: (value) => (value ? JSON.stringify(value) : null),
    consume: (value) => {
      if (typeof value === 'string') {
        try {
          return JSON.parse(value)
        } catch {
          return value
        }
      }
      return value
    },
  })
  declare violationDetails: any

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}