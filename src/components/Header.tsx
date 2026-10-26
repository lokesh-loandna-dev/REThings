import { PhoneCall } from 'lucide-react';

interface HeaderProps {
  onOpenVault: () => void;
}

export default function Header({ onOpenVault }: HeaderProps) {
  return (
    <header className="app-header">
      <div className="brand-badge">
        <div
          style={{
            background: 'rgba(16, 185, 129, 0.12)',
            padding: '7px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <PhoneCall size={18} color="#10B981" />
        </div>
        <div>
          <h1 className="brand-title">Reminder</h1>
          <span style={{ fontSize: '0.68rem', color: '#64748B', display: 'block', marginTop: '-2px' }}>
            Offline Task & Call Manager
          </span>
        </div>
      </div>

      <button
        onClick={onOpenVault}
        className="offline-pill"
        style={{ cursor: 'pointer', border: '1px solid #222731' }}
        title="View Vault & Settings"
      >
        <span className="offline-dot"></span>
        100% Offline
      </button>
    </header>
  );
}
