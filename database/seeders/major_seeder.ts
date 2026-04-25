import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Major from '#models/major'

export default class extends BaseSeeder {
  async run() {
    await Major.updateOrCreate({ code: 'TKJ' }, {
      name: 'Teknik Komputer dan Jaringan',
    })
    await Major.updateOrCreate({ code: 'RPL' }, {
      name: 'Rekayasa Perangkat Lunak',
    })
    await Major.updateOrCreate({ code: 'DKV' }, {
      name: 'Desain Komunikasi Visual',
    })
    await Major.updateOrCreate({ code: 'PKM' }, {
      name: 'Perbankan dan Keuangan Mikro',
    })
    await Major.updateOrCreate({ code: 'TOI' }, {
      name: 'Teknik Otomasi Industri',
    })
    await Major.updateOrCreate({ code: 'MPLB' }, {
      name: 'Manajemen Perkantoran dan Layanan Bisnis',
    })
  }
}