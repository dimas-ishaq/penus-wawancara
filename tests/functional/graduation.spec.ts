import { test } from '@japa/runner'
import User from '#models/user'
import GraduationStudent from '#models/graduation_student'

test.group('Graduation Functional', () => {
  test('list graduation students', async ({ client }) => {
    const user = await User.query().where('role', 'super_admin').first()
    if (!user) return

    const response = await client
      .get('/admin/graduation')
      .loginAs(user)

    response.assertStatus(200)
    response.assertInertiaComponent('admin/graduation/index')
  })

  test('update graduation student status', async ({ client, assert }) => {
    const user = await User.query().where('role', 'super_admin').first()
    if (!user) return

    const student = await GraduationStudent.create({
      registrationId: 'REG-001',
      studentName: 'Grad Student',
      schoolOrigin: 'SMP Test',
      status: 'pending'
    })

    const response = await client
      .put(`/admin/graduation/students/${student.id}/status`)
      .form({
        status: 'lulus'
      })
      .loginAs(user)

    response.assertStatus(200)
    
    await student.refresh()
    assert.equal(student.status, 'lulus')
  })
})
