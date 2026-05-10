# Panduan Integrasi Google Drive

Dokumen ini menjelaskan langkah-langkah untuk mendapatkan kredensial yang diperlukan guna mengintegrasikan aplikasi ini dengan Google Drive API.

## 1. Buat Project di Google Cloud Console

1. Buka [Google Cloud Console](https://console.cloud.google.com/).
2. Buat project baru atau pilih project yang sudah ada.
3. Buka menu **APIs & Services > Library**.
4. Cari **Google Drive API** dan klik **Enable**.

## 2. Konfigurasi OAuth Consent Screen

1. Buka menu **APIs & Services > OAuth consent screen**.
2. Pilih User Type **External** (jika tidak menggunakan Google Workspace) atau **Internal**.
3. Isi informasi aplikasi yang diperlukan.
4. Pada bagian **Scopes**, tambahkan scope `https://www.googleapis.com/auth/drive.file` atau `https://www.googleapis.com/auth/drive`.
5. Tambahkan email pengembang ke dalam **Test Users** jika project masih dalam status "Testing".

## 3. Buat Kredensial OAuth 2.0

1. Buka menu **APIs & Services > Credentials**.
2. Klik **Create Credentials > OAuth client ID**.
3. Pilih Application type **Web application**.
4. Tambahkan **Authorized redirect URIs**:
   - `https://developers.google.com/oauthplayground` (untuk mendapatkan Refresh Token pertama kali).
   - `http://localhost:9090/admin/settings/google-drive/callback` (sesuaikan dengan domain Anda).
5. Klik **Create**. Anda akan mendapatkan **Client ID** dan **Client Secret**. Simpan kredensial ini.

## 4. Mendapatkan Refresh Token (via OAuth 2.0 Playground)

Karena aplikasi ini menggunakan akses server-to-server namun tetap memerlukan otorisasi user pertama kali:

1. Buka [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/).
2. Klik ikon gerigi (Settings) di pojok kanan atas.
3. Centang **Use your own OAuth credentials** dan masukkan **Client ID** serta **Client Secret** Anda.
4. Di kolom **Select & authorize APIs**, ketik `https://www.googleapis.com/auth/drive` dan klik **Authorize APIs**.
5. Login dengan akun Google Anda.
6. Klik **Exchange authorization code for tokens**.
7. Anda akan mendapatkan **Refresh Token**. Salin token ini.

## 5. Konfigurasi di Aplikasi

Masukkan data berikut ke dalam menu **Pengaturan > Google Drive** di aplikasi:

- **Client ID**: Dari langkah 3.
- **Client Secret**: Dari langkah 3.
- **Refresh Token**: Dari langkah 4.
- **Folder ID**: ID folder Google Drive tempat dokumen akan disimpan (buka folder di browser, ID adalah bagian terakhir dari URL).

## Metode Alternatif: Service Account (Lebih Mudah)

Jika Anda ingin menghindari kerumitan OAuth Playground dan Refresh Token, gunakan **Service Account**:

1. Buka [Google Cloud Console](https://console.cloud.google.com/).
2. Buka menu **APIs & Services > Credentials**.
3. Klik **Create Credentials > Service Account**.
4. Isi nama service account (misal: `drive-storage`) dan klik **Create and Continue**.
5. Klik **Done**.
6. Klik pada email service account yang baru dibuat, lalu buka tab **Keys**.
7. Klik **Add Key > Create new key**, pilih format **JSON**, lalu klik **Create**. File JSON akan terunduh.
8. Buka file JSON tersebut, Anda akan membutuhkan:
   - `client_email`
   - `private_key`
9. **PENTING**: Buka folder Google Drive Anda di browser, klik **Share**, dan tambahkan email service account (`client_email`) sebagai **Editor**.
10. Masukkan `client_email` dan `private_key` ke pengaturan aplikasi.

---

**Catatan Keamanan**: Jangan pernah membagikan Client Secret, Refresh Token, atau Private Key Service Account kepada pihak yang tidak berwenang.
