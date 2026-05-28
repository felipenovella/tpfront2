import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

export default function Profile() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [newPassword, setNewPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setMessage(''); setError('')
    if (newPassword.length < 6) return setError('La contraseña debe tener al menos 6 caracteres.')
    if (newPassword !== confirm) return setError('Las contraseñas no coinciden.')
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    setLoading(false)
    if (error) setError(error.message)
    else { setMessage('Contraseña actualizada correctamente.'); setNewPassword(''); setConfirm('') }
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const initials = user?.email?.slice(0, 2).toUpperCase() || 'AC'

  return (
    <main className="page">
      <div className="container" style={{ maxWidth: 640 }}>
        <div className="page-header">
          <div className="page-eyebrow">Configuración</div>
          <h2>Mi perfil</h2>
        </div>

        {/* Avatar + email */}
        <div className="card animate-in" style={{ padding: 28, marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: 'var(--accent-dim)',
              border: '2px solid var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '1.4rem',
              color: 'var(--accent)',
              flexShrink: 0,
            }}>
              {initials}
            </div>
            <div>
              <h3 style={{ marginBottom: 4 }}>{user?.email}</h3>
              <span className="badge badge-success">Cuenta activa</span>
              <p style={{ color: 'var(--muted-2)', fontSize: '0.85rem', marginTop: 8 }}>
                Miembro desde {new Date(user?.created_at).toLocaleDateString('es-AR', { year: 'numeric', month: 'long' })}
              </p>
            </div>
          </div>
        </div>

        {/* Change password */}
        <div className="card animate-in animate-in-delay-1" style={{ padding: 28, marginBottom: 24 }}>
          <h3 style={{ marginBottom: 20 }}>Cambiar contraseña</h3>

          {message && <div className="alert alert-success">{message}</div>}
          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Nueva contraseña</label>
              <input
                type="password"
                className="form-input"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Confirmar contraseña</label>
              <input
                type="password"
                className="form-input"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder="Repetí la contraseña"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ alignSelf: 'flex-start' }}>
              {loading ? <><span className="spinner" style={{ width: 16, height: 16 }} /> Guardando...</> : 'Actualizar contraseña'}
            </button>
          </form>
        </div>

        {/* Danger zone */}
        <div className="card animate-in animate-in-delay-2" style={{ padding: 28, borderColor: 'rgba(255,107,107,0.15)' }}>
          <h3 style={{ marginBottom: 8, color: 'var(--danger)' }}>Cerrar sesión</h3>
          <p style={{ color: 'var(--muted-2)', fontSize: '0.9rem', marginBottom: 16 }}>
            Cerrá tu sesión en este dispositivo.
          </p>
          <button className="btn btn-danger" onClick={handleSignOut}>
            Cerrar sesión
          </button>
        </div>
      </div>
    </main>
  )
}
