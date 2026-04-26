import db from '@adonisjs/lucid/services/db'
import Student from '#models/student'

async function check() {
  const count = await db.from('students').count('* as total')
  console.log('Total students:', count[0].total)
  
  const first = await Student.first()
  console.log('First student:', first?.toJSON())
}

check().then(() => process.exit(0)).catch(err => {
  console.error(err)
  process.exit(1)
})
