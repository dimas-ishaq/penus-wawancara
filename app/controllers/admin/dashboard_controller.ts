import type { HttpContext } from '@adonisjs/core/http'
import Interview from '#models/interview'
import Student from '#models/student'
import AuditLog from '#models/audit_log'
import { DateTime } from 'luxon'

export default class DashboardController {
  async index({ inertia }: HttpContext) {
    // Basic Stats
    const totalPendaftar = await Interview.query().count('* as total')
    const wawancaraSelesai = await Interview.query().where('status', 'Done').count('* as total')
    const belumWawancara = await Interview.query().where('status', 'Pending').count('* as total')
    const siswaLulus = await Student.query().where('status', 'Lulus').count('* as total')

    const stats = [
      { name: 'Total Pendaftar', value: (totalPendaftar[0] as any).$extras.total || '0', icon: 'groups', color: 'bg-primary' },
      { name: 'Wawancara Selesai', value: (wawancaraSelesai[0] as any).$extras.total || '0', icon: 'fact_check', color: 'bg-secondary' },
      { name: 'Belum Wawancara', value: (belumWawancara[0] as any).$extras.total || '0', icon: 'pending_actions', color: 'bg-tertiary-fixed' },
      { name: 'Siswa Lulus', value: (siswaLulus[0] as any).$extras.total || '0', icon: 'military_tech', color: 'bg-primary-fixed' },
    ]

    // Recent Activities
    const recentActivities = await AuditLog.query()
      .preload('user')
      .orderBy('createdAt', 'desc')
      .limit(5)

    const serializedActivities = recentActivities.map(log => ({
      id: log.id,
      user: log.user?.fullName || log.user?.email || 'Sistem',
      action: log.action,
      student: log.details || '',
      time: log.createdAt?.toRelative() || 'Baru saja'
    }))

    // Chart: Registration Trend (Last 7 Days)
    const sevenDaysAgo = DateTime.now().minus({ days: 6 }).startOf('day')
    const trendData = await Interview.query()
      .where('createdAt', '>=', sevenDaysAgo.toSQL())
      .select('createdAt')
      .orderBy('createdAt', 'asc')

    const days = []
    const counts = []
    for (let i = 6; i >= 0; i--) {
      const day = DateTime.now().minus({ days: i })
      days.push(day.toFormat('ccc'))
      
      const count = trendData.filter(d => d.createdAt && d.createdAt.hasSame(day, 'day')).length
      counts.push(count)
    }

    // Chart: Interview Status Distribution
    const statusCounts = await Interview.query()
      .select('status')
      .count('* as total')
      .groupBy('status')

    const statusLabels = ['Pending', 'Done', 'Canceled']
    const statusSeries = statusLabels.map(label => {
      const found = statusCounts.find(s => s.status === label)
      return found ? Number((found as any).$extras.total) : 0
    })

    // Chart: Information Source Analysis
    const sourceCounts = await Interview.query()
      .select('infoSource')
      .count('* as total')
      .groupBy('infoSource')
      .orderBy('total', 'desc')

    const sourceLabels = sourceCounts.map(s => s.infoSource || 'Tidak Diketahui')
    const sourceSeries = sourceCounts.map(s => Number((s as any).$extras.total))

    return inertia.render('admin/dashboard', {
      stats,
      recentActivities: serializedActivities,
      charts: {
        registrationTrend: {
          categories: days,
          series: [{ name: 'Pendaftar Baru', data: counts }]
        },
        interviewStatus: {
          labels: statusLabels,
          series: statusSeries
        },
        infoSource: {
          labels: sourceLabels,
          series: sourceSeries
        }
      }
    })
  }
}
