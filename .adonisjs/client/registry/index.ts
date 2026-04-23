/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'home': {
    methods: ["GET","HEAD"],
    pattern: '/',
    tokens: [{"old":"/","type":0,"val":"/","end":""}],
    types: placeholder as Registry['home']['types'],
  },
  'beranda': {
    methods: ["GET","HEAD"],
    pattern: '/beranda',
    tokens: [{"old":"/beranda","type":0,"val":"beranda","end":""}],
    types: placeholder as Registry['beranda']['types'],
  },
  'dashboard-ppdb': {
    methods: ["GET","HEAD"],
    pattern: '/dashboard-ppdb',
    tokens: [{"old":"/dashboard-ppdb","type":0,"val":"dashboard-ppdb","end":""}],
    types: placeholder as Registry['dashboard-ppdb']['types'],
  },
  'pengumuman-kelulusan': {
    methods: ["GET","HEAD"],
    pattern: '/pengumuman-kelulusan',
    tokens: [{"old":"/pengumuman-kelulusan","type":0,"val":"pengumuman-kelulusan","end":""}],
    types: placeholder as Registry['pengumuman-kelulusan']['types'],
  },
  'profil-sekolah': {
    methods: ["GET","HEAD"],
    pattern: '/profil-sekolah',
    tokens: [{"old":"/profil-sekolah","type":0,"val":"profil-sekolah","end":""}],
    types: placeholder as Registry['profil-sekolah']['types'],
  },
  'new_account.create': {
    methods: ["GET","HEAD"],
    pattern: '/signup',
    tokens: [{"old":"/signup","type":0,"val":"signup","end":""}],
    types: placeholder as Registry['new_account.create']['types'],
  },
  'new_account.store': {
    methods: ["POST"],
    pattern: '/signup',
    tokens: [{"old":"/signup","type":0,"val":"signup","end":""}],
    types: placeholder as Registry['new_account.store']['types'],
  },
  'session.create': {
    methods: ["GET","HEAD"],
    pattern: '/login',
    tokens: [{"old":"/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['session.create']['types'],
  },
  'session.store': {
    methods: ["POST"],
    pattern: '/login',
    tokens: [{"old":"/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['session.store']['types'],
  },
  'admin.dashboard': {
    methods: ["GET","HEAD"],
    pattern: '/admin/dashboard',
    tokens: [{"old":"/admin/dashboard","type":0,"val":"admin","end":""},{"old":"/admin/dashboard","type":0,"val":"dashboard","end":""}],
    types: placeholder as Registry['admin.dashboard']['types'],
  },
  'admin.interviews': {
    methods: ["GET","HEAD"],
    pattern: '/admin/interviews',
    tokens: [{"old":"/admin/interviews","type":0,"val":"admin","end":""},{"old":"/admin/interviews","type":0,"val":"interviews","end":""}],
    types: placeholder as Registry['admin.interviews']['types'],
  },
  'admin.interviews.create': {
    methods: ["GET","HEAD"],
    pattern: '/admin/interviews/create',
    tokens: [{"old":"/admin/interviews/create","type":0,"val":"admin","end":""},{"old":"/admin/interviews/create","type":0,"val":"interviews","end":""},{"old":"/admin/interviews/create","type":0,"val":"create","end":""}],
    types: placeholder as Registry['admin.interviews.create']['types'],
  },
  'admin.interviews.store': {
    methods: ["POST"],
    pattern: '/admin/interviews',
    tokens: [{"old":"/admin/interviews","type":0,"val":"admin","end":""},{"old":"/admin/interviews","type":0,"val":"interviews","end":""}],
    types: placeholder as Registry['admin.interviews.store']['types'],
  },
  'admin.interviews.edit_recap': {
    methods: ["GET","HEAD"],
    pattern: '/admin/interviews/:id/recap',
    tokens: [{"old":"/admin/interviews/:id/recap","type":0,"val":"admin","end":""},{"old":"/admin/interviews/:id/recap","type":0,"val":"interviews","end":""},{"old":"/admin/interviews/:id/recap","type":1,"val":"id","end":""},{"old":"/admin/interviews/:id/recap","type":0,"val":"recap","end":""}],
    types: placeholder as Registry['admin.interviews.edit_recap']['types'],
  },
  'admin.interviews.recap': {
    methods: ["PUT"],
    pattern: '/admin/interviews/:id/recap',
    tokens: [{"old":"/admin/interviews/:id/recap","type":0,"val":"admin","end":""},{"old":"/admin/interviews/:id/recap","type":0,"val":"interviews","end":""},{"old":"/admin/interviews/:id/recap","type":1,"val":"id","end":""},{"old":"/admin/interviews/:id/recap","type":0,"val":"recap","end":""}],
    types: placeholder as Registry['admin.interviews.recap']['types'],
  },
  'admin.interviews.pdf': {
    methods: ["GET","HEAD"],
    pattern: '/admin/interviews/:id/pdf',
    tokens: [{"old":"/admin/interviews/:id/pdf","type":0,"val":"admin","end":""},{"old":"/admin/interviews/:id/pdf","type":0,"val":"interviews","end":""},{"old":"/admin/interviews/:id/pdf","type":1,"val":"id","end":""},{"old":"/admin/interviews/:id/pdf","type":0,"val":"pdf","end":""}],
    types: placeholder as Registry['admin.interviews.pdf']['types'],
  },
  'admin.interviews.export': {
    methods: ["GET","HEAD"],
    pattern: '/admin/interviews/export',
    tokens: [{"old":"/admin/interviews/export","type":0,"val":"admin","end":""},{"old":"/admin/interviews/export","type":0,"val":"interviews","end":""},{"old":"/admin/interviews/export","type":0,"val":"export","end":""}],
    types: placeholder as Registry['admin.interviews.export']['types'],
  },
  'admin.interviews.destroy': {
    methods: ["DELETE"],
    pattern: '/admin/interviews/:id',
    tokens: [{"old":"/admin/interviews/:id","type":0,"val":"admin","end":""},{"old":"/admin/interviews/:id","type":0,"val":"interviews","end":""},{"old":"/admin/interviews/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['admin.interviews.destroy']['types'],
  },
  'admin.users': {
    methods: ["GET","HEAD"],
    pattern: '/admin/users',
    tokens: [{"old":"/admin/users","type":0,"val":"admin","end":""},{"old":"/admin/users","type":0,"val":"users","end":""}],
    types: placeholder as Registry['admin.users']['types'],
  },
  'admin.users.store': {
    methods: ["POST"],
    pattern: '/admin/users',
    tokens: [{"old":"/admin/users","type":0,"val":"admin","end":""},{"old":"/admin/users","type":0,"val":"users","end":""}],
    types: placeholder as Registry['admin.users.store']['types'],
  },
  'admin.users.update': {
    methods: ["PUT"],
    pattern: '/admin/users/:id',
    tokens: [{"old":"/admin/users/:id","type":0,"val":"admin","end":""},{"old":"/admin/users/:id","type":0,"val":"users","end":""},{"old":"/admin/users/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['admin.users.update']['types'],
  },
  'admin.users.destroy': {
    methods: ["DELETE"],
    pattern: '/admin/users/:id',
    tokens: [{"old":"/admin/users/:id","type":0,"val":"admin","end":""},{"old":"/admin/users/:id","type":0,"val":"users","end":""},{"old":"/admin/users/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['admin.users.destroy']['types'],
  },
  'admin.settings': {
    methods: ["GET","HEAD"],
    pattern: '/admin/settings',
    tokens: [{"old":"/admin/settings","type":0,"val":"admin","end":""},{"old":"/admin/settings","type":0,"val":"settings","end":""}],
    types: placeholder as Registry['admin.settings']['types'],
  },
  'admin.settings.logo': {
    methods: ["POST"],
    pattern: '/admin/settings/logo',
    tokens: [{"old":"/admin/settings/logo","type":0,"val":"admin","end":""},{"old":"/admin/settings/logo","type":0,"val":"settings","end":""},{"old":"/admin/settings/logo","type":0,"val":"logo","end":""}],
    types: placeholder as Registry['admin.settings.logo']['types'],
  },
  'admin.settings.general': {
    methods: ["POST"],
    pattern: '/admin/settings/general',
    tokens: [{"old":"/admin/settings/general","type":0,"val":"admin","end":""},{"old":"/admin/settings/general","type":0,"val":"settings","end":""},{"old":"/admin/settings/general","type":0,"val":"general","end":""}],
    types: placeholder as Registry['admin.settings.general']['types'],
  },
  'admin.graduation': {
    methods: ["GET","HEAD"],
    pattern: '/admin/graduation',
    tokens: [{"old":"/admin/graduation","type":0,"val":"admin","end":""},{"old":"/admin/graduation","type":0,"val":"graduation","end":""}],
    types: placeholder as Registry['admin.graduation']['types'],
  },
  'admin.graduation.settings': {
    methods: ["POST"],
    pattern: '/admin/graduation/settings',
    tokens: [{"old":"/admin/graduation/settings","type":0,"val":"admin","end":""},{"old":"/admin/graduation/settings","type":0,"val":"graduation","end":""},{"old":"/admin/graduation/settings","type":0,"val":"settings","end":""}],
    types: placeholder as Registry['admin.graduation.settings']['types'],
  },
  'admin.graduation.import': {
    methods: ["POST"],
    pattern: '/admin/graduation/students/import',
    tokens: [{"old":"/admin/graduation/students/import","type":0,"val":"admin","end":""},{"old":"/admin/graduation/students/import","type":0,"val":"graduation","end":""},{"old":"/admin/graduation/students/import","type":0,"val":"students","end":""},{"old":"/admin/graduation/students/import","type":0,"val":"import","end":""}],
    types: placeholder as Registry['admin.graduation.import']['types'],
  },
  'admin.graduation.batch': {
    methods: ["POST"],
    pattern: '/admin/graduation/students/batch-update',
    tokens: [{"old":"/admin/graduation/students/batch-update","type":0,"val":"admin","end":""},{"old":"/admin/graduation/students/batch-update","type":0,"val":"graduation","end":""},{"old":"/admin/graduation/students/batch-update","type":0,"val":"students","end":""},{"old":"/admin/graduation/students/batch-update","type":0,"val":"batch-update","end":""}],
    types: placeholder as Registry['admin.graduation.batch']['types'],
  },
  'admin.graduation.status': {
    methods: ["PUT"],
    pattern: '/admin/graduation/students/:id/status',
    tokens: [{"old":"/admin/graduation/students/:id/status","type":0,"val":"admin","end":""},{"old":"/admin/graduation/students/:id/status","type":0,"val":"graduation","end":""},{"old":"/admin/graduation/students/:id/status","type":0,"val":"students","end":""},{"old":"/admin/graduation/students/:id/status","type":1,"val":"id","end":""},{"old":"/admin/graduation/students/:id/status","type":0,"val":"status","end":""}],
    types: placeholder as Registry['admin.graduation.status']['types'],
  },
  'admin.graduation.destroy': {
    methods: ["DELETE"],
    pattern: '/admin/graduation/students/:id',
    tokens: [{"old":"/admin/graduation/students/:id","type":0,"val":"admin","end":""},{"old":"/admin/graduation/students/:id","type":0,"val":"graduation","end":""},{"old":"/admin/graduation/students/:id","type":0,"val":"students","end":""},{"old":"/admin/graduation/students/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['admin.graduation.destroy']['types'],
  },
  'admin.majors': {
    methods: ["GET","HEAD"],
    pattern: '/admin/majors',
    tokens: [{"old":"/admin/majors","type":0,"val":"admin","end":""},{"old":"/admin/majors","type":0,"val":"majors","end":""}],
    types: placeholder as Registry['admin.majors']['types'],
  },
  'admin.majors.store': {
    methods: ["POST"],
    pattern: '/admin/majors',
    tokens: [{"old":"/admin/majors","type":0,"val":"admin","end":""},{"old":"/admin/majors","type":0,"val":"majors","end":""}],
    types: placeholder as Registry['admin.majors.store']['types'],
  },
  'admin.majors.update': {
    methods: ["PUT"],
    pattern: '/admin/majors/:id',
    tokens: [{"old":"/admin/majors/:id","type":0,"val":"admin","end":""},{"old":"/admin/majors/:id","type":0,"val":"majors","end":""},{"old":"/admin/majors/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['admin.majors.update']['types'],
  },
  'admin.majors.destroy': {
    methods: ["DELETE"],
    pattern: '/admin/majors/:id',
    tokens: [{"old":"/admin/majors/:id","type":0,"val":"admin","end":""},{"old":"/admin/majors/:id","type":0,"val":"majors","end":""},{"old":"/admin/majors/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['admin.majors.destroy']['types'],
  },
  'graduation.check': {
    methods: ["POST"],
    pattern: '/pengumuman-kelulusan/check',
    tokens: [{"old":"/pengumuman-kelulusan/check","type":0,"val":"pengumuman-kelulusan","end":""},{"old":"/pengumuman-kelulusan/check","type":0,"val":"check","end":""}],
    types: placeholder as Registry['graduation.check']['types'],
  },
  'session.destroy': {
    methods: ["POST"],
    pattern: '/logout',
    tokens: [{"old":"/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['session.destroy']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
