import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import AircraftCard from '../components/AircraftCard'

export default function Favorites() {
  const { user } = useAuth()
  const [aircraft, setAircraft] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFavorites()
  }, [user])

  const fetchFavorites = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('favorites')
      .select('aircraft_id, aircraft(*)')
      .eq('user_id', user.id)
    setAircraft((data || []).map(f => f.aircraft).filter(Boolean))
    setLoading(false)
  }

  const handleToggleFavorite = async (aircraftId) => {
    await supabase.from('favorites').delete().eq('user_id', user.id).eq('aircraft_id', aircraftId)
    setAircraft(prev => prev.filter(a => a.id !== aircraftId))
  }

  return (
    <main className="page">
      <div className="container">
        <div className="page-header">
          <div className="page-eyebrow">Mi colección</div>
          <h2>Favoritos</h2>
          <p className="page-description">
            {aircraft.length > 0 ? `${aircraft.length} aeronaves guardadas` : 'Tus aeronaves favoritas aparecerán acá'}
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div className="spinner" style={{ width: 32, height: 32, margin: '0 auto' }} />
          </div>
        ) : aircraft.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">⭐</div>
            <h3>Sin favoritos todavía</h3>
            <p>Explorá el catálogo y marcá las aeronaves que más te gusten.</p>
            <a href="/catalog" className="btn btn-primary">Ir al catálogo</a>
          </div>
        ) : (
          <div className="grid grid-3">
            {aircraft.map(a => (
              <AircraftCard
                key={a.id}
                aircraft={a}
                isFavorite={true}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
