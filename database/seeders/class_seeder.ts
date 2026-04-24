import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Class from '#models/class'
import Major from '#models/major'

export default class extends BaseSeeder {
  async run() {
    const majors = await Major.all()
    
    if (majors.length === 0) {
      console.log('No majors found. Please seed majors first.')
      return
    }

    const classesToSeed = []

    for (const major of majors) {
      // Seed X, XI, XII for each major
      const grades = ['X', 'XI', 'XII']
      for (const grade of grades) {
        classesToSeed.push({
          name: `${grade} ${major.code} 1`,
          majorId: major.id
        })
      }
    }

    await Class.createMany(classesToSeed)
  }
}
