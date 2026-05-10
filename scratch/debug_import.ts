import { Ignitor } from '@adonisjs/core'

const APP_ROOT = new URL('../', import.meta.url)

new Ignitor(APP_ROOT)
  .tap((app) => {
    app.booting(async () => {
      console.log('Booting app...')
    })
  })
  .run(async () => {
    try {
      const module = await import('#models/student_agreement_document')
      console.log('Module:', module)
      console.log('Default export:', module.default)
      console.log('Is function:', typeof module.default === 'function')
      if (module.default) {
        console.log('Has boot:', typeof module.default.boot === 'function')
      }
    } catch (error) {
      console.error('Error importing model:', error)
    }
  })
