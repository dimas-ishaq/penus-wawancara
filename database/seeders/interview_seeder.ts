import Interview from '#models/interview'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Interview.updateOrCreateMany('id', [
      {
        id: 'PPDB-001',
        studentName: 'Arya Kusuma',
        schoolOrigin: 'SMPN 1 Kota',
        status: 'Pending',
        totalScore: 0,
      },
      {
        id: 'PPDB-002',
        studentName: 'Bela Safitri',
        schoolOrigin: 'SMP Plus Al-Azhar',
        status: 'Done',
        totalScore: 85,
        academicScore: 80,
        technicalScore: 85,
        attitudeScore: 90,
      },
      {
        id: 'PPDB-003',
        studentName: 'Candra Wijaya',
        schoolOrigin: 'SMPN 3 Kota',
        status: 'Pending',
        totalScore: 0,
      },
      {
        id: 'PPDB-004',
        studentName: 'Dina Lestari',
        schoolOrigin: 'SMP Kartika',
        status: 'Done',
        totalScore: 92,
        academicScore: 90,
        technicalScore: 92,
        attitudeScore: 94,
      },
      {
        id: 'PPDB-005',
        studentName: 'Eko Prasetyo',
        schoolOrigin: 'SMPN 5 Kota',
        status: 'Pending',
        totalScore: 0,
      },
    ])
  }
}