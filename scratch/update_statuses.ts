import Student from '#models/student'

async function run() {
  console.log('Updating statuses...')
  
  const count = await Student.query()
    .where('status', 'Di Tangguhkan')
    .update({ status: 'Di Tunda' })
    
  console.log(`Updated ${count} students.`)
  
  // Also check for 'Ditangguhkan' (without space) just in case
  const count2 = await Student.query()
    .where('status', 'Ditangguhkan')
    .update({ status: 'Di Tunda' })
    
  console.log(`Updated ${count2} students (without space).`)
}

run().catch(console.error).finally(() => process.exit())
