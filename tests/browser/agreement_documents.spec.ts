import { test } from '@japa/runner'
import User from '#models/user'

test.group('Agreement Documents Browser Test', () => {
  test('can see the agreement documents page', async ({ visit }) => {
    const user = await User.first()
    if (!user) return

    const page = await visit('/admin/agreement-documents')
    
    // Perform login if redirected
    if (page.url().includes('/login')) {
      await page.type('input[name="uid"]', user.email)
      await page.type('input[name="password"]', 'password') // Use real test password
      await page.click('button[type="submit"]')
    }

    await page.assertTextContains('body', 'Manajemen Surat Perjanjian')
  })

  test('can open add student modal', async ({ visit }) => {
    const user = await User.first()
    if (!user) return

    const page = await visit('/admin/agreement-documents')
    // login logic...
    
    await page.click('button:has-text("Tambah Siswa")')
    await page.assertTextContains('body', 'Cari Siswa')
  })
})
