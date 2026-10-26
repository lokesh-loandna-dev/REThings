import { ShieldCheck, Database, HardDrive, PhoneCall, Bell } from 'lucide-react';

interface SettingsViewProps {
  remindersCount: number;
  birthdaysCount: number;
  notesCount: number;
  onClearAll: () => void;
  onTriggerSampleAlarm: () => void;
}

export default function SettingsView({
  remindersCount,
  birthdaysCount,
  notesCount,
  onClearAll,
  onTriggerSampleAlarm
}: SettingsViewProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* Privacy Guarantee Card */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.12)', padding: 8, borderRadius: 8 }}>
            <ShieldCheck size={20} color="var(--accent-call)" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>
              100% Private Offline Vault
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--accent-call)', fontWeight: 600 }}>
              Zero Server Telemetry • Isolated Device Database
            </div>
          </div>
        </div>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          Your phone numbers, reminders, contact notes, and birthdays never leave this device. No user accounts, analytics, or remote cloud synchronization exist.
        </p>
      </div>

      {/* Storage Breakdown */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <HardDrive size={18} color="var(--text-secondary)" />
          <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Local Storage Metrics
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          <div style={{ background: 'var(--bg-ground)', padding: '12px', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-call)' }} className="tabular-nums">
              {remindersCount}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>
              Call Tasks
            </div>
          </div>
          <div style={{ background: 'var(--bg-ground)', padding: '12px', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-warning)' }} className="tabular-nums">
              {birthdaysCount}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>
              Birthdays
            </div>
          </div>
          <div style={{ background: 'var(--bg-ground)', padding: '12px', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-info)' }} className="tabular-nums">
              {notesCount}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>
              Notes
            </div>
          </div>
        </div>
      </div>

      {/* Android Permissions Overview */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <PhoneCall size={18} color="var(--text-secondary)" />
          <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Native Android Capabilities
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.82rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 8 }}>
            <div>
              <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Direct Outbound Dial</span>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>android.permission.CALL_PHONE</div>
            </div>
            <span style={{ color: 'var(--accent-call)', fontWeight: 700 }}>Configured</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 8 }}>
            <div>
              <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Exact Background Wakeup</span>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>SCHEDULE_EXACT_ALARM & Doze</div>
            </div>
            <span style={{ color: 'var(--accent-call)', fontWeight: 700 }}>Configured</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Lockscreen Full Screen</span>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>USE_FULL_SCREEN_INTENT</div>
            </div>
            <span style={{ color: 'var(--accent-call)', fontWeight: 700 }}>Configured</span>
          </div>
        </div>
      </div>

      {/* Interactive Alarm Simulator & Diagnostics */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '16px'
        }}
      >
        <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>
          Alarm Simulator
        </h3>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 12 }}>
          Test the interactive incoming-call style alarm screen with ringtone audio and direct-dial triggers.
        </p>

        <button
          onClick={onTriggerSampleAlarm}
          style={{
            background: 'var(--bg-ground)',
            border: '1px solid var(--accent-warning)',
            color: 'var(--accent-warning)',
            padding: '10px 16px',
            borderRadius: 'var(--radius-sm)',
            fontWeight: 700,
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            cursor: 'pointer',
            width: '100%',
            justifyContent: 'center'
          }}
        >
          <Bell size={16} />
          Trigger Test Call Alarm
        </button>
      </div>

      {/* Data Management */}
      <div style={{ marginTop: 10 }}>
        <button
          onClick={onClearAll}
          style={{
            background: 'transparent',
            border: '1px solid var(--accent-danger)',
            color: 'var(--accent-danger)',
            padding: '10px 16px',
            borderRadius: 'var(--radius-sm)',
            fontWeight: 700,
            fontSize: '0.85rem',
            width: '100%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6
          }}
        >
          <Database size={15} />
          Wipe Local Database
        </button>
      </div>
    </div>
  );
}
