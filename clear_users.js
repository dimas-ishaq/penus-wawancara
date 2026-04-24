import pg from 'pg'

const config = {
  host: '127.0.0.1',
  port: 5432,
  user: 'postgres',
  password: 'dimas212',
  database: 'app_wawancara', 
}

const client = new pg.Client(config)

async function clearUsers() {
  try {
    await client.connect()
    console.log('Connected to app_wawancara')
    
    await client.query('TRUNCATE TABLE users RESTART IDENTITY CASCADE')
    console.log('Table "users" cleared successfully!')
  } catch (err) {
    console.error('Error clearing users:', err)
  } finally {
    await client.end()
  }
}

clearUsers()
