<script setup lang="ts" generic="TData, TValue">
import {
  FlexRender,
  getCoreRowModel,
  getSortedRowModel,
  useVueTable,
  type ColumnDef,
  type SortingState,
} from '@tanstack/vue-table'
import { ref } from 'vue'

const props = defineProps<{
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}>()

const sorting = ref<SortingState>([])

const table = useVueTable({
  get data() {
    return props.data
  },
  get columns() {
    return props.columns
  },
  state: {
    get sorting() {
      return sorting.value
    },
  },
  onSortingChange: (updaterOrValue) => {
    sorting.value = typeof updaterOrValue === 'function' ? updaterOrValue(sorting.value) : updaterOrValue
  },
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
})
</script>

<template>
  <div class="bg-surface-container-lowest rounded-[2rem] border border-outline-variant/20 shadow-xl overflow-hidden">
    <div class="overflow-x-auto custom-scrollbar">
      <table class="w-full text-left font-body min-w-[800px] lg:min-w-full">
        <thead>
          <tr
            v-for="headerGroup in table.getHeaderGroups()"
            :key="headerGroup.id"
            class="bg-surface-container-high border-b border-outline-variant/30"
          >
            <th
              v-for="header in headerGroup.headers"
              :key="header.id"
              class="px-4 sm:px-8 py-5 text-[10px] font-black tracking-[0.2em] text-outline uppercase select-none group"
              :class="header.column.getCanSort() ? 'cursor-pointer' : ''"
              @click="header.column.getToggleSortingHandler()?.($event)"
            >
              <div class="flex items-center gap-2" :class="header.column.columnDef.meta?.headerClass">
                <FlexRender
                  v-if="!header.isPlaceholder"
                  :render="header.column.columnDef.header"
                  :props="header.getContext()"
                />
                <span
                  v-if="header.column.getCanSort()"
                  class="material-symbols-outlined text-[14px] leading-none opacity-0 group-hover:opacity-100 transition-opacity"
                  :class="{ 'opacity-100 text-primary': header.column.getIsSorted() }"
                >
                  {{
                    header.column.getIsSorted() === 'asc'
                      ? 'stat_1'
                      : header.column.getIsSorted() === 'desc'
                      ? 'stat_minus_1'
                      : 'unfold_more'
                  }}
                </span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-outline-variant/10">
          <tr
            v-for="row in table.getRowModel().rows"
            :key="row.id"
            class="hover:bg-primary/5 transition-colors group"
          >
            <td
              v-for="cell in row.getVisibleCells()"
              :key="cell.id"
              class="px-4 sm:px-8 py-6"
              :class="cell.column.columnDef.meta?.cellClass"
            >
              <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: var(--outline-variant);
  border-radius: 10px;
}
</style>
