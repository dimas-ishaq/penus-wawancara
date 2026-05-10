import { belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { BaseModel } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import type Interview from '#models/interview'
import User from '#models/user'

export default class StudentAgreementDocument extends BaseModel {
  public static tableName = 'student_agreement_documents'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare studentId: string

  @column()
  declare parentAgreementFileName: string | null

  @column()
  declare parentAgreementFileUrl: string | null

  @column()
  declare parentAgreementGoogleDriveId: string | null

  @column()
  declare studentAgreementFileName: string | null

  @column()
  declare studentAgreementFileUrl: string | null

  @column()
  declare studentAgreementGoogleDriveId: string | null

  @column()
  declare uploadedBy: number | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => import('#models/interview').then(m => m.default), {
    foreignKey: 'studentId',
  })
  declare interview: BelongsTo<Interview>

  @belongsTo(() => User, {
    foreignKey: 'uploadedBy',
  })
  declare uploader: BelongsTo<User>
}
