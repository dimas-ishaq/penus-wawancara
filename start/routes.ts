/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'
import router from '@adonisjs/core/services/router'

// Stitch Design Pages
router.on('/').renderInertia('beranda', {}).as('home')
router.on('/beranda').renderInertia('beranda', {}).as('beranda')
router.on('/dashboard-ppdb').renderInertia('dashboard-ppdb', {}).as('dashboard-ppdb')
router.on('/pengumuman-kelulusan').renderInertia('pengumuman-kelulusan', {}).as('pengumuman-kelulusan')
router.on('/profil-sekolah').renderInertia('profil-sekolah', {}).as('profil-sekolah')

router
  .group(() => {
    router.get('signup', [controllers.NewAccount, 'create'])
    router.post('signup', [controllers.NewAccount, 'store'])

    router.get('login', [controllers.Session, 'create'])
    router.post('login', [controllers.Session, 'store'])
  })
  .use(middleware.guest())
  
const InterviewsController = () => import('#controllers/admin/interviews_controller')

router.group(() => {
  router.on('/admin/dashboard').renderInertia('admin/dashboard', {}).as('admin.dashboard')
  router.get('/admin/interviews', [InterviewsController, 'index']).as('admin.interviews')
  router.get('/admin/interviews/create', [InterviewsController, 'create']).as('admin.interviews.create')
  router.post('/admin/interviews', [InterviewsController, 'store']).as('admin.interviews.store')
  router.get('/admin/interviews/:id/recap', [InterviewsController, 'editRecap']).as('admin.interviews.edit_recap')
  router.put('/admin/interviews/:id/recap', [InterviewsController, 'updateRecap']).as('admin.interviews.recap')
  router.get('/admin/interviews/:id/pdf', [InterviewsController, 'pdf']).as('admin.interviews.pdf')
  router.get('/admin/interviews/export', [InterviewsController, 'export']).as('admin.interviews.export')
  router.delete('/admin/interviews/:id', [InterviewsController, 'destroy']).as('admin.interviews.destroy')

  // User Management - Super Admin & Admin
  const UsersController = () => import('#controllers/admin/users_controller')
  router.get('/admin/users', [UsersController, 'index'])
    .as('admin.users')
    .use(middleware.role({ allowedRoles: ['super_admin', 'admin'] }))
  router.post('/admin/users', [UsersController, 'store'])
    .as('admin.users.store')
    .use(middleware.role({ allowedRoles: ['super_admin', 'admin'] }))
  router.put('/admin/users/:id', [UsersController, 'update'])
    .as('admin.users.update')
    .use(middleware.role({ allowedRoles: ['super_admin', 'admin'] }))
  router.delete('/admin/users/:id', [UsersController, 'destroy'])
    .as('admin.users.destroy')
    .use(middleware.role({ allowedRoles: ['super_admin', 'admin'] }))

  // Settings - Super Admin Only
  const SettingsController = () => import('#controllers/admin/settings_controller')
  router.get('/admin/settings', [SettingsController, 'index'])
    .as('admin.settings')
    .use(middleware.role({ allowedRoles: ['super_admin'] }))
  router.post('/admin/settings/logo', [SettingsController, 'updateLogo'])
    .as('admin.settings.logo')
    .use(middleware.role({ allowedRoles: ['super_admin'] }))
  router.post('/admin/settings/general', [SettingsController, 'updateGeneral'])
    .as('admin.settings.general')
    .use(middleware.role({ allowedRoles: ['super_admin'] }))

  // Graduation - Super Admin & Admin Only
  const GraduationController = () => import('#controllers/admin/graduation_controller')
  router.get('/admin/graduation', [GraduationController, 'index'])
    .as('admin.graduation')
    .use(middleware.role({ allowedRoles: ['super_admin', 'admin'] }))
  router.post('/admin/graduation/settings', [GraduationController, 'updateSettings'])
    .as('admin.graduation.settings')
    .use(middleware.role({ allowedRoles: ['super_admin', 'admin'] }))
  router.post('/admin/graduation/students/import', [GraduationController, 'importStudents'])
    .as('admin.graduation.import')
    .use(middleware.role({ allowedRoles: ['super_admin', 'admin'] }))
  router.post('/admin/graduation/students/batch-update', [GraduationController, 'batchUpdate'])
    .as('admin.graduation.batch')
    .use(middleware.role({ allowedRoles: ['super_admin', 'admin'] }))
  router.put('/admin/graduation/students/:id/status', [GraduationController, 'updateStudentStatus'])
    .as('admin.graduation.status')
    .use(middleware.role({ allowedRoles: ['super_admin', 'admin'] }))
  router.delete('/admin/graduation/students/:id', [GraduationController, 'destroy'])
    .as('admin.graduation.destroy')
    .use(middleware.role({ allowedRoles: ['super_admin', 'admin'] }))

  // Majors Management
  const MajorsController = () => import('#controllers/admin/majors_controller')
  router.get('/admin/majors', [MajorsController, 'index'])
    .as('admin.majors')
    .use(middleware.role({ allowedRoles: ['super_admin', 'admin'] }))
  router.post('/admin/majors', [MajorsController, 'store'])
    .as('admin.majors.store')
    .use(middleware.role({ allowedRoles: ['super_admin', 'admin'] }))
  router.put('/admin/majors/:id', [MajorsController, 'update'])
    .as('admin.majors.update')
    .use(middleware.role({ allowedRoles: ['super_admin', 'admin'] }))
  router.delete('/admin/majors/:id', [MajorsController, 'destroy'])
    .as('admin.majors.destroy')
    .use(middleware.role({ allowedRoles: ['super_admin', 'admin'] }))
}).use(middleware.auth())

router.post('/pengumuman-kelulusan/check', [() => import('#controllers/graduation_check_controller'), 'check'])
  .as('graduation.check')

router
  .group(() => {
    router.post('logout', [controllers.Session, 'destroy'])
  })
  .use(middleware.auth())
