import { useState } from 'react';
import { api } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';

export function Login() {
  const [email, setEmail] = useState('admin@restaurante.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/users/login', { email, password });
      if (response && response.token && response.user) {
        await login(response.token, response.user);
      } else {
        setError('Token ou dados do usuário não recebidos. Verifique o console.');
      }
    } catch (err: any) {
      console.error(err);
      setError('E-mail ou senha incorretos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', backgroundColor: 'var(--bg-main)', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card card-pad-lg" style={{ width: '100%', maxWidth: '400px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1 className="page-title" style={{ fontSize: '24px' }}>E-Dento Food</h1>
          <p className="page-subtitle">Portal do Restaurante</p>
        </div>

        {error && (
          <div style={{ padding: '12px', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600, color: 'var(--text-dark)' }}>E-mail</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-light)', outline: 'none' }}
              placeholder="admin@restaurante.com"
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600, color: 'var(--text-dark)' }}>Senha</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-light)', outline: 'none' }}
              placeholder="********"
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '8px', padding: '12px', display: 'flex', justifyContent: 'center' }}
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
