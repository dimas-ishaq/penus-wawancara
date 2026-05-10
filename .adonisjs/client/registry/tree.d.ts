/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  home: typeof routes['home']
  beranda: typeof routes['beranda']
  dashboardPpdb: typeof routes['dashboard-ppdb']
  pengumumanKelulusan: typeof routes['pengumuman-kelulusan']
  profilSekolah: typeof routes['profil-sekolah']
  session: {
    create: typeof routes['session.create']
    store: typeof routes['session.store']
    destroy: typeof routes['session.destroy']
  }
  admin: {
    dashboard: typeof routes['admin.dashboard']
    interviews: typeof routes['admin.interviews'] & {
      create: typeof routes['admin.interviews.create']
      store: typeof routes['admin.interviews.store']
      editRecap: typeof routes['admin.interviews.edit_recap']
      recap: typeof routes['admin.interviews.recap']
      reset: typeof routes['admin.interviews.reset']
      pdf: typeof routes['admin.interviews.pdf']
      export: typeof routes['admin.interviews.export']
      import: typeof routes['admin.interviews.import']
      destroy: typeof routes['admin.interviews.destroy']
    }
    profile: typeof routes['admin.profile'] & {
      update: typeof routes['admin.profile.update']
    }
    users: typeof routes['admin.users'] & {
      store: typeof routes['admin.users.store']
      update: typeof routes['admin.users.update']
      destroy: typeof routes['admin.users.destroy']
    }
    settings: typeof routes['admin.settings'] & {
      logo: typeof routes['admin.settings.logo']
      general: typeof routes['admin.settings.general']
      kopSurat: typeof routes['admin.settings.kop_surat']
      googleDrive: typeof routes['admin.settings.google_drive'] & {
        verify: typeof routes['admin.settings.google_drive.verify']
        auth: typeof routes['admin.settings.google_drive.auth']
        callback: typeof routes['admin.settings.google_drive.callback']
      }
      private: typeof routes['admin.settings.private']
    }
    graduation: typeof routes['admin.graduation'] & {
      settings: typeof routes['admin.graduation.settings']
      import: typeof routes['admin.graduation.import']
      students: {
        store: typeof routes['admin.graduation.students.store']
        update: typeof routes['admin.graduation.students.update']
      }
      status: typeof routes['admin.graduation.status']
      destroy: typeof routes['admin.graduation.destroy']
    }
    majors: typeof routes['admin.majors'] & {
      store: typeof routes['admin.majors.store']
      update: typeof routes['admin.majors.update']
      destroy: typeof routes['admin.majors.destroy']
    }
    classes: typeof routes['admin.classes'] & {
      store: typeof routes['admin.classes.store']
      update: typeof routes['admin.classes.update']
      destroy: typeof routes['admin.classes.destroy']
    }
    auditLogs: typeof routes['admin.audit_logs'] & {
      clear: typeof routes['admin.audit_logs.clear']
    }
    backups: typeof routes['admin.backups'] & {
      store: typeof routes['admin.backups.store']
      download: typeof routes['admin.backups.download']
      destroy: typeof routes['admin.backups.destroy']
    }
    agreementDocuments: {
      index: typeof routes['admin.agreement_documents.index']
      search: typeof routes['admin.agreement_documents.search']
      add: typeof routes['admin.agreement_documents.add']
      remove: typeof routes['admin.agreement_documents.remove']
      parentUpload: typeof routes['admin.agreement_documents.parent_upload']
      studentUpload: typeof routes['admin.agreement_documents.student_upload']
      parentDelete: typeof routes['admin.agreement_documents.parent_delete']
      studentDelete: typeof routes['admin.agreement_documents.student_delete']
      export: typeof routes['admin.agreement_documents.export']
    }
  }
  graduation: {
    check: typeof routes['graduation.check']
  }
}
