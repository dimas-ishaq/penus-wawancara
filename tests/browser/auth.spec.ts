import { test } from '@japa/runner'
import User from '#models/user'

test.group('Auth Login Browser', () => {
  test('user can login through the form', async ({ visit }) => {
    const email = 'browser-test@example.com'
    const password = 'secretpassword'

    await User.updateOrCreate({ email }, { 
      password,
      fullName: 'Browser Test User'
    })

    const page = await visit('/login')

    // Fill form
    await page.type('input[name="email"]', email)
    await page.type('input[name="password"]', password)
    
    // Submit
    await page.click('button[type="submit"]')

    // Assert redirection to dashboard
    await page.waitForNavigation()
    await page.assertPathIs('/admin/dashboard')
    await page.assertTextContains('Dashboard')
  })

  test('user sees error message on failed login', async ({ visit }) => {
    const page = await visit('/login')

    await page.type('input[name="email"]', 'wrong@example.com')
    await page.type('input[name="password"]', 'wrongpassword')
    await page.click('button[type="submit"]')

    await page.assertTextContains('Email atau password salah.')
  })
})
