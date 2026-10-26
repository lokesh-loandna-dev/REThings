import { useState } from 'react';
import type { RecurrenceType } from '../types';
import { X, PhoneCall, Calendar, Clock, UserPlus } from 'lucide-react';
import { pickContact } from '../utils/telephony';

interface CallReminderModalProps {
  onClose: () => void;
  onSave: (data: {
    contactName: string;
    targetNumber: string;
    eventTime: number;
    recurrence: RecurrenceType;
    directDial: boolean;
  }) => void;
}

export default function CallReminderModal({ onClose, onSave }: CallReminderModalProps) {
  const [contactName, setContactName] = useState('');
  const [targetNumber, setTargetNumber] = useState('');
  
  // Default to 1 hour from now
  const defaultDate = new Date(Date.now() + 3600000);
  const [dateStr, setDateStr] = useState(defaultDate.toISOString().split('T')[0]);
  const [timeStr, setTimeStr] = useState(
    defaultDate.toTimeString().split(' ')[0].substring(0, 5)
  );

  const [recurrence, setRecurrence] = useState<RecurrenceType>('NONE');
  const [directDial, setDirectDial] = useState(true);

  // Quick preset handlers
  const setPreset = (minutesAhead: number) => {
    const target = new Date(Date.now() + minutesAhead * 60000);
    setDateStr(target.toISOString().split('T')[0]);
    setTimeStr(target.toTimeString().split(' ')[0].substring(0, 5));
  };

  const setTomorrow9am = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDateStr(tomorrow.toISOString().split('T')[0]);
    setTimeStr('09:00');
  };

  const handlePickContact = async () => {
    const result = await pickContact();
    if (result) {
      if (result.name) setContactName(result.name);
      if (result.number) setTargetNumber(result.number);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetNumber.trim() && !contactName.trim()) return;

    const [hours, minutes] = timeStr.split(':').map(Number);
    const [year, month, day] = dateStr.split('-').map(Number);
    const eventTime = new Date(year, month - 1, day, hours, minutes, 0).getTime();

    onSave({
      contactName: contactName.trim() || 'Scheduled Contact',
      targetNumber: targetNumber.trim(),
      eventTime,
      recurrence,
      directDial
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle"></div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.12)', padding: 7, borderRadius: 8 }}>
              <PhoneCall size={18} color="var(--accent-call)" />
            </div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Schedule Call Reminder
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Contact Name & Picker */}
          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: 6 }}>
              Contact / Person
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="text"
                placeholder="e.g. Dr. Adams, Client Sarah"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                required
                style={{
                  flex: 1,
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 12px',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
              <button
                type="button"
                onClick={handlePickContact}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: 600
                }}
                title="Select Contact from Address Book"
              >
                <UserPlus size={16} color="var(--accent-call)" />
                Pick
              </button>
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: 6 }}>
              Phone Number (for direct dial)
            </label>
            <input
              type="tel"
              placeholder="+1 555 019 2834"
              value={targetNumber}
              onChange={(e) => setTargetNumber(e.target.value)}
              required
              className="tabular-nums"
              style={{
                width: '100%',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '10px 12px',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
          </div>

          {/* Quick Presets */}
          <div>
            <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 6 }}>
              Quick Presets
            </label>
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                type="button"
                onClick={() => setPreset(15)}
                style={{ flex: 1, background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', padding: '6px 0', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
              >
                +15 min
              </button>
              <button
                type="button"
                onClick={() => setPreset(60)}
                style={{ flex: 1, background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', padding: '6px 0', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
              >
                +1 hour
              </button>
              <button
                type="button"
                onClick={setTomorrow9am}
                style={{ flex: 1, background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', padding: '6px 0', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Tomorrow 9am
              </button>
            </div>
          </div>

          {/* Date & Time Picker */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
                <Calendar size={13} /> Date
              </label>
              <input
                type="date"
                value={dateStr}
                onChange={(e) => setDateStr(e.target.value)}
                required
                style={{
                  width: '100%',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '9px 10px',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
                <Clock size={13} /> Time
              </label>
              <input
                type="time"
                value={timeStr}
                onChange={(e) => setTimeStr(e.target.value)}
                required
                style={{
                  width: '100%',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '9px 10px',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Recurrence Selector */}
          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: 6 }}>
              Repeat Frequency
            </label>
            <select
              value={recurrence}
              onChange={(e) => setRecurrence(e.target.value as RecurrenceType)}
              style={{
                width: '100%',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '9px 10px',
                color: 'var(--text-primary)',
                fontSize: '0.88rem',
                outline: 'none'
              }}
            >
              <option value="NONE">One-time only</option>
              <option value="DAILY">Daily</option>
              <option value="WEEKLY">Weekly</option>
              <option value="MONTHLY">Monthly</option>
              <option value="YEARLY">Yearly</option>
            </select>
          </div>

          {/* Direct Dial Preference Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderTop: '1px solid var(--border-subtle)' }}>
            <div>
              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Direct Cellular Dial
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Directly places phone call when alarm triggers
              </div>
            </div>
            <input
              type="checkbox"
              checked={directDial}
              onChange={(e) => setDirectDial(e.target.checked)}
              style={{ width: 18, height: 18, accentColor: 'var(--accent-call)' }}
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                flex: 2,
                background: 'var(--accent-call)',
                border: 'none',
                color: 'var(--text-inverse)',
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 800,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6
              }}
            >
              <PhoneCall size={16} />
              Save Call Reminder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
