import type { BirthdayItem } from '../types';
import { Cake, PhoneCall, Calendar, PlusCircle, BellRing, Trash2 } from 'lucide-react';
import { calculateAge } from '../utils/dateUtils';
import { initiatePhoneCall } from '../utils/telephony';

interface BirthdaysViewProps {
  birthdays: BirthdayItem[];
  onDeleteBirthday: (id: string) => void;
  onOpenCreateBirthday: () => void;
  onTriggerBirthdayAlarm: (birthday: BirthdayItem) => void;
}

export default function BirthdaysView({
  birthdays,
  onDeleteBirthday,
  onOpenCreateBirthday,
  onTriggerBirthdayAlarm
}: BirthdaysViewProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header Summary */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '14px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Tracked Birthdays
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: 2 }} className="tabular-nums">
            {birthdays.length} Contacts
          </div>
        </div>
        <button
          onClick={onOpenCreateBirthday}
          style={{
            background: 'var(--accent-call)',
            color: 'var(--text-inverse)',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            padding: '8px 14px',
            fontSize: '0.82rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            cursor: 'pointer'
          }}
        >
          <PlusCircle size={15} />
          Add Birthday
        </button>
      </div>

      <div>
        <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 12 }}>
          Annual Milestones & Call Reminders
        </h2>

        {birthdays.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '40px 20px',
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-md)',
              border: '1px dashed var(--border-subtle)'
            }}
          >
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(245, 158, 11, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto' }}>
              <Cake size={20} color="var(--accent-warning)" />
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
              No Birthdays Tracked
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: 280, margin: '0 auto 16px auto' }}>
              Save important birthdays (like Mother, Father, friends). The app will automatically calculate their age and ring a direct-dial call alarm on their birthday morning.
            </p>
            <button
              onClick={onOpenCreateBirthday}
              style={{
                background: 'transparent',
                border: '1px solid var(--accent-call)',
                color: 'var(--accent-call)',
                padding: '8px 16px',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              + Track New Birthday
            </button>
          </div>
        ) : (
          birthdays.map((bday) => {
            const ageInfo = calculateAge(bday.birthDate);
            return (
              <div key={bday.id} className="task-card" style={{ borderLeft: '3px solid var(--accent-call)', flexDirection: 'column', alignItems: 'stretch', gap: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                        {bday.name}
                      </span>
                      <span
                        style={{
                          background: 'rgba(16, 185, 129, 0.12)',
                          color: 'var(--accent-call)',
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.72rem',
                          fontWeight: 700
                        }}
                        className="tabular-nums"
                      >
                        Turning {ageInfo.nextAge}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }} className="tabular-nums">
                      {bday.phoneNumber}
                    </div>

                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                      <Calendar size={12} />
                      Born: {bday.birthDate} • Alarm at {bday.notifyTime} AM
                    </div>

                    {bday.notes && (
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 6, fontStyle: 'italic', background: 'var(--bg-ground)', padding: '4px 8px', borderRadius: 4 }}>
                        "{bday.notes}"
                      </div>
                    )}
                  </div>

                  {/* Countdown Badge */}
                  <div style={{ textAlign: 'right' }}>
                    <div
                      style={{
                        background: ageInfo.daysUntil === 0 ? 'var(--accent-call)' : 'var(--bg-ground)',
                        color: ageInfo.daysUntil === 0 ? 'var(--text-inverse)' : 'var(--accent-warning)',
                        border: '1px solid var(--border-subtle)',
                        padding: '4px 8px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.75rem',
                        fontWeight: 800
                      }}
                      className="tabular-nums"
                    >
                      {ageInfo.daysUntil === 0 ? '🎉 TODAY!' : `in ${ageInfo.daysUntil} days`}
                    </div>
                  </div>
                </div>

                {/* Card Action Row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: 10 }}>
                  <button
                    onClick={() => onTriggerBirthdayAlarm(bday)}
                    style={{
                      background: 'var(--bg-ground)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--accent-warning)',
                      padding: '6px 10px',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: '0.74rem',
                      fontWeight: 600
                    }}
                    title="Simulate 08:00 AM Birthday Alarm"
                  >
                    <BellRing size={13} />
                    Test 08:00 AM Alarm
                  </button>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button
                      onClick={() => initiatePhoneCall(bday.phoneNumber)}
                      style={{
                        background: 'var(--accent-call)',
                        color: 'var(--text-inverse)',
                        border: 'none',
                        borderRadius: 'var(--radius-sm)',
                        padding: '6px 12px',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        cursor: 'pointer'
                      }}
                    >
                      <PhoneCall size={13} />
                      Call Now
                    </button>

                    <button
                      onClick={() => onDeleteBirthday(bday.id)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
