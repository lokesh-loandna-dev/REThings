import { useState } from 'react';
import { X, Cake, Calendar, Clock, UserPlus, Gift } from 'lucide-react';
import { calculateAge } from '../utils/dateUtils';
import { pickContact } from '../utils/telephony';

interface BirthdayModalProps {
  onClose: () => void;
  onSave: (data: {
    name: string;
    birthDate: string;
    phoneNumber: string;
    notifyTime: string;
    autoDirectCall: boolean;
    notes?: string;
  }) => void;
}

export default function BirthdayModal({ onClose, onSave }: BirthdayModalProps) {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [birthDate, setBirthDate] = useState('2001-11-28');
  const [notifyTime, setNotifyTime] = useState('08:00');
  const [autoDirectCall, setAutoDirectCall] = useState(true);
  const [notes, setNotes] = useState('');

  const agePreview = birthDate ? calculateAge(birthDate) : null;

  const handlePickContact = async () => {
    const result = await pickContact();
    if (result) {
      if (result.name) setName(result.name);
      if (result.number) setPhoneNumber(result.number);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !birthDate || !phoneNumber.trim()) return;

    onSave({
      name: name.trim(),
      birthDate,
      phoneNumber: phoneNumber.trim(),
      notifyTime,
      autoDirectCall,
      notes: notes.trim()
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle"></div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ background: 'rgba(245, 158, 11, 0.12)', padding: 7, borderRadius: 8 }}>
              <Cake size={18} color="var(--accent-warning)" />
            </div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Add Birthday & Milestone
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
          {/* Person Name & Picker */}
          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: 6 }}>
              Person / Family Member
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="text"
                placeholder="e.g. Mother, Father, Best Friend"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
              >
                <UserPlus size={16} color="var(--accent-warning)" />
                Pick
              </button>
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: 6 }}>
              Phone Number (for Birthday Morning Call)
            </label>
            <input
              type="tel"
              placeholder="+1 555 019 2834"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
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

          {/* Birth Date & Age Calculator Preview */}
          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
              <Calendar size={13} /> Birth Date (YYYY-MM-DD)
            </label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              required
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
            />

            {agePreview && (
              <div
                style={{
                  background: 'rgba(245, 158, 11, 0.08)',
                  border: '1px solid rgba(245, 158, 11, 0.2)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '8px 12px',
                  marginTop: 8,
                  fontSize: '0.82rem',
                  color: 'var(--accent-warning)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span>
                  Currently <strong>{agePreview.currentAge}</strong> years old
                </span>
                <span className="tabular-nums">
                  Turning <strong>{agePreview.nextAge}</strong> in {agePreview.daysUntil} days!
                </span>
              </div>
            )}
          </div>

          {/* Morning Alert Time */}
          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
              <Clock size={13} /> Morning Call Alert Time
            </label>
            <input
              type="time"
              value={notifyTime}
              onChange={(e) => setNotifyTime(e.target.value)}
              required
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
            />
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginTop: 4 }}>
              App triggers an annual direct-dial incoming-call alarm on this time every year.
            </span>
          </div>

          {/* Notes / Gift ideas */}
          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
              <Gift size={13} /> Notes & Gift Ideas
            </label>
            <textarea
              placeholder="e.g. Favorite flowers, morning tea, gift wishlist..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              style={{
                width: '100%',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '8px 10px',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
                outline: 'none',
                resize: 'none'
              }}
            />
          </div>

          {/* Direct Dial Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderTop: '1px solid var(--border-subtle)' }}>
            <div>
              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Direct Outbound Call on Alarm
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Initiates direct cellular dial immediately when confirmed
              </div>
            </div>
            <input
              type="checkbox"
              checked={autoDirectCall}
              onChange={(e) => setAutoDirectCall(e.target.checked)}
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
              <Cake size={16} />
              Save Birthday Reminder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
