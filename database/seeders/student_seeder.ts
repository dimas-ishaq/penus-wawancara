import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Student from '#models/student'

export default class extends BaseSeeder {
  async run() {
    await Student.updateOrCreateMany('nisn', [
      { nisn: '0061112221', name: 'Ahmad Faisal', class: 'XII RPL 1', majorCode: 'RPL', status: 'Lulus' },
      { nisn: '0061112222', name: 'Budi Santoso', class: 'XII TKJ 2', majorCode: 'TKJ', status: 'Tidak Lulus' },
      { nisn: '0061112223', name: 'Citra Lestari', class: 'XII DKV 1', majorCode: 'DKV', status: 'Pending' },
      { nisn: '0056123444', name: 'Dedi Kurniawan', class: 'XII PKM 2', majorCode: 'PKM', status: 'Lulus' },
      { nisn: '0056123998', name: 'Arya Kusuma', class: 'XII RPL 2', majorCode: 'RPL', status: 'Lulus' },
      { nisn: '0069988771', name: 'Eka Putri', class: 'XII TKJ 1', majorCode: 'TKJ', status: 'Pending' },
      { nisn: '0069988772', name: 'Fajar Ramadhan', class: 'XII DKV 2', majorCode: 'DKV', status: 'Lulus' },
      { nisn: '0069988773', name: 'Gita Permata', class: 'XII PKM 1', majorCode: 'PKM', status: 'Tidak Lulus' },
      { nisn: '0047722115', name: 'Hadi Wijaya', class: 'XII RPL 1', majorCode: 'RPL', status: 'Pending' },
      { nisn: '0047722116', name: 'Indah Sari', class: 'XII TKJ 2', majorCode: 'TKJ', status: 'Lulus' },
    ])
  }
}