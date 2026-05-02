import Setting from '#models/setting'

async function test() {
  const announcementAt = await Setting.get('graduation_announcement_at')
  const now = new Date()
  
  console.log('--- HASIL PENGUJIAN WAKTU ---')
  console.log('Waktu Server Sekarang:', now.toString())
  console.log('ISO String Server:', now.toISOString())
  console.log('Pengaturan di DB:', announcementAt)
  
  if (announcementAt) {
    const target = new Date(announcementAt)
    console.log('Target Waktu (Parsed):', target.toString())
    console.log('Apakah sudah boleh rilis?', now >= target ? 'YA (Boleh)' : 'TIDAK (Belum Waktunya)')
    console.log('Selisih (ms):', target.getTime() - now.getTime())
  } else {
    console.log('Pengaturan waktu tidak ditemukan (Default rilis).')
  }
}

test().catch(console.error).finally(() => process.exit())
