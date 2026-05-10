import pg from 'pg'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config()

const client = new pg.Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
})

async function run() {
  await client.connect()
  try {
    console.log('Creating table student_agreement_documents...')
    await client.query(`
      CREATE TABLE IF NOT EXISTS student_agreement_documents (
        id SERIAL PRIMARY KEY,
        student_id VARCHAR(255) NOT NULL REFERENCES interviews(id) ON DELETE CASCADE,
        parent_agreement_file_name VARCHAR(255),
        parent_agreement_file_url VARCHAR(255),
        parent_agreement_google_drive_id VARCHAR(255),
        student_agreement_file_name VARCHAR(255),
        student_agreement_file_url VARCHAR(255),
        student_agreement_google_drive_id VARCHAR(255),
        uploaded_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('Table created successfully.')
  } catch (err) {
    console.error('Error creating table:', err)
  } finally {
    await client.end()
  }
}

run()
