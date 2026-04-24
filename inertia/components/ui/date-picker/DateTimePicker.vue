<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { DateFormatter, type DateValue, getLocalTimeZone, parseDate } from '@internationalized/date'
import { Calendar as CalendarIcon, Clock } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
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
  timeStyle: 'short',
})

const dateValue = computed({
  get: () => {
    if (!props.modelValue) return undefined
    try {
      const datePart = props.modelValue.split('T')[0]
      return parseDate(datePart)
    } catch (e) {
      return undefined
    }
  },
  set: (val: DateValue | undefined) => {
    if (val) {
      const timePart = props.modelValue?.includes('T') ? props.modelValue.split('T')[1].substring(0, 5) : '00:00'
      emits('update:modelValue', `${val.toString()}T${timePart}`)
    } else {
      emits('update:modelValue', undefined)
    }
  },
})

const timeValue = computed({
  get: () => {
    if (!props.modelValue || !props.modelValue.includes('T')) return '00:00'
    return props.modelValue.split('T')[1].substring(0, 5)
  },
  set: (val: string) => {
    const datePart = props.modelValue?.split('T')[0] || new Date().toISOString().split('T')[0]
    emits('update:modelValue', `${datePart}T${val}`)
  }
})

const displayValue = computed(() => {
  if (!props.modelValue) return props.placeholder || "Pilih tanggal & waktu"
  try {
    const date = new Date(props.modelValue)
    return df.format(date)
  } catch (e) {
    return props.modelValue
  }
})
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        :class="cn(
          'w-full justify-start text-left font-normal h-10 px-3 border-input bg-background',
          !props.modelValue && 'text-muted-foreground',
          props.class,
        )"
      >
        <CalendarIcon class="mr-2 h-4 w-4" />
        {{ displayValue }}
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0 rounded-xl overflow-hidden border-outline-variant/30 shadow-xl" align="start">
      <Calendar v-model="dateValue" initial-focus />
      <div class="p-3 border-t border-border flex items-center gap-3 bg-muted/20">
        <Clock class="w-4 h-4 text-muted-foreground" />
        <div class="flex-1">
          <Input type="time" v-model="timeValue" class="h-9" />
        </div>
      </div>
    </PopoverContent>
  </Popover>
</template>
