import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (password !== confirm) return setError('Las contraseñas no coinciden.')
    if (password.length < 6) return setError('La contraseña debe tener al menos 6 caracteres.')
    setLoading(true)
    const { data, error } = await signUp(email, password)
    setLoading(false)
    if (error) {
      setError(error.message)
    } else if (data.user && !data.session) {
      setSuccess('¡Revisá tu email para confirmar la cuenta!')
    } else {
      navigate('/catalog')
    }
  }

  return (
    <main className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="animate-in" style={{ width: '100%', maxWidth: 440, padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🛫</div>
          <h2>Crear cuenta</h2>
          <p style={{ color: 'var(--muted-2)', marginTop: 8 }}>Empezá tu catálogo de aeronaves</p>
        </div>

        <div className="card" style={{ padding: '32px 28px' }}>
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          {!success && (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contraseña</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Confirmar contraseña</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Repetí la contraseña"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: 14 }}>
                {loading ? <><span className="spinner" style={{ width: 16, height: 16 }} /> Creando cuenta...</> : 'Crear cuenta'}
              </button>
            </form>
          )}
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, color: 'var(--muted-2)', fontSize: '0.9rem' }}>
          ¿Ya tenés cuenta?{' '}
          <Link to="/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>
            Ingresá acá
          </Link>
        </p>
      </div>
    </main>
  )
}
