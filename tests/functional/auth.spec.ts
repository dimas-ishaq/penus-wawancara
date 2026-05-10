import { test } from '@japa/runner'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'

test.group('Auth Login Functional', (group) => {
  group.each.setup(async () => {
    // Optional: cleanup before each test if not using global DB cleanup
  })

  test('show login page', async ({ client }) => {
    const response = await client.get('/login')
    response.assertStatus(200)
    response.assertInertiaComponent('auth/login')
  })

  test('fail login with invalid credentials', async ({ client }) => {
    const response = await client.post('/login').form({
      email: 'wrong@example.com',
      password: 'wrongpassword'
    })

    response.assertStatus(200) // Redirect back
    response.assertSessionMissed('auth_web') // Session auth should not exist
    response.assertFlashMessage('errors', { login: 'Email atau password salah.' })
  })

  test('success login with valid credentials', async ({ client }) => {
    // Create a temporary user
    const email = 'test@example.com'
    const password = 'secretpassword'
    
    // Ensure user doesn't exist or update it
    await User.updateOrCreate({ email }, { 
      password,
      fullName: 'Test User'
    })

    const response = await client.post('/login').form({
      email,
      password
    })

    response.assertStatus(200) // Redirect
    response.assertRedirectsToRoute('admin.dashboard')
    response.assertSessionExists('auth_web')
  })
})
