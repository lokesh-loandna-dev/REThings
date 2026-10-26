import type { ReminderItem } from '../types';
import { PhoneCall, Clock, CheckCircle2, Circle, Trash2, BellRing, PlusCircle } from 'lucide-react';
import { formatEventTime } from '../utils/dateUtils';
import { initiatePhoneCall } from '../utils/telephony';

interface TimelineViewProps {
  reminders: ReminderItem[];
  onToggleComplete: (id: string, current: boolean) => void;
  onDeleteReminder: (id: string) => void;
  onOpenCreateCall: () => void;
  onTriggerAlarmTest: (reminder: ReminderItem) => void;
}

export default function TimelineView({
  reminders,
  onToggleComplete,
  onDeleteReminder,
  onOpenCreateCall,
  onTriggerAlarmTest
}: TimelineViewProps) {
  const pendingReminders = reminders.filter((r) => !r.isCompleted);
  const completedReminders = reminders.filter((r) => r.isCompleted);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Overview Stat Bar */}
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
            Scheduled Alarms
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: 2 }} className="tabular-nums">
            {pendingReminders.length} Active
          </div>
        </div>
        <button
          onClick={onOpenCreateCall}
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
          New Call
        </button>
      </div>

      {/* Active Call Reminders */}
      <div>
        <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 12 }}>
          Upcoming Call Queue
        </h2>

        {pendingReminders.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '40px 20px',
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-md)',
              border: '1px dashed var(--border-subtle)'
            }}
          >
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto' }}>
              <PhoneCall size={20} color="var(--accent-call)" />
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
              No Scheduled Calls
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: 260, margin: '0 auto 16px auto' }}>
              Create your first call reminder. On the scheduled date and time, it triggers a direct phone call.
            </p>
            <button
              onClick={onOpenCreateCall}
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
              + Schedule Call Reminder
            </button>
          </div>
        ) : (
          pendingReminders.map((rem) => (
            <div key={rem.id} className="task-card">
              <button
                onClick={() => onToggleComplete(rem.id, rem.isCompleted)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}
                title="Mark Completed"
              >
                <Circle size={20} />
              </button>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3, flexWrap: 'wrap' }}>
                  <span className="call-badge">
                    <PhoneCall size={11} />
                    {rem.type === 'BIRTHDAY' ? 'BIRTHDAY CALL' : 'CALL'}
                  </span>
                  {rem.targetNumber && (
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }} className="tabular-nums">
                      {rem.targetNumber}
                    </span>
                  )}
                  {rem.recurrence !== 'NONE' && (
                    <span style={{ fontSize: '0.68rem', color: 'var(--accent-info)', background: 'rgba(59, 130, 246, 0.1)', padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}>
                      {rem.recurrence}
                    </span>
                  )}
                </div>

                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', wordBreak: 'break-word' }}>
                  {rem.contactName ? `Call ${rem.contactName}` : rem.title}
                </div>

                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }} className="tabular-nums">
                  <Clock size={12} />
                  {formatEventTime(rem.eventTime)}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button
                  onClick={() => onTriggerAlarmTest(rem)}
                  style={{
                    background: 'var(--bg-ground)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--accent-warning)',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    fontSize: '0.75rem',
                    fontWeight: 600
                  }}
                  title="Test Alarm Screen"
                >
                  <BellRing size={14} />
                  Test
                </button>

                {rem.targetNumber && (
                  <button
                    onClick={() => initiatePhoneCall(rem.targetNumber!)}
                    style={{
                      background: 'var(--accent-call)',
                      color: 'var(--text-inverse)',
                      border: 'none',
                      borderRadius: 'var(--radius-sm)',
                      padding: '8px 12px',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      cursor: 'pointer'
                    }}
                    title="Direct Dial"
                  >
                    <PhoneCall size={13} />
                    Call
                  </button>
                )}

                <button
                  onClick={() => onDeleteReminder(rem.id)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Completed History Section */}
      {completedReminders.length > 0 && (
        <div style={{ marginTop: 10 }}>
          <h2 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>
            Completed ({completedReminders.length})
          </h2>
          {completedReminders.map((rem) => (
            <div key={rem.id} className="task-card" style={{ opacity: 0.6 }}>
              <button
                onClick={() => onToggleComplete(rem.id, rem.isCompleted)}
                style={{ background: 'transparent', border: 'none', color: 'var(--accent-call)', cursor: 'pointer', padding: 4 }}
              >
                <CheckCircle2 size={20} />
              </button>

              <div style={{ flex: 1, minWidth: 0, textDecoration: 'line-through' }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  {rem.contactName ? `Call ${rem.contactName}` : rem.title}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {rem.targetNumber}
                </div>
              </div>

              <button
                onClick={() => onDeleteReminder(rem.id)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
