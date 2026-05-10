import { test } from '@japa/runner'
import User from '#models/user'
import ClassModel from '#models/class'

test.group('Classes Functional', () => {
  test('list classes', async ({ client }) => {
    const user = await User.query().where('role', 'super_admin').first()
    if (!user) return

    const response = await client
      .get('/admin/classes')
      .loginAs(user)

    response.assertStatus(200)
    response.assertInertiaComponent('admin/classes')
  })

  test('create class', async ({ client, assert }) => {
    const user = await User.query().where('role', 'super_admin').first()
    if (!user) return

    const response = await client
      .post('/admin/classes')
      .form({
        name: 'X TKJ 1'
      })
      .loginAs(user)

    response.assertStatus(200)
    
    const cls = await ClassModel.findBy('name', 'X TKJ 1')
    assert.exists(cls)
  })
})
