import StudentAgreementDocument from '#models/student_agreement_document'
import Interview from '#models/interview'

export default class AgreementDocumentRepository {
  /**
   * Get all interviews with their agreement documents
   */
  async getAllWithDocuments(filters: any = {}) {
    const query = Interview.query()
      .has('agreementDocument') // Only show those who have been "added"
      .preload('agreementDocument', (q) => {
        q.preload('uploader')
      })
    
    if (filters.search) {
      const search = filters.search.toLowerCase()
      query.where((q) => {
        q.whereRaw('LOWER(student_name) LIKE ?', [`%${search}%`])
          .orWhere('id', 'like', `%${search}%`)
      })
    }

    if (filters.major && filters.major !== 'all') {
      query.where('majorChoice', filters.major)
    }

    let interviews = await query.orderBy('student_name', 'asc')

    if (filters.status && filters.status !== 'all') {
      if (filters.status === 'complete') {
        interviews = interviews.filter(i => i.agreementDocument?.parentAgreementFileUrl && i.agreementDocument?.studentAgreementFileUrl)
      } else if (filters.status === 'incomplete') {
        interviews = interviews.filter(i => !i.agreementDocument?.parentAgreementFileUrl || !i.agreementDocument?.studentAgreementFileUrl)
      }
    }
    
    return interviews
  }

  /**
   * Search all interviews that haven't been added to agreement documents yet
   */
  async searchInterviews(search: string) {
    const query = Interview.query()
      .doesntHave('agreementDocument')
      .where((q) => {
        q.whereRaw('LOWER(student_name) LIKE ?', [`%${search.toLowerCase()}%`])
          .orWhere('id', 'like', `%${search.toLowerCase()}%`)
      })
      .limit(10)
    
    return query.orderBy('student_name', 'asc')
  }

  async findByStudentId(studentId: string) {
    return StudentAgreementDocument.findBy('studentId', studentId)
  }

  async save(data: any) {
    if (data.id) {
      const doc = await StudentAgreementDocument.findOrFail(data.id)
      doc.merge(data)
      await doc.save()
      return doc
    }
    return StudentAgreementDocument.create(data)
  }

  async deleteParentAgreement(id: number) {
    const doc = await StudentAgreementDocument.findOrFail(id)
    doc.parentAgreementFileName = null
    doc.parentAgreementFileUrl = null
    doc.parentAgreementGoogleDriveId = null
    await doc.save()
    return doc
  }

  async deleteStudentAgreement(id: number) {
    const doc = await StudentAgreementDocument.findOrFail(id)
    doc.studentAgreementFileName = null
    doc.studentAgreementFileUrl = null
    doc.studentAgreementGoogleDriveId = null
    await doc.save()
    return doc
  }

  async deleteByStudentId(studentId: string) {
    const doc = await StudentAgreementDocument.findBy('studentId', studentId)
    if (doc) {
      await doc.delete()
    }
  }
}
