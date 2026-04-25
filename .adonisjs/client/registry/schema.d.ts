/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ExtractBody, ExtractErrorResponse, ExtractQuery, ExtractQueryForGet, ExtractResponse } from '@tuyau/core/types'
import type { InferInput, SimpleError } from '@vinejs/vine/types'

export type ParamValue = string | number | bigint | boolean

export interface Registry {
  'home': {
    methods: ["GET","HEAD"]
    pattern: '/'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'beranda': {
    methods: ["GET","HEAD"]
    pattern: '/beranda'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'dashboard-ppdb': {
    methods: ["GET","HEAD"]
    pattern: '/dashboard-ppdb'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'pengumuman-kelulusan': {
    methods: ["GET","HEAD"]
    pattern: '/pengumuman-kelulusan'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'profil-sekolah': {
    methods: ["GET","HEAD"]
    pattern: '/profil-sekolah'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'session.create': {
    methods: ["GET","HEAD"]
    pattern: '/login'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/session_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/session_controller').default['create']>>>
    }
  }
  'session.store': {
    methods: ["POST"]
    pattern: '/login'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/session_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/session_controller').default['store']>>>
    }
  }
  'admin.dashboard': {
    methods: ["GET","HEAD"]
    pattern: '/admin/dashboard'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/dashboard_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/dashboard_controller').default['index']>>>
    }
  }
  'admin.interviews': {
    methods: ["GET","HEAD"]
    pattern: '/admin/interviews'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/interviews_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/interviews_controller').default['index']>>>
    }
  }
  'admin.interviews.create': {
    methods: ["GET","HEAD"]
    pattern: '/admin/interviews/create'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/interviews_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/interviews_controller').default['create']>>>
    }
  }
  'admin.interviews.store': {
    methods: ["POST"]
    pattern: '/admin/interviews'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/interviews_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/interviews_controller').default['store']>>>
    }
  }
  'admin.interviews.edit_recap': {
    methods: ["GET","HEAD"]
    pattern: '/admin/interviews/:id/recap'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/interviews_controller').default['editRecap']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/interviews_controller').default['editRecap']>>>
    }
  }
  'admin.interviews.recap': {
    methods: ["PUT"]
    pattern: '/admin/interviews/:id/recap'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/interview').updateRecapValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/interview').updateRecapValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/interviews_controller').default['updateRecap']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/interviews_controller').default['updateRecap']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.interviews.pdf': {
    methods: ["GET","HEAD"]
    pattern: '/admin/interviews/:id/pdf'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/interviews_controller').default['pdf']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/interviews_controller').default['pdf']>>>
    }
  }
  'admin.interviews.export': {
    methods: ["GET","HEAD"]
    pattern: '/admin/interviews/export'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/interviews_controller').default['export']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/interviews_controller').default['export']>>>
    }
  }
  'admin.interviews.import': {
    methods: ["POST"]
    pattern: '/admin/interviews/import'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/interviews_controller').default['importInterviews']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/interviews_controller').default['importInterviews']>>>
    }
  }
  'admin.interviews.destroy': {
    methods: ["DELETE"]
    pattern: '/admin/interviews/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/interviews_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/interviews_controller').default['destroy']>>>
    }
  }
  'admin.users': {
    methods: ["GET","HEAD"]
    pattern: '/admin/users'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/users_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/users_controller').default['index']>>>
    }
  }
  'admin.users.store': {
    methods: ["POST"]
    pattern: '/admin/users'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/users_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/users_controller').default['store']>>>
    }
  }
  'admin.users.update': {
    methods: ["PUT"]
    pattern: '/admin/users/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/users_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/users_controller').default['update']>>>
    }
  }
  'admin.users.destroy': {
    methods: ["DELETE"]
    pattern: '/admin/users/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/users_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/users_controller').default['destroy']>>>
    }
  }
  'admin.settings': {
    methods: ["GET","HEAD"]
    pattern: '/admin/settings'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/settings_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/settings_controller').default['index']>>>
    }
  }
  'admin.settings.logo': {
    methods: ["POST"]
    pattern: '/admin/settings/logo'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/settings_controller').default['updateLogo']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/settings_controller').default['updateLogo']>>>
    }
  }
  'admin.settings.general': {
    methods: ["POST"]
    pattern: '/admin/settings/general'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/settings_controller').default['updateGeneral']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/settings_controller').default['updateGeneral']>>>
    }
  }
  'admin.graduation': {
    methods: ["GET","HEAD"]
    pattern: '/admin/graduation'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/graduation_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/graduation_controller').default['index']>>>
    }
  }
  'admin.graduation.settings': {
    methods: ["POST"]
    pattern: '/admin/graduation/settings'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/graduation_controller').default['updateSettings']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/graduation_controller').default['updateSettings']>>>
    }
  }
  'admin.graduation.import': {
    methods: ["POST"]
    pattern: '/admin/graduation/students/import'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/graduation_controller').default['importStudents']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/graduation_controller').default['importStudents']>>>
    }
  }
  'admin.graduation.batch': {
    methods: ["POST"]
    pattern: '/admin/graduation/students/batch-update'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/graduation_controller').default['batchUpdate']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/graduation_controller').default['batchUpdate']>>>
    }
  }
  'admin.graduation.status': {
    methods: ["PUT"]
    pattern: '/admin/graduation/students/:id/status'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/graduation_controller').default['updateStudentStatus']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/graduation_controller').default['updateStudentStatus']>>>
    }
  }
  'admin.graduation.destroy': {
    methods: ["DELETE"]
    pattern: '/admin/graduation/students/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/graduation_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/graduation_controller').default['destroy']>>>
    }
  }
  'admin.majors': {
    methods: ["GET","HEAD"]
    pattern: '/admin/majors'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/majors_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/majors_controller').default['index']>>>
    }
  }
  'admin.majors.store': {
    methods: ["POST"]
    pattern: '/admin/majors'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/majors_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/majors_controller').default['store']>>>
    }
  }
  'admin.majors.update': {
    methods: ["PUT"]
    pattern: '/admin/majors/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/majors_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/majors_controller').default['update']>>>
    }
  }
  'admin.majors.destroy': {
    methods: ["DELETE"]
    pattern: '/admin/majors/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/majors_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/majors_controller').default['destroy']>>>
    }
  }
  'admin.classes': {
    methods: ["GET","HEAD"]
    pattern: '/admin/classes'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/classes_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/classes_controller').default['index']>>>
    }
  }
  'admin.classes.store': {
    methods: ["POST"]
    pattern: '/admin/classes'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/classes_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/classes_controller').default['store']>>>
    }
  }
  'admin.classes.update': {
    methods: ["PUT"]
    pattern: '/admin/classes/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/classes_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/classes_controller').default['update']>>>
    }
  }
  'admin.classes.destroy': {
    methods: ["DELETE"]
    pattern: '/admin/classes/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/classes_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/classes_controller').default['destroy']>>>
    }
  }
  'admin.audit_logs': {
    methods: ["GET","HEAD"]
    pattern: '/admin/audit-logs'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/audit_logs_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/audit_logs_controller').default['index']>>>
    }
  }
  'admin.backups': {
    methods: ["GET","HEAD"]
    pattern: '/admin/backups'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/backups_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/backups_controller').default['index']>>>
    }
  }
  'admin.backups.store': {
    methods: ["POST"]
    pattern: '/admin/backups'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/backups_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/backups_controller').default['store']>>>
    }
  }
  'admin.backups.download': {
    methods: ["GET","HEAD"]
    pattern: '/admin/backups/download/:name'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { name: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/backups_controller').default['download']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/backups_controller').default['download']>>>
    }
  }
  'admin.backups.destroy': {
    methods: ["DELETE"]
    pattern: '/admin/backups/:name'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { name: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/backups_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/backups_controller').default['destroy']>>>
    }
  }
  'graduation.check': {
    methods: ["POST"]
    pattern: '/pengumuman-kelulusan/check'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/graduation_check_controller').default['check']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/graduation_check_controller').default['check']>>>
    }
  }
  'session.destroy': {
    methods: ["POST"]
    pattern: '/logout'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/session_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/session_controller').default['destroy']>>>
    }
  }
}
