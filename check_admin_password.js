import pg from 'pg'

const config = {
  host: '127.0.0.1',
  port: 5432,
  user: 'postgres',
  password: 'dimas212',
  database: 'app_wawancara', 
}

const client = new pg.Client(config)

async function checkAdmin() {
  try {
    await client.connect()
    const res = await client.query("SELECT email, password FROM users WHERE email = 'admin@example.com'")
    if (res.rows.length > 0) {
      const row = res.rows[0]
      console.log(`Email: ${row.email}, Password: ${row.password}`)
    } else {
      console.log('Admin user not found')
    }
  } catch (err) {
    console.error('Error checking users:', err)
  } finally {
    await client.end()
  }
}

checkAdmin()
