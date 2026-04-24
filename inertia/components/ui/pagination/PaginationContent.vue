<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { PaginationList } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <PaginationList v-slot="{ items }" v-bind="props" :class="cn('flex flex-row items-center gap-1', props.class)">
    <slot :items="items" />
  </PaginationList>
</template>
