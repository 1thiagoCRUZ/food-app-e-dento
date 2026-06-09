import { useState } from 'react';
import { api } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import { Store, Image as ImageIcon } from 'lucide-react';

export function CreateStore({ onStoreCreated }: { onStoreCreated: () => void }) {
  const [name, setName] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { fetchMyRestaurant } = useAuth();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('cnpj', cnpj);
      formData.append('isOpen', 'false');
      if (imageFile) {
        formData.append('photo', imageFile);
      }

      await api.post('/restaurants', formData);
      await fetchMyRestaurant(); // Refresh auth context with the new restaurant
      onStoreCreated();
    } catch (err: any) {
      console.error(err);
      setError('Erro ao criar loja. Verifique os dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', backgroundColor: 'var(--bg-main)', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card card-pad-lg" style={{ width: '100%', maxWidth: '400px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px', color: 'var(--primary)' }}>
            <Store size={48} />
          </div>
          <h1 className="page-title" style={{ fontSize: '24px' }}>Crie sua Loja</h1>
          <p className="page-subtitle">Configure os dados do seu restaurante para começar a vender.</p>
        </div>

        {error && (
          <div style={{ padding: '12px', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600, color: 'var(--text-dark)' }}>Nome da Loja</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-light)', outline: 'none' }}
              placeholder="Minha Pizzaria"
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600, color: 'var(--text-dark)' }}>CNPJ</label>
            <input 
              type="text" 
              value={cnpj}
              onChange={(e) => {
                let v = e.target.value.replace(/\D/g, '')
                if (v.length <= 14) {
                  v = v.replace(/^(\d{2})(\d)/, '$1.$2')
                  v = v.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
                  v = v.replace(/\.(\d{3})(\d)/, '.$1/$2')
                  v = v.replace(/(\d{4})(\d)/, '$1-$2')
                  setCnpj(v)
                }
              }}
              required
              maxLength={18}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-light)', outline: 'none' }}
              placeholder="00.000.000/0000-00"
            />
          </div>

          <div className="field">
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600, color: 'var(--text-dark)' }}>Logo da Loja</label>
            <label className="upload-box" style={{ cursor: 'pointer', overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', border: '2px dashed var(--border-light)', borderRadius: '8px', backgroundColor: '#fafafa' }}>
              <input type="file" accept="image/png, image/jpeg" style={{ display: 'none' }} onChange={handleImageChange} />
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }} />
              ) : (
                <>
                  <ImageIcon size={28} color="var(--text-light)" />
                  <span className="text-md fw-600" style={{ marginTop: '8px', color: 'var(--text-dark)' }}>Clique para enviar</span>
                  <span className="text-xs" style={{ color: 'var(--text-light)' }}>PNG ou JPG</span>
                </>
              )}
            </label>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '8px', padding: '12px', display: 'flex', justifyContent: 'center' }}
            disabled={loading}
          >
            {loading ? 'Criando loja...' : 'Criar Minha Loja'}
          </button>
        </form>
      </div>
    </div>
  );
}
