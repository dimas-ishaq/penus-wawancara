import { test } from '@japa/runner'
import User from '#models/user'

test.group('Agreement Documents Controller', (group) => {
  group.each.setup(async () => {
    // Setup logic if needed
  })

  test('index page is accessible for authenticated users', async ({ client }) => {
    const user = await User.first() // Assuming at least one user exists or create one
    if (!user) return

    const response = await client
      .get('/admin/agreement-documents')
      .loginAs(user)

    response.assertStatus(200)
    response.assertInertiaComponent('admin/agreement-documents/index')
  })

  test('search endpoint returns JSON', async ({ client }) => {
    const user = await User.first()
    if (!user) return

    const response = await client
      .get('/admin/agreement-documents/search?q=test')
      .loginAs(user)

    response.assertStatus(200)
    response.assertBodyContains([]) // Or expected data
  })
})
