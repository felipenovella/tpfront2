import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import AircraftModal from '../components/AircraftModal'

const PLACEHOLDER = 'data:image/svg+xml,' + encodeURIComponent(`
  <svg width="800" height="450" xmlns="http://www.w3.org/2000/svg">
    <rect width="800" height="450" fill="#1c1e26"/>
    <text x="400" y="240" text-anchor="middle" font-size="100" fill="#2e3040">✈</text>
  </svg>
`)

export default function AircraftDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [aircraft, setAircraft] = useState(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchAircraft()
  }, [id, user])

  const fetchAircraft = async () => {
    const [{ data: ac }, { data: fav }] = await Promise.all([
      supabase.from('aircraft').select('*').eq('id', id).single(),
      supabase.from('favorites').select('id').eq('user_id', user.id).eq('aircraft_id', id).maybeSingle(),
    ])
    if (!ac) return navigate('/catalog')
    setAircraft(ac)
    setIsFavorite(!!fav)
    setLoading(false)
  }

  const handleToggleFavorite = async () => {
    if (isFavorite) {
      await supabase.from('favorites').delete().eq('user_id', user.id).eq('aircraft_id', id)
      setIsFavorite(false)
    } else {
      await supabase.from('favorites').insert({ user_id: user.id, aircraft_id: id })
      setIsFavorite(true)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm(`¿Eliminar "${aircraft.model}"?`)) return
    setDeleting(true)
    await supabase.from('aircraft').delete().eq('id', id)
    navigate('/catalog')
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div className="spinner" style={{ width: 32, height: 32 }} />
    </div>
  )

  const isOwner = aircraft.user_id === user.id

  return (
    <main className="page">
      <div className="container" style={{ maxWidth: 900 }}>
        <div style={{ marginBottom: 24 }}>
          <Link to="/catalog" style={{ color: 'var(--muted-2)', textDecoration: 'none', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            ← Volver al catálogo
          </Link>
        </div>

        <div className="animate-in" style={{ display: 'grid', gap: 32 }}>
          {/* Image */}
          <div style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', aspectRatio: '16/7', background: 'var(--ink-2)' }}>
            <img
              src={aircraft.image_url || PLACEHOLDER}
              alt={aircraft.model}
              onError={e => { e.target.src = PLACEHOLDER }}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Content */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 24, alignItems: 'start' }}>
            <div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                <span className="badge badge-accent">{aircraft.category}</span>
                {aircraft.airline && <span className="badge badge-sky">{aircraft.airline}</span>}
              </div>
              <h1 style={{ marginBottom: 4 }}>{aircraft.model}</h1>
              <p style={{ fontSize: '1.15rem', color: 'var(--muted-2)', marginBottom: 24 }}>
                {aircraft.manufacturer} {aircraft.first_flight && `· ${aircraft.first_flight}`}
              </p>

              {aircraft.description && (
                <p style={{ color: 'var(--muted-2)', lineHeight: 1.8, fontSize: '1rem' }}>
                  {aircraft.description}
                </p>
              )}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 160 }}>
              <button className="btn btn-secondary" onClick={handleToggleFavorite} style={{ justifyContent: 'center' }}>
                {isFavorite ? '⭐ En favoritos' : '☆ Favorito'}
              </button>

              {isOwner && (
                <>
                  <button className="btn btn-ghost" onClick={() => setEditing(true)} style={{ justifyContent: 'center' }}>
                    ✏️ Editar
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={handleDelete} disabled={deleting} style={{ justifyContent: 'center' }}>
                    {deleting ? '...' : '🗑 Eliminar'}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Specs */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ marginBottom: 16 }}>Especificaciones</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
              {[
                { label: 'Modelo', value: aircraft.model },
                { label: 'Fabricante', value: aircraft.manufacturer },
                { label: 'Categoría', value: aircraft.category },
                { label: 'Aerolínea', value: aircraft.airline || '—' },
                { label: 'Primer vuelo', value: aircraft.first_flight || '—' },
              ].map(({ label, value }) => (
                <div key={label} style={{ padding: 16, background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--muted)', marginBottom: 4 }}>{label}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.05rem' }}>{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {editing && (
        <AircraftModal
          aircraft={aircraft}
          onClose={() => setEditing(false)}
          onSaved={(updated) => { setAircraft(updated); setEditing(false) }}
        />
      )}
    </main>
  )
}
