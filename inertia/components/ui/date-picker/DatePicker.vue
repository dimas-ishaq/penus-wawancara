<script setup lang="ts">
import { computed } from 'vue'
import { DateFormatter, type DateValue, getLocalTimeZone, parseDate } from '@internationalized/date'
import { Calendar as CalendarIcon } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

const props = defineProps<{
  modelValue?: string
  placeholder?: string
  class?: string
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', value: string | undefined): void
}>()

const df = new DateFormatter('id-ID', {
  dateStyle: 'long',
})

const value = computed({
  get: () => {
    if (!props.modelValue) return undefined
    try {
      return parseDate(props.modelValue)
    } catch (e) {
      return undefined
    }
  },
  set: (val: DateValue | undefined) => {
    emits('update:modelValue', val?.toString())
  },
})
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        :class="cn(
          'w-full justify-start text-left font-normal h-12 px-4 rounded-2xl border-outline-variant/20 bg-surface-container-low',
          !value && 'text-muted-foreground',
          props.class,
        )"
      >
        <CalendarIcon class="mr-2 h-4 w-4" />
        {{ value ? df.format(value.toDate(getLocalTimeZone())) : (props.placeholder || "Pilih tanggal") }}
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0 rounded-2xl overflow-hidden border-outline-variant/30 shadow-xl">
      <Calendar v-model="value" initial-focus />
    </PopoverContent>
  </Popover>
</template>
