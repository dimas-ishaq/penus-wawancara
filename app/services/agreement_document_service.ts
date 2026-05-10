import { inject } from '@adonisjs/core'
import AgreementDocumentRepository from '#repositories/agreement_document_repository'
import AuditLog from '#models/audit_log'
import GoogleDriveService from '#services/google_drive_service'
import { DateTime } from 'luxon'
import string from '@adonisjs/core/helpers/string'
import Setting from '#models/setting'

@inject()
export default class AgreementDocumentService {
  constructor(protected repository: AgreementDocumentRepository) {}

  async getInterviews(filters: any) {
    return this.repository.getAllWithDocuments(filters)
  }

  async searchInterviews(search: string) {
    return this.repository.searchInterviews(search)
  }

  async addStudent(studentId: string, userId: number) {
    const Interview = (await import('#models/interview')).default
    const student = await Interview.findOrFail(studentId)
    
    const existing = await this.repository.findByStudentId(studentId)
    if (existing) return existing

    const doc = await this.repository.save({
      studentId,
      uploadedBy: userId
    })

    await AuditLog.log(
      userId, 
      'created', 
      'agreement_document', 
      studentId, 
      `Menambahkan ${student.studentName} ke manajemen surat perjanjian`
    )

    return doc
  }

  async uploadParentAgreement(studentId: string, file: any, userId: number) {
    const Interview = (await import('#models/interview')).default
    const student = await Interview.findOrFail(studentId)
    
    const slugName = string.slug(student.studentName.toLowerCase())
    const timestamp = DateTime.now().toMillis()
    const fileName = `surat-perjanjian-orang-tua-${slugName}-${timestamp}.${file.extname}`

    console.log(`Uploading parent agreement for ${studentId}`)
    const folderId = (await Setting.get('google_drive_parent_folder_id'))?.trim()
    const uploadResult = await GoogleDriveService.upload(file, fileName, folderId)
    console.log('Upload result:', uploadResult)

    let doc = await this.repository.findByStudentId(studentId)
    const oldFileName = doc?.parentAgreementFileName

    if (doc?.parentAgreementGoogleDriveId) {
      console.log('Deleting old file:', doc.parentAgreementGoogleDriveId)
      await GoogleDriveService.delete(doc.parentAgreementGoogleDriveId)
    }

    const data = {
      studentId,
      parentAgreementFileName: uploadResult.fileName,
      parentAgreementFileUrl: uploadResult.fileUrl,
      parentAgreementGoogleDriveId: uploadResult.googleDriveId,
      uploadedBy: userId
    }

    if (doc) {
      console.log('Updating existing record:', doc.id)
      doc.merge(data)
      await doc.save()
    } else {
      console.log('Creating new record for student:', studentId)
      doc = await this.repository.save(data)
    }

    await AuditLog.log(
      userId, 
      oldFileName ? 'updated' : 'uploaded', 
      'agreement_document', 
      studentId, 
      `${oldFileName ? 'Memperbarui' : 'Mengunggah'} surat perjanjian orang tua untuk ${student.studentName}`
    )
    console.log('Process complete for:', studentId)

    return doc
  }

  async uploadStudentAgreement(studentId: string, file: any, userId: number) {
    const Interview = (await import('#models/interview')).default
    const student = await Interview.findOrFail(studentId)
    
    const slugName = string.slug(student.studentName.toLowerCase())
    const timestamp = DateTime.now().toMillis()
    const fileName = `surat-perjanjian-siswa-${slugName}-${timestamp}.${file.extname}`

    console.log(`Uploading student agreement for ${studentId}`)
    const folderId = (await Setting.get('google_drive_student_folder_id'))?.trim()
    const uploadResult = await GoogleDriveService.upload(file, fileName, folderId)
    console.log('Upload result:', uploadResult)

    let doc = await this.repository.findByStudentId(studentId)
    const oldFileName = doc?.studentAgreementFileName

    if (doc?.studentAgreementGoogleDriveId) {
      console.log('Deleting old file:', doc.studentAgreementGoogleDriveId)
      await GoogleDriveService.delete(doc.studentAgreementGoogleDriveId)
    }

    const data = {
      studentId,
      studentAgreementFileName: uploadResult.fileName,
      studentAgreementFileUrl: uploadResult.fileUrl,
      studentAgreementGoogleDriveId: uploadResult.googleDriveId,
      uploadedBy: userId
    }

    if (doc) {
      console.log('Updating existing record:', doc.id)
      doc.merge(data)
      await doc.save()
    } else {
      console.log('Creating new record for student:', studentId)
      doc = await this.repository.save(data)
    }

    await AuditLog.log(
      userId, 
      oldFileName ? 'updated' : 'uploaded', 
      'agreement_document', 
      studentId, 
      `${oldFileName ? 'Memperbarui' : 'Mengunggah'} surat perjanjian siswa untuk ${student.studentName}`
    )
    console.log('Process complete for:', studentId)

    return doc
  }

  async deleteParentAgreement(studentId: string, userId: number) {
    const doc = await this.repository.findByStudentId(studentId)
    if (!doc) return

    const Interview = (await import('#models/interview')).default
    const student = await Interview.findOrFail(studentId)

    if (doc.parentAgreementGoogleDriveId) {
      await GoogleDriveService.delete(doc.parentAgreementGoogleDriveId)
    }
    
    doc.parentAgreementFileName = null
    doc.parentAgreementFileUrl = null
    doc.parentAgreementGoogleDriveId = null
    await doc.save()

    await AuditLog.log(
      userId, 
      'deleted', 
      'agreement_document', 
      studentId, 
      `Menghapus surat perjanjian orang tua untuk ${student.studentName}`
    )
  }

  async deleteStudentAgreement(studentId: string, userId: number) {
    const doc = await this.repository.findByStudentId(studentId)
    if (!doc) return

    const Interview = (await import('#models/interview')).default
    const student = await Interview.findOrFail(studentId)

    if (doc.studentAgreementGoogleDriveId) {
      await GoogleDriveService.delete(doc.studentAgreementGoogleDriveId)
    }
    
    doc.studentAgreementFileName = null
    doc.studentAgreementFileUrl = null
    doc.studentAgreementGoogleDriveId = null
    await doc.save()

    await AuditLog.log(
      userId, 
      'deleted', 
      'agreement_document', 
      studentId, 
      `Menghapus surat perjanjian siswa untuk ${student.studentName}`
    )
  }

  async removeStudent(studentId: string, userId: number) {
    const doc = await this.repository.findByStudentId(studentId)
    if (!doc) return

    const Interview = (await import('#models/interview')).default
    const student = await Interview.findOrFail(studentId)

    // Delete files from Google Drive if exist
    if (doc.parentAgreementGoogleDriveId) {
      await GoogleDriveService.delete(doc.parentAgreementGoogleDriveId)
    }
    if (doc.studentAgreementGoogleDriveId) {
      await GoogleDriveService.delete(doc.studentAgreementGoogleDriveId)
    }

    await this.repository.deleteByStudentId(studentId)

    await AuditLog.log(
      userId, 
      'removed', 
      'agreement_document', 
      studentId, 
      `Menghapus ${student.studentName} dari manajemen surat perjanjian`
    )
  }
}
