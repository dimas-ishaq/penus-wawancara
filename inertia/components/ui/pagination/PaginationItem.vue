<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import { PaginationListItem } from 'reka-ui'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const props = defineProps<{
  value: number
  isActive?: boolean
  class?: HTMLAttributes['class']
}>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props
  return delegated
})
</script>

<template>
  <PaginationListItem v-bind="delegatedProps" as-child>
    <Button
      :class="cn(
        'w-10 h-10 rounded-xl font-bold transition-all',
        props.isActive ? 'bg-primary text-primary-foreground border-primary hover:bg-primary/90' : 'hover:bg-muted',
        props.class,
      )"
      :variant="props.isActive ? 'default' : 'outline'"
    >
      <slot />
    </Button>
  </PaginationListItem>
</template>
