import { useState } from 'react';
import { api } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';

export function Register({ onSwitchToLogin }: { onSwitchToLogin: () => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Create user
      await api.post('/users/register', { 
        name, 
        email, 
        password, 
        role: 'RESTAURANT' 
      });

      // Auto login after registration
      const response = await api.post('/users/login', { email, password });
      if (response && response.token && response.user) {
        await login(response.token, response.user);
      } else {
        setError('Conta criada, mas falha ao fazer login automático.');
      }
    } catch (err: any) {
      console.error(err);
      setError('Erro ao criar conta. Verifique se o e-mail já está em uso.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', backgroundColor: 'var(--bg-main)', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card card-pad-lg" style={{ width: '100%', maxWidth: '400px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1 className="page-title" style={{ fontSize: '24px' }}>E-Dento Food</h1>
          <p className="page-subtitle">Criar Conta de Lojista</p>
        </div>

        {error && (
          <div style={{ padding: '12px', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600, color: 'var(--text-dark)' }}>Nome Completo</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-light)', outline: 'none' }}
              placeholder="João Silva"
            />
          </div>
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
            {loading ? 'Criando conta...' : 'Cadastrar'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '14px', color: 'var(--text-light)' }}>
          Já tem conta? <button onClick={onSwitchToLogin} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}>Faça login</button>
        </div>
      </div>
    </div>
  );
}
