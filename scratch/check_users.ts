import User from '#models/user'

async function run() {
  const users = await User.all()
  console.log('Total users:', users.length)
  users.forEach(u => {
    console.log(`- ${u.fullName} (Role: ${u.role}, Email: ${u.email})`)
  })
}

run().catch(console.error)
