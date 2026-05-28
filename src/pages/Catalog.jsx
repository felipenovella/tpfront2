import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import AircraftCard from '../components/AircraftCard'
import AircraftModal from '../components/AircraftModal'

export default function Catalog() {
  const { user } = useAuth()
  const [aircraft, setAircraft] = useState([])
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('Todos')
  const [showModal, setShowModal] = useState(false)

  const CATEGORIES = ['Todos', 'Comercial', 'Militar', 'Privado', 'Carga', 'Experimental', 'Histórico']

  useEffect(() => {
    fetchAll()
  }, [user])

  const fetchAll = async () => {
    setLoading(true)
    const [{ data: ac }, { data: favs }] = await Promise.all([
      supabase.from('aircraft').select('*').order('created_at', { ascending: false }),
      supabase.from('favorites').select('aircraft_id').eq('user_id', user.id),
    ])
    setAircraft(ac || [])
    setFavorites((favs || []).map(f => f.aircraft_id))
    setLoading(false)
  }

  const handleToggleFavorite = async (aircraftId) => {
    const isFav = favorites.includes(aircraftId)
    if (isFav) {
      await supabase.from('favorites').delete().eq('user_id', user.id).eq('aircraft_id', aircraftId)
      setFavorites(prev => prev.filter(id => id !== aircraftId))
    } else {
      await supabase.from('favorites').insert({ user_id: user.id, aircraft_id: aircraftId })
      setFavorites(prev => [...prev, aircraftId])
    }
  }

  const handleSaved = (saved) => {
    setAircraft(prev => {
      const exists = prev.find(a => a.id === saved.id)
      return exists ? prev.map(a => a.id === saved.id ? saved : a) : [saved, ...prev]
    })
    setShowModal(false)
  }

  const filtered = aircraft.filter(a => {
    const matchSearch = `${a.model} ${a.manufacturer} ${a.airline}`.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'Todos' || a.category === filter
    return matchSearch && matchFilter
  })

  return (
    <main className="page">
      <div className="container">
        <div className="page-header">
          <div className="page-header-top">
            <div>
              <div className="page-eyebrow">Base de datos</div>
              <h2>Catálogo de Aeronaves</h2>
            </div>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              + Nueva aeronave
            </button>
          </div>
          <p className="page-description">
            {aircraft.length} aeronaves en el catálogo
          </p>
        </div>

        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            placeholder="Buscar por modelo, fabricante, aerolínea..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Category filters */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`btn btn-sm ${filter === cat ? 'btn-primary' : 'btn-ghost'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div className="spinner" style={{ width: 32, height: 32, margin: '0 auto' }} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">✈</div>
            <h3>{search || filter !== 'Todos' ? 'Sin resultados' : 'El catálogo está vacío'}</h3>
            <p>{search || filter !== 'Todos' ? 'Probá con otra búsqueda o filtro.' : 'Sé el primero en agregar una aeronave.'}</p>
            {!search && filter === 'Todos' && (
              <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Agregar aeronave</button>
            )}
          </div>
        ) : (
          <div className="grid grid-3">
            {filtered.map(a => (
              <AircraftCard
                key={a.id}
                aircraft={a}
                isFavorite={favorites.includes(a.id)}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <AircraftModal onClose={() => setShowModal(false)} onSaved={handleSaved} />
      )}
    </main>
  )
}
