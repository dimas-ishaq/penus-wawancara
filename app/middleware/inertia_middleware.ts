import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import UserTransformer from '#transformers/user_transformer'
import BaseInertiaMiddleware from '@adonisjs/inertia/inertia_middleware'
import Setting from '#models/setting'

export default class InertiaMiddleware extends BaseInertiaMiddleware {
  async share(ctx: HttpContext) {
    /**
     * The share method is called everytime an Inertia page is rendered. In
     * certain cases, a page may get rendered before the session middleware
     * or the auth middleware are executed. For example: During a 404 request.
     *
     * In that case, we must always assume that HttpContext is not fully hydrated
     * with all the properties
     */
    const { session, auth } = ctx as Partial<HttpContext>

    /**
     * Fetching the first error from the flash messages
     */
    const error = session?.flashMessages.get('error') as string
    const success = session?.flashMessages.get('success') as string

    // Retrieve global settings
    let logo: string | undefined = undefined
    let academicYear: string | undefined = undefined
    let announcementDate: string | undefined = undefined
    let brandName: string = 'SMK PLUS PN'

    try {
      logo = (await Setting.get('logo_path')) ?? undefined
      academicYear = (await Setting.get('academic_year', '2024/2025')) ?? undefined
      announcementDate = (await Setting.get('graduation_announcement_at')) ?? undefined
      brandName = (await Setting.get('brand_name', 'SMK PLUS PN')) ?? 'SMK PLUS PN'
    } catch (e) {
      // Database might not be ready or table might not exist yet
    }
    
    /**
     * Data shared with all Inertia pages. Make sure you are using
     * transformers for rich data-types like Models.
     */
    return {
      errors: ctx.inertia.always(this.getValidationErrors(ctx)),
      flash: ctx.inertia.always({
        error,
        success,
      }),
      user: ctx.inertia.always(auth?.user ? UserTransformer.transform(auth.user) : undefined),
      logo: ctx.inertia.always(logo || undefined),
      academicYear: ctx.inertia.always(academicYear || undefined),
      announcementDate: ctx.inertia.always(announcementDate || undefined),
      brandName: ctx.inertia.always(brandName),
    }
  }

  async handle(ctx: HttpContext, next: NextFn) {
    await this.init(ctx)

    const output = await next()
    this.dispose(ctx)

    return output
  }
}

declare module '@adonisjs/inertia/types' {
  type MiddlewareSharedProps = InferSharedProps<InertiaMiddleware>
  export interface SharedProps extends MiddlewareSharedProps {}
}
