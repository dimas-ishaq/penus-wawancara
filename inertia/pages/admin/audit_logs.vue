<script setup lang="ts">
import { Head, router } from '@inertiajs/vue3'
import { ref, watch } from 'vue'
import { debounce } from 'lodash-es'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { Search, History } from 'lucide-vue-next'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

const props = defineProps<{
  logs: {
    data: any[]
    meta: any
  }
  search?: string
}>()

const searchQuery = ref(props.search || '')

const handleSearch = debounce((query: string) => {
  router.get('/admin/audit-logs', { search: query }, {
    preserveState: true,
    preserveScroll: true,
    replace: true
  })
}, 300)

watch(searchQuery, (newVal) => {
  handleSearch(newVal)
})

const formatDate = (date: string) => {
  return new Date(date).toLocaleString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getActionVariant = (action: string) => {
  switch (action) {
    case 'created': return 'success'
    case 'updated': return 'info'
    case 'deleted': return 'destructive'
    default: return 'outline'
  }
}
</script>

<template>
  <Head title="Audit Logs - Aktivitas Sistem" />

  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
          <History class="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
          Audit Logs
        </h1>
        <p class="text-muted-foreground mt-1 text-sm">
          Pantau seluruh aktivitas staff dan perubahan data pada sistem secara real-time.
        </p>
      </div>
    </div>

    <Card>
      <CardHeader>
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div class="space-y-1">
            <CardTitle>Log Aktivitas</CardTitle>
            <CardDescription class="text-xs sm:text-sm">Menampilkan 100 aktivitas terbaru.</CardDescription>
          </div>
          <div class="relative w-full lg:w-72">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              v-model="searchQuery"
              type="search"
              placeholder="Cari aktivitas..."
              class="pl-10 h-11 sm:h-10 rounded-xl"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div class="rounded-md border overflow-x-auto">
          <div class="min-w-[800px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead class="w-[180px]">Waktu</TableHead>
                <TableHead>Pengguna</TableHead>
                <TableHead>Aksi</TableHead>
                <TableHead>Detail Aktivitas</TableHead>
                <TableHead class="text-right">Ref ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="log in props.logs.data" :key="log.id">
                <TableCell class="font-mono text-xs">
                  {{ formatDate(log.createdAt) }}
                </TableCell>
                <TableCell>
                  <div class="flex flex-col">
                    <span class="font-medium text-sm">{{ log.user?.fullName || 'System' }}</span>
                    <span class="text-xs text-muted-foreground">{{ log.user?.email || '' }}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge :variant="getActionVariant(log.action)" class="uppercase text-[10px]">
                    {{ log.action }}
                  </Badge>
                </TableCell>
                <TableCell class="max-w-[300px] truncate">
                  {{ log.details || '-' }}
                </TableCell>
                <TableCell class="text-right">
                  <Badge variant="outline" class="font-mono text-[10px]">
                    {{ log.resourceId || '-' }}
                  </Badge>
                </TableCell>
              </TableRow>
              <TableRow v-if="props.logs.data.length === 0">
                <TableCell colspan="5" class="h-24 text-center">
                  Tidak ada aktivitas ditemukan.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>

        <!-- Pagination -->
        <div class="flex flex-col sm:flex-row items-center justify-between gap-6 mt-8 px-2">
          <div class="text-[10px] sm:text-xs text-outline font-bold uppercase tracking-[0.1em] text-center sm:text-left">
            Menampilkan 
            <span class="text-primary">{{ ((props.logs.meta.currentPage - 1) * props.logs.meta.perPage) + 1 }}</span> - 
            <span class="text-primary">{{ Math.min(props.logs.meta.currentPage * props.logs.meta.perPage, props.logs.meta.total) }}</span> 
            dari <span class="text-primary">{{ props.logs.meta.total }}</span> data
          </div>
          
          <Pagination 
            :total="props.logs.meta.total" 
            :sibling-count="1" 
            :show-edges="true" 
            :page="props.logs.meta.currentPage"
            :items-per-page="props.logs.meta.perPage"
            @update:page="(p) => router.get('/admin/audit-logs', { 
              page: p,
              search: searchQuery
            }, { preserveScroll: true, preserveState: true })"
          >
            <PaginationContent v-slot="{ items }" class="flex items-center gap-1">
              <PaginationPrevious />

              <template v-for="(item, index) in items">
                <PaginationItem 
                  v-if="item.type === 'page'" 
                  :key="index" 
                  :value="item.value"
                  :is-active="item.value === props.logs.meta.currentPage"
                >
                  {{ item.value }}
                </PaginationItem>
                <PaginationEllipsis v-else :key="item.type" :index="index" />
              </template>

              <PaginationNext />
            </PaginationContent>
          </Pagination>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
