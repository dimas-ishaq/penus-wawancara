import { InterviewSchema } from '#database/schema'
import { belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'

export default class Interview extends InterviewSchema {
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