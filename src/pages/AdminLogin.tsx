import { useState } from 'react'
import Logo from '../components/Logo'
import { useAuth } from '../auth/AuthProvider'

export default function AdminLogin() {
  const { signIn, configurationError } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    const result = await signIn(email.trim(), password)
    if (result.error) setError(result.error)
    setSubmitting(false)
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6" style={{ backgroundColor: '#080f18', fontFamily: "'Montserrat', system-ui, sans-serif" }}>
      <section className="w-full max-w-md" style={{ backgroundColor: '#0D1B2A', border: '1px solid rgba(245,242,236,0.08)', padding: '36px' }}>
        <div className="mb-10 flex justify-center">
          <Logo size="sm" />
        </div>
        <div className="mb-8">
          <div style={{ fontFamily: "'Montserrat'", fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#B88E3A', marginBottom: '12px' }}>
            Área privada
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '32px', color: '#F5F2EC', fontWeight: 600, marginBottom: '8px' }}>
            Ingresar al Admin
          </h1>
          <p style={{ fontFamily: "'Montserrat'", fontSize: '12px', color: 'rgba(245,242,236,0.5)', lineHeight: 1.7 }}>
            Acceso exclusivo para administrar las publicaciones de ORIGEN.
          </p>
        </div>

        {configurationError && (
          <div className="mb-6" style={{ border: '1px solid rgba(184,142,58,0.35)', backgroundColor: 'rgba(184,142,58,0.08)', padding: '12px 14px', fontFamily: "'Montserrat'", fontSize: '11px', color: '#DCC8A3', lineHeight: 1.6 }}>
            {configurationError}
          </div>
        )}

        {error && (
          <div className="mb-6" role="alert" style={{ border: '1px solid rgba(220,100,100,0.4)', backgroundColor: 'rgba(140,40,40,0.12)', padding: '12px 14px', fontFamily: "'Montserrat'", fontSize: '11px', color: '#F0B0B0', lineHeight: 1.6 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <label className="flex flex-col gap-2">
            <span style={{ fontFamily: "'Montserrat'", fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(245,242,236,0.45)', fontWeight: 600 }}>
              Email
            </span>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={event => setEmail(event.target.value)}
              style={{ fontFamily: "'Montserrat'", fontSize: '13px', color: '#F5F2EC', backgroundColor: 'rgba(245,242,236,0.04)', border: '1px solid rgba(245,242,236,0.1)', padding: '12px 14px', outline: 'none' }}
            />
          </label>
          <label className="flex flex-col gap-2">
            <span style={{ fontFamily: "'Montserrat'", fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(245,242,236,0.45)', fontWeight: 600 }}>
              Contraseña
            </span>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={event => setPassword(event.target.value)}
              style={{ fontFamily: "'Montserrat'", fontSize: '13px', color: '#F5F2EC', backgroundColor: 'rgba(245,242,236,0.04)', border: '1px solid rgba(245,242,236,0.1)', padding: '12px 14px', outline: 'none' }}
            />
          </label>
          <button
            type="submit"
            disabled={submitting || Boolean(configurationError)}
            style={{ fontFamily: "'Montserrat'", fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 700, color: '#0D1B2A', backgroundColor: submitting || configurationError ? '#8E7950' : '#B88E3A', border: '1px solid #B88E3A', padding: '14px', cursor: submitting || configurationError ? 'not-allowed' : 'pointer', marginTop: '8px' }}
          >
            {submitting ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </section>
    </main>
  )
}
