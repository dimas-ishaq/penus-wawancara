<script setup lang="ts">
import { watch, computed } from 'vue'
import { Link, usePage } from '@inertiajs/vue3'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const page = usePage()

const navLinks = computed(() => {
  const links = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: 'dashboard', roles: ['super_admin', 'admin', 'staff'] },
    { name: 'Manajemen Wawancara', href: '/admin/interviews', icon: 'record_voice_over', roles: ['super_admin', 'admin', 'staff'] },
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
    { name: 'Audit Logs', href: '/admin/audit-logs', icon: 'history', roles: ['super_admin'] },
    { name: 'Pencadangan Data', href: '/admin/backups', icon: 'backup', roles: ['super_admin'] },
    { name: 'Pengaturan', href: '/admin/settings', icon: 'settings', roles: ['super_admin'] },
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
      class="fixed inset-y-0 left-0 w-80 bg-surface border-r border-outline-variant flex flex-col z-[70] transition-transform duration-500 ease-in-out lg:sticky lg:translate-x-0 lg:h-screen shadow-2xl lg:shadow-none"
      :class="isOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <div class="p-8 flex-1 flex flex-col min-h-0">
        <Link href="/admin/dashboard" class="flex items-center gap-3 group mb-12 shrink-0">
          <div v-if="page.props.logo" class="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-primary/20 bg-surface-container-lowest p-1">
            <img :src="page.props.logo as string" class="w-full h-full object-contain" />
          </div>
          <div v-else class="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <span class="material-symbols-outlined text-white text-2xl">admin_panel_settings</span>
          </div>
          <div class="flex flex-col">
            <span class="text-primary font-headline font-black text-lg leading-none tracking-tight">ADMIN PANEL</span>
            <span class="text-on-surface-variant font-body font-bold text-[9px] tracking-[0.2em] uppercase leading-none mt-1 text-secondary">{{ page.props.brandName }}</span>
          </div>
        </Link>

        <nav class="space-y-8 flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <!-- Main Group -->
          <div v-if="navLinks.length > 0">
            <p class="text-[10px] font-bold text-outline uppercase tracking-[0.2em] mb-4 ml-2 opacity-60 text-primary">Utama</p>
            <div class="space-y-1.5">
              <Link
                v-for="link in navLinks"
                :key="link.name"
                :href="link.href"
                class="flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group"
                :class="page.url.startsWith(link.href) ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'text-on-surface-variant hover:bg-surface-container-high hover:text-primary'"
              >
                <div class="w-10 h-10 rounded-xl flex items-center justify-center transition-colors shadow-sm"
                  :class="page.url.startsWith(link.href) ? 'bg-primary-foreground/20' : 'bg-surface-container-high group-hover:bg-primary/10'">
                  <span class="material-symbols-outlined text-xl transition-transform group-hover:scale-110"
                    :class="page.url.startsWith(link.href) ? 'text-primary-foreground' : 'text-primary'">{{ link.icon }}</span>
                </div>
                <span class="font-body font-bold tracking-tight text-sm">{{ link.name }}</span>
              </Link>
            </div>
          </div>

          <!-- Academic Group -->
          <div v-if="academicLinks.length > 0">
            <div class="h-px bg-outline-variant/30 mb-6 mx-2"></div>
            <p class="text-[10px] font-bold text-outline uppercase tracking-[0.2em] mb-4 ml-2 opacity-60 text-primary">Data Akademik</p>
            <div class="space-y-1.5">
              <Link
                v-for="link in academicLinks"
                :key="link.name"
                :href="link.href"
                class="flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group"
                :class="page.url.startsWith(link.href) ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'text-on-surface-variant hover:bg-surface-container-high hover:text-primary'"
              >
                <div class="w-10 h-10 rounded-xl flex items-center justify-center transition-colors shadow-sm"
                  :class="page.url.startsWith(link.href) ? 'bg-primary-foreground/20' : 'bg-surface-container-high group-hover:bg-primary/10'">
                  <span class="material-symbols-outlined text-xl transition-transform group-hover:scale-110"
                    :class="page.url.startsWith(link.href) ? 'text-primary-foreground' : 'text-primary'">{{ link.icon }}</span>
                </div>
                <span class="font-body font-bold tracking-tight text-sm">{{ link.name }}</span>
              </Link>
            </div>
          </div>

          <!-- System Group -->
          <div v-if="systemLinks.length > 0">
            <div class="h-px bg-outline-variant/30 mb-6 mx-2"></div>
            <p class="text-[10px] font-bold text-outline uppercase tracking-[0.2em] mb-4 ml-2 opacity-60 text-primary">Sistem & Keamanan</p>
            <div class="space-y-1.5">
              <Link
                v-for="link in systemLinks"
                :key="link.name"
                :href="link.href"
                class="flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group"
                :class="page.url.startsWith(link.href) ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'text-on-surface-variant hover:bg-surface-container-high hover:text-primary'"
              >
                <div class="w-10 h-10 rounded-xl flex items-center justify-center transition-colors shadow-sm"
                  :class="page.url.startsWith(link.href) ? 'bg-primary-foreground/20' : 'bg-surface-container-high group-hover:bg-primary/10'">
                  <span class="material-symbols-outlined text-xl transition-transform group-hover:scale-110"
                    :class="page.url.startsWith(link.href) ? 'text-primary-foreground' : 'text-primary'">{{ link.icon }}</span>
                </div>
                <span class="font-body font-bold tracking-tight text-sm">{{ link.name }}</span>
              </Link>
            </div>
          </div>
        </nav>
      </div>

      <div class="p-8 border-t border-outline-variant/30 bg-surface-container-lowest/50">
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-black uppercase">
            {{ page.props.user?.initials }}
          </div>
          <div class="flex flex-col grow min-w-0">
            <span class="text-sm font-bold text-primary leading-none mb-1 truncate">{{ page.props.user?.fullName }}</span>
            <span class="text-[10px] text-secondary font-black uppercase tracking-widest">{{ page.props.user?.role?.replace('_', ' ') }}</span>
          </div>
          <div class="flex items-center gap-1">
            <Link href="/logout" method="post" as="button" class="p-2 text-outline hover:text-error transition-colors shrink-0">
              <span class="material-symbols-outlined text-xl">logout</span>
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
}
</style>
