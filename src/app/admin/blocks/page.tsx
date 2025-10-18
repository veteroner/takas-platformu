'use client'

import { useEffect, useState } from 'react'
import { Ban, Search, Trash2 } from 'lucide-react'

interface BlockedUser {
  id: string
  blocker_id: string
  blocked_id: string
  reason?: string
  created_at: string
  blocker_name?: string
  blocked_name?: string
}

interface BlockStats {
  total: number
  today: number
  this_week: number
  this_month: number
}

export default function AdminBlocksPage() {
  const [blocks, setBlocks] = useState<BlockedUser[]>([])
  const [stats, setStats] = useState<BlockStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
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

      // Get all blocks with user details
      const { data: blocksData, error: blocksError } = await supabase
        .from('user_blocks')
        .select(`
          *,
          blocker:users!user_blocks_blocker_id_fkey(name),
          blocked:users!user_blocks_blocked_id_fkey(name)
        `)
        .order('created_at', { ascending: false })

      if (blocksError) throw blocksError

      const formattedBlocks = (blocksData || []).map((b: any) => ({
        ...b,
        blocker_name: b.blocker?.name || 'Bilinmiyor',
        blocked_name: b.blocked?.name || 'Bilinmiyor'
      }))

      setBlocks(formattedBlocks)

      // Calculate statistics
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

      const stats: BlockStats = {
        total: formattedBlocks.length,
        today: formattedBlocks.filter((b: BlockedUser) => 
          new Date(b.created_at) >= today
        ).length,
        this_week: formattedBlocks.filter((b: BlockedUser) => 
          new Date(b.created_at) >= weekAgo
        ).length,
        this_month: formattedBlocks.filter((b: BlockedUser) => 
          new Date(b.created_at) >= monthAgo
        ).length,
      }

      setStats(stats)
      setError(null)
    } catch (e: any) {
      setError(e?.message || 'Veri yüklenirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const unblockUser = async (blockId: string) => {
    if (!confirm('Bu engeli kaldırmak istediğinizden emin misiniz?')) return

    try {
      const auth = await import('@supabase/supabase-js')
      const { createClient } = auth
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      const supabase = createClient(url, key)

      const { error } = await supabase
        .from('user_blocks')
        .delete()
        .eq('id', blockId)

      if (error) throw error

      await loadData()
    } catch (e: any) {
      alert('Hata: ' + (e?.message || 'Engel kaldırılamadı'))
    }
  }

  const filteredBlocks = blocks.filter(block => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      block.blocker_name?.toLowerCase().includes(query) ||
      block.blocked_name?.toLowerCase().includes(query) ||
      block.reason?.toLowerCase().includes(query)
    )
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
        <h1 className="text-3xl font-bold text-white">Engellemeler</h1>
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="Toplam"
            value={stats.total}
            icon={<Ban className="w-5 h-5" />}
          />
          <StatCard
            label="Bugün"
            value={stats.today}
            icon={<Ban className="w-5 h-5" />}
          />
          <StatCard
            label="Bu Hafta"
            value={stats.this_week}
            icon={<Ban className="w-5 h-5" />}
          />
          <StatCard
            label="Bu Ay"
            value={stats.this_month}
            icon={<Ban className="w-5 h-5" />}
          />
        </div>
      )}

      {/* Search */}
      <div>
        <label className="block text-sm font-medium mb-2 text-white">Arama</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="İsim veya sebep ara..."
            className="w-full pl-10 pr-4 py-3 bg-white/10 text-white border border-white/20 rounded-lg focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Blocks List */}
      <div className="space-y-3">
        {filteredBlocks.length === 0 ? (
          <div className="text-center py-12 text-white bg-white/5 rounded-2xl border border-white/10">
            Engelleme bulunamadı
          </div>
        ) : (
          filteredBlocks.map(block => (
            <BlockCard
              key={block.id}
              block={block}
              onUnblock={unblockUser}
            />
          ))
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value, icon }: {
  label: string
  value: number
  icon: React.ReactNode
}) {
  return (
    <div className="p-4 rounded-lg border bg-white/5 backdrop-blur-xl border-white/10">
      <div className="flex items-center gap-2 mb-2 text-white">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
    </div>
  )
}

function BlockCard({ block, onUnblock }: {
  block: BlockedUser
  onUnblock: (id: string) => void
}) {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Ban className="w-4 h-4 text-red-400" />
            <span className="font-medium text-white">{block.blocker_name}</span>
            <span className="text-white/60">→</span>
            <span className="font-medium text-white">{block.blocked_name}</span>
          </div>
          <p className="text-xs text-white/60">
            {new Date(block.created_at).toLocaleString('tr-TR')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="px-4 py-2 text-sm bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-colors"
          >
            {showDetails ? 'Gizle' : 'Detay'}
          </button>
          <button
            onClick={() => onUnblock(block.id)}
            className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg"
            title="Engeli Kaldır"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showDetails && block.reason && (
        <div className="mt-4 pt-4 border-t border-white/20">
          <h4 className="text-sm font-semibold mb-2 text-white">Engelleme Sebebi:</h4>
          <p className="text-sm text-white bg-white/5 p-4 rounded-lg border border-white/10">
            {block.reason}
          </p>
        </div>
      )}
    </div>
  )
}
