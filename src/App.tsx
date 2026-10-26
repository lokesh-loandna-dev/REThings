import { useEffect, useState } from 'react';
import { db } from './db/database';
import type { ReminderItem, BirthdayItem } from './types';
import { ShieldCheck, PhoneCall, Calendar, Plus, Clock } from 'lucide-react';

export default function App() {
  const [reminders, setReminders] = useState<ReminderItem[]>([]);
  const [birthdays, setBirthdays] = useState<BirthdayItem[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const r = await db.reminders.toArray();
    const b = await db.birthdays.toArray();
    setReminders(r);
    setBirthdays(b);
  };

  return (
    <div className="app-viewport">
      <header className="app-header">
        <div className="brand-badge">
          <PhoneCall size={20} color="#10B981" />
          <h1 className="brand-title">Reminder</h1>
        </div>
        <div className="offline-pill">
          <span className="offline-dot"></span>
          100% Offline
        </div>
      </header>

      <main className="app-content">
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8, color: '#F9FAFB' }}>
            Upcoming Call Reminders
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginBottom: 14 }}>
            Direct-dial call alarms triggered down to the second.
          </p>

          {reminders.map((rem) => (
            <div key={rem.id} className="task-card">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span className="call-badge">
                    <PhoneCall size={12} />
                    {rem.type}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
                    {rem.targetNumber}
                  </span>
                </div>
                <div style={{ fontWeight: 600, color: '#F9FAFB' }}>{rem.title}</div>
                <div style={{ fontSize: '0.78rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                  <Clock size={12} />
                  {new Date(rem.eventTime).toLocaleDateString()} at 08:00 AM
                </div>
              </div>

              <button
                style={{
                  background: '#10B981',
                  color: '#090B0D',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 14px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  cursor: 'pointer'
                }}
                onClick={() => {
                  window.location.href = `tel:${rem.targetNumber}`;
                }}
              >
                <PhoneCall size={14} />
                Call
              </button>
            </div>
          ))}
        </div>

        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8, color: '#F9FAFB' }}>
            Tracked Birthdays
          </h2>
          {birthdays.map((bday) => (
            <div key={bday.id} className="task-card" style={{ borderLeft: '3px solid #10B981' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{bday.name}</div>
                <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: 2 }}>
                  Born: {bday.birthDate} • Alarm: {bday.notifyTime} AM
                </div>
                {bday.notes && (
                  <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: 4 }}>
                    {bday.notes}
                  </div>
                )}
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 700 }}>
                  Annual Call Active
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>

      <nav className="bottom-nav">
        <button className="nav-item active">
          <Calendar size={20} />
          <span>Timeline</span>
        </button>
        <div className="nav-fab-wrap">
          <button className="nav-fab" aria-label="Add Reminder">
            <Plus size={26} />
          </button>
        </div>
        <button className="nav-item">
          <ShieldCheck size={20} />
          <span>Vault</span>
        </button>
      </nav>
    </div>
  );
}
