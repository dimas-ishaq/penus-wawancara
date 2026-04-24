import '@adonisjs/inertia/types'

import type { VNodeProps, AllowedComponentProps, ComponentInstance } from 'vue'

type ExtractProps<T> = Omit<
  ComponentInstance<T>['$props'],
  keyof VNodeProps | keyof AllowedComponentProps
>

declare module '@adonisjs/inertia/types' {
  export interface InertiaPages {
    'admin/audit_logs': ExtractProps<(typeof import('../../inertia/pages/admin/audit_logs.vue'))['default']>
    'admin/classes': ExtractProps<(typeof import('../../inertia/pages/admin/classes.vue'))['default']>
    'admin/dashboard': ExtractProps<(typeof import('../../inertia/pages/admin/dashboard.vue'))['default']>
    'admin/graduation': ExtractProps<(typeof import('../../inertia/pages/admin/graduation.vue'))['default']>
    'admin/interviews': ExtractProps<(typeof import('../../inertia/pages/admin/interviews.vue'))['default']>
    'admin/interviews/create': ExtractProps<(typeof import('../../inertia/pages/admin/interviews/create.vue'))['default']>
    'admin/interviews/recap': ExtractProps<(typeof import('../../inertia/pages/admin/interviews/recap.vue'))['default']>
    'admin/majors': ExtractProps<(typeof import('../../inertia/pages/admin/majors.vue'))['default']>
    'admin/settings': ExtractProps<(typeof import('../../inertia/pages/admin/settings.vue'))['default']>
    'admin/users': ExtractProps<(typeof import('../../inertia/pages/admin/users.vue'))['default']>
    'auth/login': ExtractProps<(typeof import('../../inertia/pages/auth/login.vue'))['default']>
    'auth/signup': ExtractProps<(typeof import('../../inertia/pages/auth/signup.vue'))['default']>
    'beranda': ExtractProps<(typeof import('../../inertia/pages/beranda.vue'))['default']>
    'dashboard-ppdb': ExtractProps<(typeof import('../../inertia/pages/dashboard-ppdb.vue'))['default']>
    'errors/not_found': ExtractProps<(typeof import('../../inertia/pages/errors/not_found.vue'))['default']>
    'errors/server_error': ExtractProps<(typeof import('../../inertia/pages/errors/server_error.vue'))['default']>
    'home': ExtractProps<(typeof import('../../inertia/pages/home.vue'))['default']>
    'pengumuman-kelulusan': ExtractProps<(typeof import('../../inertia/pages/pengumuman-kelulusan.vue'))['default']>
    'profil-sekolah': ExtractProps<(typeof import('../../inertia/pages/profil-sekolah.vue'))['default']>
  }
}
