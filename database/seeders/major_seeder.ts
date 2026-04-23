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
      name: 'Perkantoran',
    })
  }
}