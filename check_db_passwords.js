import pg from 'pg'

const config = {
  host: '127.0.0.1',
  port: 5432,
  user: 'postgres',
  password: 'dimas212',
  database: 'app_wawancara', 
}

const client = new pg.Client(config)

async function checkUsers() {
  try {
    await client.connect()
    const res = await client.query('SELECT email, password FROM users LIMIT 5')
    console.log('User data sample:')
    res.rows.forEach(row => {
      console.log(`Email: ${row.email}, Password: ${row.password.substring(0, 10)}...`)
    })
  } catch (err) {
    console.error('Error checking users:', err)
  } finally {
    await client.end()
  }
}

checkUsers()
