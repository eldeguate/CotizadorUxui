import { useNavigate } from 'react-router';

export function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center h-full min-h-96">
      <div className="text-center">
        <p style={{ fontSize: '5rem', fontWeight: 800, color: '#E5E5EA', lineHeight: 1 }}>404</p>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1C1C1E', marginTop: '16px' }}>Página no encontrada</h2>
        <p style={{ color: '#8E8E93', marginTop: '8px', fontSize: '0.9375rem' }}>
          La página que buscas no existe o fue movida.
        </p>
        <button
          onClick={() => navigate('/')}
          className="mt-6 px-6 py-2.5 bg-[#007AFF] text-white rounded-xl hover:bg-[#0071E3] transition-colors inline-block"
          style={{ fontSize: '0.9375rem', fontWeight: 600 }}
        >
          Volver al Dashboard
        </button>
      </div>
    </div>
  );
}
