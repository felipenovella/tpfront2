import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Navbar() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <div className="navbar-logo">✈</div>
        Aero<span>Cat</span>
      </Link>

      <div className="navbar-nav">
        {user ? (
          <>
            <NavLink to="/catalog" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              Catálogo
            </NavLink>
            <NavLink to="/favorites" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              Favoritos
            </NavLink>
            <NavLink to="/profile" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              Perfil
            </NavLink>
            <button onClick={handleSignOut} className="btn btn-ghost btn-sm">
              Salir
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Ingresar</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Registrarse</Link>
          </>
        )}
      </div>
    </nav>
  )
}
