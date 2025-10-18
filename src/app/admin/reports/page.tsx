'use client'

import { useEffect, useState } from 'react'
import { REPORT_TYPE_OPTIONS, type ReportType, getReportTypeLabel } from '@/constants/reportTypes'
import { AlertCircle, CheckCircle, XCircle, Clock, Search } from 'lucide-react'

interface Report {
  id: string
  reporter_id: string
  reported_id: string
  report_type: ReportType
  description: string
  evidence: any
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed'
  admin_notes?: string
  resolved_by?: string
  resolved_at?: string
  created_at: string
  reporter_name?: string
  reported_name?: string
}

interface Stats {
  total: number
  pending: number
  investigating: number
  resolved: number
  dismissed: number
  by_type: Partial<Record<ReportType, number>>
}

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const auth = await import('@supabase/supabase-js')
      const { createClient } = auth
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      const supabase = createClient(url, key)
      
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        throw new Error('Oturum bulunamadı')
      }

      // Get statistics
      const { data: statsData, error: statsError } = await supabase
        .rpc('get_report_statistics', { p_days: 30 })

      if (statsError) {
        console.error('Stats error:', statsError)
        throw statsError
      }
      
      // Function returns single row, not array
      if (statsData && statsData.length > 0) {
        const row = statsData[0]
        setStats({
          total: Number(row.total_reports || 0),
          pending: Number(row.pending_reports || 0),
          investigating: Number(row.investigating_reports || 0),
          resolved: Number(row.resolved_reports || 0),
          dismissed: Number(row.dismissed_reports || 0),
          by_type: row.by_type || {}
        })
      } else {
        setStats({
          total: 0,
          pending: 0,
          investigating: 0,
          resolved: 0,
          dismissed: 0,
          by_type: {}
        })
      }

      // Get reports with user details
      const { data: reportsData, error: reportsError } = await supabase
        .from('user_reports')
        .select(`
          *,
          reporter:users!user_reports_reporter_id_fkey(name),
          reported:users!user_reports_reported_id_fkey(name)
        `)
        .order('created_at', { ascending: false })

      if (reportsError) throw reportsError

      const formattedReports = (reportsData || []).map((r: any) => ({
        ...r,
        reporter_name: r.reporter?.name || 'Bilinmiyor',
        reported_name: r.reported?.name || 'Bilinmiyor'
      }))

      setReports(formattedReports)
      setError(null)
    } catch (e: any) {
      setError(e?.message || 'Veri yüklenirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const updateReportStatus = async (
    reportId: string, 
    newStatus: 'investigating' | 'resolved' | 'dismissed',
    adminNotes?: string
  ) => {
    try {
      const auth = await import('@supabase/supabase-js')
      const { createClient } = auth
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      const supabase = createClient(url, key)

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Kullanıcı bulunamadı')

      const updateData: any = {
        status: newStatus,
        updated_at: new Date().toISOString()
      }

      if (adminNotes) {
        updateData.admin_notes = adminNotes
      }

      if (newStatus === 'resolved' || newStatus === 'dismissed') {
        updateData.resolved_by = user.id
        updateData.resolved_at = new Date().toISOString()
      }

      const { error } = await supabase
        .from('user_reports')
        .update(updateData)
        .eq('id', reportId)

      if (error) throw error

      await loadData()
    } catch (e: any) {
      alert('Hata: ' + (e?.message || 'Güncelleme başarısız'))
    }
  }

  const filteredReports = reports.filter(report => {
    if (selectedStatus !== 'all' && report.status !== selectedStatus) return false
    if (selectedType !== 'all' && report.report_type !== selectedType) return false
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        report.reporter_name?.toLowerCase().includes(query) ||
        report.reported_name?.toLowerCase().includes(query) ||
        report.description.toLowerCase().includes(query)
      )
    }
    return true
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Şikayetler</h1>
        <button
          onClick={loadData}
          className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:shadow-lg hover:shadow-pink-500/50 font-medium transition-all"
        >
          Yenile
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatCard
            icon={<AlertCircle className="w-5 h-5" />}
            label="Toplam"
            value={stats.total}
            color="gray"
          />
          <StatCard
            icon={<Clock className="w-5 h-5" />}
            label="Bekleyen"
            value={stats.pending}
            color="yellow"
          />
          <StatCard
            icon={<Search className="w-5 h-5" />}
            label="İnceleniyor"
            value={stats.investigating}
            color="blue"
          />
          <StatCard
            icon={<CheckCircle className="w-5 h-5" />}
            label="Çözüldü"
            value={stats.resolved}
            color="green"
          />
          <StatCard
            icon={<XCircle className="w-5 h-5" />}
            label="Reddedildi"
            value={stats.dismissed}
            color="red"
          />
        </div>
      )}

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">Durum Filtresi</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 text-white border border-white/20 rounded-lg focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
          >
            <option value="all" className="bg-gray-800">Tümü</option>
            <option value="pending" className="bg-gray-800">Bekleyen</option>
            <option value="investigating" className="bg-gray-800">İnceleniyor</option>
            <option value="resolved" className="bg-gray-800">Çözüldü</option>
            <option value="dismissed" className="bg-gray-800">Reddedildi</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">Tür Filtresi</label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 text-white border border-white/20 rounded-lg focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
          >
            <option value="all" className="bg-gray-800">Tümü</option>
            {REPORT_TYPE_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value} className="bg-gray-800">{opt.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">Arama</label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="İsim veya açıklama ara..."
            className="w-full px-4 py-3 bg-white/10 text-white border border-white/20 rounded-lg focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 placeholder-gray-500"
          />
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.length === 0 ? (
          <div className="text-center py-12 text-gray-400 bg-white/5 rounded-2xl border border-white/10">
            Şikayet bulunamadı
          </div>
        ) : (
          filteredReports.map(report => (
            <ReportCard
              key={report.id}
              report={report}
              onUpdateStatus={updateReportStatus}
            />
          ))
        )}
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, color }: {
  icon: React.ReactNode
  label: string
  value: number
  color: 'gray' | 'yellow' | 'blue' | 'green' | 'red'
}) {
  const colorClasses: Record<string, string> = {
    gray: 'bg-gray-500/10 border-gray-500/20 text-gray-400',
    yellow: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
    blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    green: 'bg-green-500/10 border-green-500/20 text-green-400',
    red: 'bg-red-500/10 border-red-500/20 text-red-400',
  }

  return (
    <div className={`p-4 rounded-lg border ${colorClasses[color]}`}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-sm opacity-80">{label}</span>
      </div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  )
}

function ReportCard({ report, onUpdateStatus }: {
  report: Report
  onUpdateStatus: (id: string, status: 'investigating' | 'resolved' | 'dismissed', notes?: string) => void
}) {
  const [showDetails, setShowDetails] = useState(false)
  const [adminNotes, setAdminNotes] = useState(report.admin_notes || '')

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
    investigating: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    resolved: 'bg-green-500/10 border-green-500/20 text-green-400',
    dismissed: 'bg-red-500/10 border-red-500/20 text-red-400',
  }

  const statusLabels: Record<string, string> = {
    pending: 'Bekliyor',
    investigating: 'İnceleniyor',
    resolved: 'Çözüldü',
    dismissed: 'Reddedildi',
  }

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-3 py-1 text-xs font-medium rounded-lg ${statusColors[report.status]}`}>
              {statusLabels[report.status]}
            </span>
            <span className="px-3 py-1 text-xs font-medium bg-white/10 text-white rounded-lg">
              {getReportTypeLabel(report.report_type)}
            </span>
          </div>
          <p className="text-sm text-gray-300">
            <strong className="text-white">{report.reporter_name}</strong> kullanıcısı{' '}
            <strong className="text-white">{report.reported_name}</strong> kullanıcısını şikayet etti
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {new Date(report.created_at).toLocaleString('tr-TR')}
          </p>
        </div>

        <button
          onClick={() => setShowDetails(!showDetails)}
          className="px-4 py-2 text-sm bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-colors"
        >
          {showDetails ? 'Gizle' : 'Detaylar'}
        </button>
      </div>

      {showDetails && (
        <div className="space-y-4 pt-4 border-t border-white/20">
          <div>
            <h4 className="text-sm font-semibold mb-2 text-white">Açıklama:</h4>
            <p className="text-sm text-gray-300 bg-white/5 p-4 rounded-lg border border-white/10">
              {report.description}
            </p>
          </div>

          {report.evidence && (
            <div>
              <h4 className="text-sm font-semibold mb-2 text-white">Kanıtlar:</h4>
              <pre className="text-xs text-gray-300 bg-white/5 p-4 rounded-lg border border-white/10 overflow-auto">
                {JSON.stringify(report.evidence, null, 2)}
              </pre>
            </div>
          )}

          {report.admin_notes && (
            <div>
              <h4 className="text-sm font-semibold mb-2 text-white">Admin Notları:</h4>
              <p className="text-sm text-gray-300 bg-white/5 p-4 rounded-lg border border-white/10">
                {report.admin_notes}
              </p>
            </div>
          )}

          {report.status === 'pending' && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-semibold mb-2 text-white">Admin Notu (opsiyonel):</label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 text-white border border-white/20 rounded-lg focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 placeholder-gray-500"
                  rows={3}
                  placeholder="Notlarınızı buraya yazın..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => onUpdateStatus(report.id, 'investigating', adminNotes)}
                  className="px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
                >
                  İncelemeye Al
                </button>
                <button
                  onClick={() => onUpdateStatus(report.id, 'resolved', adminNotes)}
                  className="px-6 py-3 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors"
                >
                  Çözüldü
                </button>
                <button
                  onClick={() => onUpdateStatus(report.id, 'dismissed', adminNotes)}
                  className="px-6 py-3 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors"
                >
                  Reddet
                </button>
              </div>
            </div>
          )}

          {report.status === 'investigating' && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-semibold mb-2 text-white">Admin Notu:</label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 text-white border border-white/20 rounded-lg focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 placeholder-gray-500"
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => onUpdateStatus(report.id, 'resolved', adminNotes)}
                  className="px-6 py-3 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors"
                >
                  Çözüldü
                </button>
                <button
                  onClick={() => onUpdateStatus(report.id, 'dismissed', adminNotes)}
                  className="px-6 py-3 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors"
                >
                  Reddet
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
