G:\Project\Javascript\app_wawancara\inertia\composables\useAutosave.ts
```

```typescript#L1-195
import { ref, watch, onBeforeUnmount, type Ref } from 'vue'
import { DateTime } from 'luxon'
import { toast } from 'vue-sonner'

interface AutosaveOptions {
  /** Unique key for localStorage */
  storageKey: string
  /** Debounce delay in ms (default 5000 = 5 detik) */
  debounceMs?: number
  /** Interval to check for unsaved changes in ms (default 30000 = 30 detik) */
  checkIntervalMs?: number
  /** Show toast notification on auto-save (default true) */
  showToast?: boolean
  /** Toast message prefix (default 'Draft tersimpan') */
  toastPrefix?: string
}

interface SavedDraft {
  interviewId: string
  formData: any
  savedAt: string
  studentName: string
}

export function useAutosave(
  formData: Ref<any>,
  interviewId: string,
  options: AutosaveOptions
) {
  const {
    storageKey,
    debounceMs = 5000,
    checkIntervalMs = 30000,
    showToast = true,
    toastPrefix = 'Draft tersimpan',
  } = options

  // --- State ---
  const hasUnsavedChanges = ref(false)
  const isSavingDraft = ref(false)
  const lastSavedAt = ref<string | null>(null)
  const showUnsavedNotification = ref(false)
  const autoSaveTimer = ref<ReturnType<typeof setTimeout> | null>(null)
  const notificationTimer = ref<ReturnType<typeof setTimeout> | null>(null)
  const checkUnsavedTimer = ref<ReturnType<typeof setInterval> | null>(null)

  // --- Helpers ---
  const _getDraftFromStorage = (): SavedDraft | null => {
    try {
      const raw = localStorage.getItem(storageKey)
      if (!raw) return null
      const parsed: SavedDraft = JSON.parse(raw)
      // Validate interviewId match
      if (parsed.interviewId !== interviewId) return null
      return parsed
    } catch {
      return null
    }
  }

  const _saveToStorage = (data: any) => {
    try {
      const draft: SavedDraft = {
        interviewId,
        formData: data,
        savedAt: DateTime.now().toISO()!,
        studentName: data.studentName || '',
      }
      localStorage.setItem(storageKey, JSON.stringify(draft))
      lastSavedAt.value = draft.savedAt
    } catch {
      // localStorage quota exceeded or unavailable — silently ignore
    }
  }

  const _clearStorage = () => {
    localStorage.removeItem(storageKey)
  }

  const _formatLastSaved = (isoString: string | null): string => {
    if (!isoString) return ''
    const dt = DateTime.fromISO(isoString)
    return dt.toLocaleString(DateTime.TIME_24_SIMPLE)
  }

  // --- Auto-save trigger ---
  const triggerAutosave = () => {
    // Clear pending timer
    if (autoSaveTimer.value) {
      clearTimeout(autoSaveTimer.value)
      autoSaveTimer.value = null
    }

    hasUnsavedChanges.value = true
    showUnsavedNotification.value = true

    // Clear notification timer
    if (notificationTimer.value) {
      clearTimeout(notificationTimer.value)
      notificationTimer.value = null
    }

    autoSaveTimer.value = setTimeout(async () => {
      await performAutosave()
    }, debounceMs)
  }

  const performAutosave = async () => {
    if (isSavingDraft.value) return

    isSavingDraft.value = true

    try {
      // Save to localStorage
      _saveToStorage(formData.value)

      hasUnsavedChanges.value = false

      if (showToast) {
        toast.success(`${toastPrefix} pada ${_formatLastSaved(lastSavedAt.value)}`, {
          duration: 3000,
          position: 'bottom-right',
        })
      }
    } catch (error) {
      console.error('[useAutosave] Failed to autosave:', error)
    } finally {
      isSavingDraft.value = false
    }
  }

  // --- Check if there is a saved draft in storage ---
  const hasSavedDraft = (): boolean => {
    return _getDraftFromStorage() !== null
  }

  // --- Restore draft from storage ---
  const restoreDraft = (): boolean => {
    const draft = _getDraftFromStorage()
    if (!draft) return false

    // Merge saved data into form
    Object.keys(draft.formData).forEach((key) => {
      if (formData.value.hasOwnProperty(key)) {
        formData.value[key] = draft.formData[key]
      }
    })

    toast.success('Draft berhasil dipulihkan', { duration: 3000 })
    return true
  }

  // --- Dismiss restore banner (just clears localStorage) ---
  const dismissDraft = () => {
    _clearStorage()
  }

  // --- Clear draft after successful submission ---
  const clearDraft = () => {
    _clearStorage()
    hasUnsavedChanges.value = false
    lastSavedAt.value = null
    showUnsavedNotification.value = false

    if (autoSaveTimer.value) {
      clearTimeout(autoSaveTimer.value)
      autoSaveTimer.value = null
    }
  }

  // --- Setup watchers ---
  // Watch all fields in formData
  watch(
    () => formData.value,
    () => {
      triggerAutosave()
    },
    { deep: true }
  )

  // --- Periodic check for unsaved changes ---
  checkUnsavedTimer.value = setInterval(() => {
    if (hasUnsavedChanges.value) {
      showUnsavedNotification.value = true
    }
  }, checkIntervalMs)

  // --- Warn before unload if unsaved ---
  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    if (hasUnsavedChanges.value) {
      e.preventDefault()
      e.returnValue = 'Anda memiliki perubahan yang belum disimpan. Yakin ingin pergi?'
      return e.returnValue
    }
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', handleBeforeUnload)
  }

  // --- Cleanup on unmount ---
  onBeforeUnmount(() => {
    // Save any pending changes before leaving
    if (hasUnsavedChanges.value) {
      _saveToStorage(formData.value)
    }

    if (autoSaveTimer.value) clearTimeout(autoSaveTimer.value)
    if (notificationTimer.value) clearTimeout(notificationTimer.value)
    if (checkUnsavedTimer.value) clearInterval(checkUnsavedTimer.value)

    if (typeof window !== 'undefined') {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  })

  return {
    // State
    hasUnsavedChanges,
    isSavingDraft,
    lastSavedAt,
    showUnsavedNotification,
    // Helpers
    hasSavedDraft,
    restoreDraft,
    dismissDraft,
    clearDraft,
    performAutosave,
    // Formatters
    formatLastSaved: _formatLastSaved,
  }
}
