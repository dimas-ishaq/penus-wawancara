import { ClassSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Major from '#models/major'

export default class Class extends ClassSchema {
  @belongsTo(() => Major)
  declare major: BelongsTo<typeof Major>
}
