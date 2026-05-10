import { test } from '@japa/runner'
import User from '#models/user'
import Interview from '#models/interview'

test.group('Interviews Functional', (group) => {
  test('list interviews for authenticated user', async ({ client }) => {
    const user = await User.first()
    if (!user) return

    const response = await client
      .get('/admin/interviews')
      .loginAs(user)

    response.assertStatus(200)
    response.assertInertiaComponent('admin/interviews')
  })

  test('create new interview', async ({ client, assert }) => {
    const user = await User.first()
    if (!user) return

    const response = await client
      .post('/admin/interviews')
      .form({
        studentName: 'John Doe',
        schoolOrigin: 'SMP Testing'
      })
      .loginAs(user)

    response.assertStatus(200) // Redirect
    
    const interview = await Interview.query().where('studentName', 'John Doe').first()
    assert.exists(interview)
    assert.equal(interview?.schoolOrigin, 'Smp Testing') // Capitalized
  })

  test('delete interview', async ({ client, assert }) => {
    const user = await User.first()
    if (!user) return

    const interview = await Interview.create({
      id: 'TEST-001',
      studentName: 'To Be Deleted',
      schoolOrigin: 'Testing School',
      status: 'Pending',
      userId: user.id
    })

    const response = await client
      .delete(`/admin/interviews/${interview.id}`)
      .loginAs(user)

    response.assertStatus(200)
    
    const deleted = await Interview.find('TEST-001')
    assert.isNull(deleted)
  })
})
