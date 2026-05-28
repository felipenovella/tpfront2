import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Home() {
  const { user } = useAuth()

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Hero */}
      <section style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        padding: '120px 24px 80px',
        maxWidth: 1200,
        margin: '0 auto',
        width: '100%',
        gap: 48,
      }}>
        <div style={{ flex: 1 }} className="animate-in">
          <div className="page-eyebrow">Catálogo de Aeronaves</div>
          <h1 style={{ marginBottom: 24, letterSpacing: '-0.02em' }}>
            Tu colección<br />
            <span style={{ color: 'var(--accent)' }}>de aviones</span>,<br />
            en la nube.
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--muted-2)', marginBottom: 36, lineHeight: 1.7, maxWidth: 480 }}>
            Explorá, guardá y organizá aeronaves de todo el mundo. 
            Desde biplanos históricos hasta jets modernos.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {user ? (
              <Link to="/catalog" className="btn btn-primary btn-lg">
                ✈ Ver catálogo
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg">
                  Empezar gratis
                </Link>
                <Link to="/login" className="btn btn-secondary btn-lg">
                  Ingresar
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Visual decoration */}
        <div className="animate-in animate-in-delay-2" style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 340,
        }}>
          <div style={{
            width: 320,
            height: 320,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 40% 40%, rgba(232,196,104,0.15) 0%, rgba(74,158,255,0.08) 60%, transparent 80%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 120,
            border: '1px solid rgba(232,196,104,0.1)',
            position: 'relative',
          }}>
            ✈
            <div style={{
              position: 'absolute',
              width: 380,
              height: 380,
              borderRadius: '50%',
              border: '1px dashed rgba(255,255,255,0.06)',
            }} />
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '60px 24px 100px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        <div className="grid grid-3">
          {[
            { icon: '🗂️', title: 'Catálogo completo', desc: 'Agregá aeronaves con modelo, fabricante, aerolínea y fotos.' },
            { icon: '⭐', title: 'Favoritos', desc: 'Guardá tus aeronaves preferidas para acceder rápido.' },
            { icon: '☁️', title: 'En la nube', desc: 'Tus datos sincronizados, disponibles desde cualquier dispositivo.' },
          ].map((f, i) => (
            <div key={i} className={`card animate-in animate-in-delay-${i + 1}`} style={{ padding: 28 }}>
              <div style={{ fontSize: 32, marginBottom: 16 }}>{f.icon}</div>
              <h3 style={{ marginBottom: 8 }}>{f.title}</h3>
              <p style={{ color: 'var(--muted-2)', fontSize: '0.9rem' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
