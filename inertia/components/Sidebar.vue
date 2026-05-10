<script setup lang="ts">
import { watch, computed } from 'vue'
import { Link, usePage } from '@inertiajs/vue3'

const props = defineProps<{
  isOpen: boolean
  collapsed?: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'toggleCollapse'): void
}>()

const page = usePage()

const navLinks = computed(() => {
  const links = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: 'dashboard', roles: ['super_admin', 'admin', 'staff'] },
    { name: 'Manajemen Wawancara', href: '/admin/interviews', icon: 'record_voice_over', roles: ['super_admin', 'admin', 'staff'] },
    { name: 'Surat Perjanjian', href: '/agreement-documents', icon: 'description', roles: ['super_admin', 'admin', 'staff'] },
    { name: 'Profil Saya', href: '/admin/profile', icon: 'person', roles: ['super_admin', 'admin', 'staff'] },
  ]
  return links.filter(l => l.roles.includes(page.props.user?.role))
})

const academicLinks = computed(() => {
  const links = [
    { name: 'Siswa & Kelulusan', href: '/admin/graduation', icon: 'school', roles: ['super_admin', 'admin'] },
    { name: 'Manajemen Jurusan', href: '/admin/majors', icon: 'account_tree', roles: ['super_admin', 'admin'] },
    { name: 'Manajemen Kelas', href: '/admin/classes', icon: 'meeting_room', roles: ['super_admin', 'admin'] },
  ]
  return links.filter(l => l.roles.includes(page.props.user?.role))
})

const systemLinks = computed(() => {
  const links = [
    { name: 'Akun & Hak Akses (RBAC)', href: '/admin/users', icon: 'manage_accounts', roles: ['super_admin', 'admin'] },
    { name: 'Audit Logs', href: '/admin/audit-logs', icon: 'history', roles: ['super_admin', 'admin'] },
    { name: 'Pencadangan Data', href: '/admin/backups', icon: 'backup', roles: ['super_admin', 'admin'] },
    { name: 'Pengaturan', href: '/admin/settings', icon: 'settings', roles: ['super_admin', 'admin'] },
  ]
  return links.filter(l => l.roles.includes(page.props.user?.role))
})

// Close sidebar on navigation (mobile)
watch(() => page.url, () => {
  emit('close')
})
</script>

<template>
  <div>
    <!-- Sidebar Mobile Backdrop -->
    <div 
      v-if="isOpen" 
      class="fixed inset-0 bg-primary/60 backdrop-blur-sm z-[60] lg:hidden animate-fade-in"
      @click="emit('close')"
    ></div>

    <!-- Sidebar -->
    <aside 
      class="fixed inset-y-0 left-0 bg-surface-container-lowest border-r border-outline-variant/30 flex flex-col z-[70] transition-all duration-500 ease-in-out lg:sticky lg:translate-x-0 lg:h-screen shadow-2xl lg:shadow-none"
      :class="[
        isOpen ? 'translate-x-0' : '-translate-x-full',
        collapsed ? 'w-24' : 'w-72'
      ]"
    >
      <!-- Premium Overlay for depth -->
      <div class="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5 pointer-events-none"></div>

      <div class="p-5 sm:p-6 flex-1 flex flex-col min-h-0 relative z-10" :class="collapsed ? 'items-center px-0' : ''">
        <div class="flex items-center justify-between mb-10 shrink-0 w-full" :class="collapsed ? 'justify-center' : ''">
          <Link href="/admin/dashboard" class="flex items-center gap-3 group overflow-hidden">
            <div v-if="page.props.logo" class="w-12 h-12 rounded-xl overflow-hidden shadow-lg shadow-primary/10 bg-white p-1.5 shrink-0 transition-transform group-hover:scale-105">
              <img :src="page.props.logo as string" class="w-full h-full object-contain" />
            </div>
            <div v-else class="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 shrink-0 transition-transform group-hover:rotate-6">
              <span class="material-symbols-outlined text-white text-3xl">admin_panel_settings</span>
            </div>
            <div v-if="!collapsed" class="flex flex-col animate-in fade-in slide-in-from-left-4 duration-500">
              <span class="text-primary font-headline font-black text-lg leading-none tracking-tighter uppercase">{{ page.props.brandShortName || 'PENUS' }}</span>
              <span class="text-on-surface-variant font-body font-bold text-[10px] tracking-[0.1em] uppercase leading-none mt-1.5 opacity-70 whitespace-nowrap overflow-hidden text-ellipsis">{{ page.props.brandName || 'SMK PLUS PELITA NUSANTARA' }}</span>
            </div>
          </Link>

          <button v-if="!collapsed" @click="emit('close')" class="lg:hidden w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all">
            <span class="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <nav class="space-y-8 flex-1 overflow-y-auto pr-0 custom-scrollbar w-full">
          <!-- Nav Groups Helper -->
          <template v-for="(group, gIdx) in [
            { label: 'Utama', links: navLinks },
            { label: 'Data Akademik', links: academicLinks },
            { label: 'Sistem & Keamanan', links: systemLinks }
          ]" :key="gIdx">
            <div v-if="group.links.length > 0">
              <div v-if="gIdx > 0" class="h-px bg-outline-variant/20 mb-6 mx-2" :class="collapsed ? 'mx-6' : ''"></div>
              <p v-if="!collapsed" class="text-[10px] font-black text-outline-variant uppercase tracking-[0.25em] mb-4 ml-4 animate-in fade-in duration-500">
                {{ group.label }}
              </p>
              
              <div class="space-y-1.5" :class="collapsed ? 'flex flex-col items-center' : ''">
                <Link
                  v-for="link in group.links"
                  :key="link.name"
                  :href="link.href"
                  class="relative flex items-center gap-3.5 py-3 rounded-xl transition-all duration-300 group overflow-hidden"
                  :class="[
                    page.url.startsWith(link.href) 
                      ? 'bg-primary text-primary-foreground shadow-xl shadow-primary/20' 
                      : 'text-on-surface-variant hover:bg-primary/5 hover:text-primary',
                    collapsed ? 'w-12 h-12 px-0 justify-center rounded-xl' : 'px-3.5 w-full'
                  ]"
                  :title="collapsed ? link.name : ''"
                >
                  <!-- Active Indicator Bar -->
                  <div v-if="page.url.startsWith(link.href) && !collapsed" 
                    class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full"></div>

                  <div class="w-12 h-12 rounded-xl flex items-center justify-center transition-all shadow-sm shrink-0"
                    :class="[
                      page.url.startsWith(link.href) 
                        ? 'bg-white/20' 
                        : 'bg-surface-container-high group-hover:bg-primary/10',
                      collapsed && page.url.startsWith(link.href) ? 'scale-100' : ''
                    ]">
                    <span class="material-symbols-outlined text-xl transition-transform group-hover:scale-110"
                      :class="page.url.startsWith(link.href) ? 'text-primary-foreground' : 'text-primary'">{{ link.icon }}</span>
                  </div>
                  
                  <span v-if="!collapsed" 
                    class="font-body font-bold tracking-tight text-[13px] truncate animate-in fade-in slide-in-from-left-4 duration-500"
                    :class="page.url.startsWith(link.href) ? 'font-black' : ''">
                    {{ link.name }}
                  </span>
                </Link>
              </div>
            </div>
          </template>
        </nav>
      </div>

      <!-- User Profile Area -->
      <div class="p-5 border-t border-outline-variant/20 bg-surface-container-low/30 backdrop-blur-sm relative z-10">
        <div class="flex items-center gap-3.5" :class="collapsed ? 'flex-col gap-5 items-center' : ''">
          <div class="w-12 h-12 rounded-xl bg-secondary text-secondary-foreground flex items-center justify-center font-black text-lg uppercase shrink-0 shadow-lg border border-white/10 transition-transform hover:scale-105 cursor-pointer">
            {{ page.props.user?.initials }}
          </div>
          <div v-if="!collapsed" class="flex flex-col grow min-w-0 animate-in fade-in slide-in-from-left-4 duration-500">
            <span class="text-[13.5px] font-black text-primary leading-none mb-1 truncate">{{ page.props.user?.fullName }}</span>
            <div class="flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span class="text-[8.5px] text-on-surface-variant font-black uppercase tracking-[0.2em] opacity-60">{{ page.props.user?.role?.replace('_', ' ') }}</span>
            </div>
          </div>
          <div class="flex items-center" :class="collapsed ? 'w-full justify-center' : 'gap-1'">
            <Link href="/logout" method="post" as="button" 
              class="w-10 h-10 rounded-xl flex items-center justify-center text-outline-variant hover:text-error hover:bg-error/10 transition-all shrink-0" 
              title="Keluar dari sistem">
              <span class="material-symbols-outlined text-xl">power_settings_new</span>
            </Link>
          </div>
        </div>
      </div>
    </aside>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: var(--outline-variant);
  border-radius: 10px;
  opacity: 0.3;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: var(--primary);
}
</style>
