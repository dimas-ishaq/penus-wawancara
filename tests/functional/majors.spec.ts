import { test } from '@japa/runner'
import User from '#models/user'
import Major from '#models/major'

test.group('Majors Functional', () => {
  test('list majors', async ({ client }) => {
    const user = await User.query().where('role', 'super_admin').first()
    if (!user) return

    const response = await client
      .get('/admin/majors')
      .loginAs(user)

    response.assertStatus(200)
    response.assertInertiaComponent('admin/majors')
  })

  test('create major', async ({ client, assert }) => {
    const user = await User.query().where('role', 'super_admin').first()
    if (!user) return

    const response = await client
      .post('/admin/majors')
      .form({
        name: 'Teknik Komputer Jaringan',
        code: 'TKJ'
      })
      .loginAs(user)

    response.assertStatus(200)
    
    const major = await Major.findBy('code', 'TKJ')
    assert.exists(major)
    assert.equal(major?.name, 'Teknik Komputer Jaringan')
  })
})
