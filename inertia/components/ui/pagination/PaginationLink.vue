<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import { PaginationListItem } from 'reka-ui'
import { cn } from '@/lib/utils'
import { Button, type ButtonProps } from '@/components/ui/button'

const props = withDefaults(defineProps<{
  class?: HTMLAttributes['class']
  isActive?: boolean
  value: number
  size?: ButtonProps['size']
}>(), {
  size: 'icon',
})

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props
  return delegated
})
</script>

<template>
  <PaginationListItem v-bind="delegatedProps" as-child>
    <Button
      :class="cn(
        'w-10 h-10',
        props.isActive ? 'bg-primary text-primary-foreground border-primary hover:bg-primary/90' : 'hover:bg-muted',
        props.class,
      )"
      :variant="props.isActive ? 'default' : 'outline'"
      :size="size"
    >
      <slot />
    </Button>
  </PaginationListItem>
</template>
