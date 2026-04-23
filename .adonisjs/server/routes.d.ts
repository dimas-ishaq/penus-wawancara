import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'home': { paramsTuple?: []; params?: {} }
    'beranda': { paramsTuple?: []; params?: {} }
    'dashboard-ppdb': { paramsTuple?: []; params?: {} }
    'pengumuman-kelulusan': { paramsTuple?: []; params?: {} }
    'profil-sekolah': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'admin.dashboard': { paramsTuple?: []; params?: {} }
    'admin.interviews': { paramsTuple?: []; params?: {} }
    'admin.interviews.create': { paramsTuple?: []; params?: {} }
    'admin.interviews.store': { paramsTuple?: []; params?: {} }
    'admin.interviews.edit_recap': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.interviews.recap': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.interviews.pdf': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.interviews.export': { paramsTuple?: []; params?: {} }
    'admin.interviews.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.users': { paramsTuple?: []; params?: {} }
    'admin.users.store': { paramsTuple?: []; params?: {} }
    'admin.users.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.users.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.settings': { paramsTuple?: []; params?: {} }
    'admin.settings.logo': { paramsTuple?: []; params?: {} }
    'admin.settings.general': { paramsTuple?: []; params?: {} }
    'admin.graduation': { paramsTuple?: []; params?: {} }
    'admin.graduation.settings': { paramsTuple?: []; params?: {} }
    'admin.graduation.import': { paramsTuple?: []; params?: {} }
    'admin.graduation.batch': { paramsTuple?: []; params?: {} }
    'admin.graduation.status': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.graduation.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.majors': { paramsTuple?: []; params?: {} }
    'admin.majors.store': { paramsTuple?: []; params?: {} }
    'admin.majors.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.majors.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'graduation.check': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'home': { paramsTuple?: []; params?: {} }
    'beranda': { paramsTuple?: []; params?: {} }
    'dashboard-ppdb': { paramsTuple?: []; params?: {} }
    'pengumuman-kelulusan': { paramsTuple?: []; params?: {} }
    'profil-sekolah': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'admin.dashboard': { paramsTuple?: []; params?: {} }
    'admin.interviews': { paramsTuple?: []; params?: {} }
    'admin.interviews.create': { paramsTuple?: []; params?: {} }
    'admin.interviews.edit_recap': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.interviews.pdf': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.interviews.export': { paramsTuple?: []; params?: {} }
    'admin.users': { paramsTuple?: []; params?: {} }
    'admin.settings': { paramsTuple?: []; params?: {} }
    'admin.graduation': { paramsTuple?: []; params?: {} }
    'admin.majors': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'home': { paramsTuple?: []; params?: {} }
    'beranda': { paramsTuple?: []; params?: {} }
    'dashboard-ppdb': { paramsTuple?: []; params?: {} }
    'pengumuman-kelulusan': { paramsTuple?: []; params?: {} }
    'profil-sekolah': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'admin.dashboard': { paramsTuple?: []; params?: {} }
    'admin.interviews': { paramsTuple?: []; params?: {} }
    'admin.interviews.create': { paramsTuple?: []; params?: {} }
    'admin.interviews.edit_recap': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.interviews.pdf': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.interviews.export': { paramsTuple?: []; params?: {} }
    'admin.users': { paramsTuple?: []; params?: {} }
    'admin.settings': { paramsTuple?: []; params?: {} }
    'admin.graduation': { paramsTuple?: []; params?: {} }
    'admin.majors': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'admin.interviews.store': { paramsTuple?: []; params?: {} }
    'admin.users.store': { paramsTuple?: []; params?: {} }
    'admin.settings.logo': { paramsTuple?: []; params?: {} }
    'admin.settings.general': { paramsTuple?: []; params?: {} }
    'admin.graduation.settings': { paramsTuple?: []; params?: {} }
    'admin.graduation.import': { paramsTuple?: []; params?: {} }
    'admin.graduation.batch': { paramsTuple?: []; params?: {} }
    'admin.majors.store': { paramsTuple?: []; params?: {} }
    'graduation.check': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
  }
  PUT: {
    'admin.interviews.recap': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.users.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.graduation.status': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.majors.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  DELETE: {
    'admin.interviews.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.users.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.graduation.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.majors.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}