import { Link } from 'react-router-dom'

const PLACEHOLDER = 'data:image/svg+xml,' + encodeURIComponent(`
  <svg width="400" height="225" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="225" fill="#1c1e26"/>
    <text x="200" y="120" text-anchor="middle" font-size="60" fill="#2e3040">✈</text>
  </svg>
`)

export default function AircraftCard({ aircraft, isFavorite, onToggleFavorite }) {
  return (
    <div className="card">
      <Link to={`/aircraft/${aircraft.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="card-img">
          <img
            src={aircraft.image_url || PLACEHOLDER}
            alt={aircraft.model}
            onError={e => { e.target.src = PLACEHOLDER }}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
        <div className="card-body">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
            <h3 className="card-title" style={{ marginBottom: 0 }}>{aircraft.model}</h3>
            <span className="badge badge-accent">{aircraft.category || 'Comercial'}</span>
          </div>
          <p className="card-subtitle">{aircraft.manufacturer} · {aircraft.first_flight || '—'}</p>
          {aircraft.airline && (
            <span className="badge badge-muted">{aircraft.airline}</span>
          )}
        </div>
      </Link>

      {onToggleFavorite && (
        <div className="card-footer">
          <button
            className="fav-btn"
            onClick={() => onToggleFavorite(aircraft.id)}
            title={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          >
            {isFavorite ? '⭐' : '☆'}
          </button>
          <span style={{ fontSize: '0.8rem', color: 'var(--muted-2)' }}>
            {isFavorite ? 'En favoritos' : 'Agregar a favoritos'}
          </span>
        </div>
      )}
    </div>
  )
}
