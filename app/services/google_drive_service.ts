import { Exception } from '@adonisjs/core/exceptions'
import { google } from 'googleapis'
import Setting from '#models/setting'
import fs from 'node:fs'
import app from '@adonisjs/core/services/app'

export default class GoogleDriveService {
  /**
   * Get Google Drive client
   */
  private static async getDriveClient(configOverride?: any) {
    const type = configOverride?.type || await Setting.get('google_drive_type', 'oauth')
    console.log('Google Drive Auth Type:', type)

    if (type === 'service_account') {
      let clientEmail = configOverride?.clientEmail || await Setting.get('google_drive_client_email')
      let privateKey = configOverride?.privateKey || await Setting.get('google_drive_private_key')

      // Auto-detect if user pasted the whole JSON into one of the fields
      try {
        if (privateKey && (privateKey.startsWith('{') || privateKey.startsWith('{\n'))) {
          const json = JSON.parse(privateKey)
          if (json.private_key) privateKey = json.private_key
          if (json.client_email && !clientEmail) clientEmail = json.client_email
        }
        if (clientEmail && (clientEmail.startsWith('{') || clientEmail.startsWith('{\n'))) {
          const json = JSON.parse(clientEmail)
          if (json.client_email) clientEmail = json.client_email
          if (json.private_key && !privateKey) privateKey = json.private_key
        }
      } catch (e) {
        // Not a JSON, continue
      }

      if (!clientEmail || !privateKey) {
        console.warn('Service Account credentials missing')
        return null
      }
      
      const auth = new google.auth.JWT({
        email: clientEmail,
        key: privateKey.replace(/\\n/g, '\n'),
        scopes: ['https://www.googleapis.com/auth/drive']
      })

      await auth.authorize()

      return google.drive({ version: 'v3', auth })
    }

    // Default: OAuth2
    const clientId = configOverride?.clientId || await Setting.get('google_drive_client_id')
    const clientSecret = configOverride?.clientSecret || await Setting.get('google_drive_client_secret')
    const refreshToken = configOverride?.refreshToken || await Setting.get('google_drive_refresh_token')

    if (!clientId || !clientSecret || !refreshToken) {
      console.warn('OAuth2 credentials missing')
      return null
    }

    const oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      `${process.env.APP_URL}/admin/settings/google-drive/callback`
    )
    oauth2Client.setCredentials({ refresh_token: refreshToken })

    return google.drive({ version: 'v3', auth: oauth2Client })
  }

  /**
   * Get Auth URL for OAuth2 flow
   */
  static async getAuthUrl(configOverride?: any) {
    const clientId = configOverride?.clientId || await Setting.get('google_drive_client_id')
    const clientSecret = configOverride?.clientSecret || await Setting.get('google_drive_client_secret')
    
    if (!clientId || !clientSecret) {
      throw new Error('Client ID dan Client Secret harus diisi terlebih dahulu.')
    }

    const oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      `${process.env.APP_URL}/admin/settings/google-drive/callback`
    )

    return oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/drive.file', 'https://www.googleapis.com/auth/drive.readonly', 'https://www.googleapis.com/auth/drive.metadata.readonly'],
      prompt: 'consent'
    })
  }

  /**
   * Get Tokens from Auth Code
   */
  static async getTokensFromCode(code: string, configOverride?: any) {
    const clientId = configOverride?.clientId || await Setting.get('google_drive_client_id')
    const clientSecret = configOverride?.clientSecret || await Setting.get('google_drive_client_secret')

    const oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      `${process.env.APP_URL}/admin/settings/google-drive/callback`
    )

    const { tokens } = await oauth2Client.getToken(code)
    return tokens
  }

  /**
   * Upload file to Google Drive
   */
  static async upload(file: any, fileName: string, folderId?: string | null) {
    try {
      const drive = await this.getDriveClient()

      // Fallback to local storage if GDrive is not configured
      if (!drive) {
        await file.move(app.makePath('storage', 'uploads', 'agreements'), {
          name: fileName,
          overwrite: true
        })

        return {
          fileUrl: `/storage/uploads/agreements/${fileName}`,
          googleDriveId: `local_${Math.random().toString(36).substring(7)}`,
          fileName: fileName
        }
      }

      // Real GDrive Upload
      console.log('GDrive Uploading to folder:', folderId)
      const requestPayload = {
        requestBody: {
          name: fileName,
          parents: folderId ? [folderId] : []
        },
        media: {
          mimeType: file.headers['content-type'],
          body: fs.createReadStream(file.tmpPath)
        },
        fields: 'id, webViewLink',
        supportsAllDrives: true,
        includeItemsFromAllDrives: true,
      }
      console.log('GDrive Request Payload:', JSON.stringify({ ...requestPayload, media: 'STREAM' }))
      
      const response = await drive.files.create(requestPayload as any)

      return {
        fileUrl: response.data.webViewLink!,
        googleDriveId: response.data.id!,
        fileName: fileName
      }
    } catch (error) {
      console.error('GDrive Upload Error:', error)
      
      const isQuotaError = error.message.includes('Service Accounts do not have storage quota')
      
      if (isQuotaError) {
        console.warn('Quota error detected, falling back to local storage...')
        
        await file.move(app.makePath('storage', 'uploads', 'agreements'), {
          name: fileName,
          overwrite: true
        })

        return {
          fileUrl: `/storage/uploads/agreements/${fileName}`,
          googleDriveId: `local_${Math.random().toString(36).substring(7)}`,
          fileName: fileName
        }
      }
      
      let message = error.message
      if (isQuotaError) {
        message = 'Service Account tidak memiliki kuota penyimpanan. Sistem beralih ke penyimpanan lokal sementara.'
      }
      
      throw new Exception('Gagal mengunggah file ke Google Drive: ' + message)
    }
  }

  /**
   * Delete file from Google Drive
   */
  static async delete(googleDriveId: string) {
    if (googleDriveId.startsWith('local_')) return

    try {
      const drive = await this.getDriveClient()
      if (!drive) return

      await drive.files.delete({
        fileId: googleDriveId
      })
    } catch (error) {
      console.error('GDrive Delete Error:', error)
      // Ignore errors on delete to prevent blocking
    }
  }

  /**
   * Verify Google Drive connection and folder access
   */
  static async verify(folderId?: string | null, configOverride?: any) {
    try {
      const drive = await this.getDriveClient(configOverride)
      if (!drive) {
        throw new Error('Kredensial Google Drive tidak lengkap atau tidak valid.')
      }

      // Check drive info
      const about = await drive.about.get({ fields: 'user' })
      
      let folderInfo = null
      if (folderId) {
        const folder = await drive.files.get({
          fileId: folderId,
          fields: 'id, name, mimeType, owners, capabilities',
          supportsAllDrives: true,
        })
        
        if (folder.data.mimeType !== 'application/vnd.google-apps.folder') {
          throw new Error(`ID ${folderId} bukan merupakan sebuah folder (MimeType: ${folder.data.mimeType}).`)
        }

        const canUpload = folder.data.capabilities?.canAddChildren
        
        folderInfo = {
          id: folder.data.id,
          name: folder.data.name,
          owner: folder.data.owners?.[0]?.emailAddress,
          canUpload: canUpload
        }

        if (!canUpload) {
          throw new Error(`Service Account bisa melihat folder "${folder.data.name}", tapi TIDAK memiliki izin untuk mengunggah file. Pastikan akses diatur sebagai EDITOR.`)
        }
      }

      return {
        success: true,
        user: about.data.user,
        folder: folderInfo
      }
    } catch (error) {
      console.error('GDrive Verification Error:', error)
      throw new Error(error.message || 'Gagal memverifikasi koneksi Google Drive')
    }
  }
}
