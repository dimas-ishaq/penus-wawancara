import { utils, write } from 'xlsx'
import { Response } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

export default class AgreementDocumentExport {
  constructor(protected data: any[]) {}

  async download(response: Response) {
    const worksheetData = this.data.map((i) => {
      const doc = i.agreementDocument || {}
      return {
        'Nama Siswa': i.studentName,
        'NISN': '-', // Not available in interviews table, placeholder
        'Kelas': '-', // Not available in interviews table, placeholder
        'Jurusan': i.majorChoice || '-',
        'Status Surat Orang Tua': doc.parentAgreementFileUrl ? 'Sudah Upload' : 'Belum Upload',
        'Status Surat Siswa': doc.studentAgreementFileUrl ? 'Sudah Upload' : 'Belum Upload',
        'Uploaded By': doc.uploader?.fullName || '-',
        'Upload Date': doc.updatedAt ? DateTime.fromISO(doc.updatedAt).toFormat('yyyy-MM-dd HH:mm') : '-',
        'Link Surat Orang Tua': doc.parentAgreementFileUrl || 'Belum Upload',
        'Link Surat Siswa': doc.studentAgreementFileUrl || 'Belum Upload'
      }
    })

    const ws = utils.json_to_sheet(worksheetData)
    const wb = utils.book_new()
    utils.book_append_sheet(wb, ws, 'Surat Perjanjian')

    const buf = write(wb, { type: 'buffer', bookType: 'xlsx' })
    
    const fileName = `surat_perjanjian_${DateTime.local().toFormat('dd-MM-yyyy_HH-mm-ss')}.xlsx`

    response.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    response.header('Content-Disposition', `attachment; filename=${fileName}`)
    return response.send(buf)
  }
}
