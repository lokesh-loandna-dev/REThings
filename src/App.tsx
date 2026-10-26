import { useEffect, useState } from 'react';
import { db } from './db/database';
import type { ReminderItem, BirthdayItem, NoteItem, RecurrenceType } from './types';
import Header from './components/Header';
import BottomNav, { type TabType } from './components/BottomNav';
import TimelineView from './components/TimelineView';
import BirthdaysView from './components/BirthdaysView';
import NotesView from './components/NotesView';
import SettingsView from './components/SettingsView';
import CallReminderModal from './components/CallReminderModal';
import BirthdayModal from './components/BirthdayModal';
import NoteModal from './components/NoteModal';
import CallAlarmScreen, { type AlarmTargetData } from './components/CallAlarmScreen';
import { calculateAge } from './utils/dateUtils';
import { PhoneCall, Cake, FileText, X } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('timeline');
  const [reminders, setReminders] = useState<ReminderItem[]>([]);
  const [birthdays, setBirthdays] = useState<BirthdayItem[]>([]);
  const [notes, setNotes] = useState<NoteItem[]>([]);

  // Modals
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [isBirthdayModalOpen, setIsBirthdayModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);

  // Active Alarm
  const [activeAlarm, setActiveAlarm] = useState<AlarmTargetData | null>(null);

  useEffect(() => {
    loadAllData();
  }, []);

  // Background Alarm Poller (Runs every 10 seconds for real-time foreground triggers)
  useEffect(() => {
    const interval = setInterval(() => {
      checkDueAlarms();
    }, 10000);
    return () => clearInterval(interval);
  }, [reminders, birthdays]);

  const loadAllData = async () => {
    const r = await db.reminders.toArray();
    const b = await db.birthdays.toArray();
    const n = await db.notes.toArray();
    setReminders(r);
    setBirthdays(b);
    setNotes(n);
  };

  const checkDueAlarms = () => {
    if (activeAlarm) return; // Already alarming
    const now = Date.now();

    for (const rem of reminders) {
      if (!rem.isCompleted && rem.eventTime <= now && now - rem.eventTime < 1800000) {
        // Trigger within 30 min window
        setActiveAlarm({
          title: rem.title,
          contactName: rem.contactName || 'Scheduled Contact',
          phoneNumber: rem.targetNumber || '',
          isBirthday: rem.type === 'BIRTHDAY'
        });
        break;
      }
    }
  };

  // --- REMINDERS CRUD ---
  const handleSaveCallReminder = async (data: {
    contactName: string;
    targetNumber: string;
    eventTime: number;
    recurrence: RecurrenceType;
    directDial: boolean;
  }) => {
    const newReminder: ReminderItem = {
      id: `call-${Date.now()}`,
      title: `Call ${data.contactName}`,
      type: 'CALL',
      eventTime: data.eventTime,
      targetNumber: data.targetNumber,
      contactName: data.contactName,
      isCompleted: false,
      recurrence: data.recurrence,
      priority: 'HIGH',
      directDial: data.directDial,
      createdAt: Date.now()
    };

    await db.reminders.add(newReminder);
    setIsCallModalOpen(false);
    await loadAllData();
  };

  const handleToggleComplete = async (id: string, current: boolean) => {
    await db.reminders.update(id, { isCompleted: !current });
    await loadAllData();
  };

  const handleDeleteReminder = async (id: string) => {
    await db.reminders.delete(id);
    await loadAllData();
  };

  // --- BIRTHDAYS CRUD ---
  const handleSaveBirthday = async (data: {
    name: string;
    birthDate: string;
    phoneNumber: string;
    notifyTime: string;
    autoDirectCall: boolean;
    notes?: string;
  }) => {
    const newBirthday: BirthdayItem = {
      id: `bday-${Date.now()}`,
      name: data.name,
      birthDate: data.birthDate,
      phoneNumber: data.phoneNumber,
      notifyTime: data.notifyTime,
      autoDirectCall: data.autoDirectCall,
      notes: data.notes,
      createdAt: Date.now()
    };
    await db.birthdays.add(newBirthday);

    const [, monthStr, dayStr] = data.birthDate.split('-');
    const [hoursStr, minutesStr] = data.notifyTime.split(':');
    const now = new Date();
    let nextDate = new Date(now.getFullYear(), parseInt(monthStr, 10) - 1, parseInt(dayStr, 10), parseInt(hoursStr, 10), parseInt(minutesStr, 10), 0);
    if (nextDate.getTime() < now.getTime()) {
      nextDate = new Date(now.getFullYear() + 1, parseInt(monthStr, 10) - 1, parseInt(dayStr, 10), parseInt(hoursStr, 10), parseInt(minutesStr, 10), 0);
    }

    const linkedReminder: ReminderItem = {
      id: `call-bday-${newBirthday.id}`,
      title: `Call ${data.name} for Birthday`,
      type: 'BIRTHDAY',
      eventTime: nextDate.getTime(),
      targetNumber: data.phoneNumber,
      contactName: data.name,
      isCompleted: false,
      recurrence: 'YEARLY',
      priority: 'HIGH',
      directDial: data.autoDirectCall,
      createdAt: Date.now()
    };
    await db.reminders.add(linkedReminder);

    setIsBirthdayModalOpen(false);
    await loadAllData();
  };

  const handleDeleteBirthday = async (id: string) => {
    await db.birthdays.delete(id);
    await db.reminders.delete(`call-bday-${id}`);
    await loadAllData();
  };

  // --- NOTES CRUD ---
  const handleSaveNote = async (data: { title: string; content: string; colorTag: string; isPinned: boolean }) => {
    const newNote: NoteItem = {
      id: `note-${Date.now()}`,
      title: data.title,
      content: data.content,
      colorTag: data.colorTag,
      isPinned: data.isPinned,
      updatedAt: Date.now()
    };
    await db.notes.add(newNote);
    setIsNoteModalOpen(false);
    await loadAllData();
  };

  const handleDeleteNote = async (id: string) => {
    await db.notes.delete(id);
    await loadAllData();
  };

  const handleTogglePinNote = async (id: string, current: boolean) => {
    await db.notes.update(id, { isPinned: !current, updatedAt: Date.now() });
    await loadAllData();
  };

  const handleClearAllData = async () => {
    if (window.confirm('Are you sure you want to completely wipe all local vault data? This cannot be undone.')) {
      await db.reminders.clear();
      await db.birthdays.clear();
      await db.notes.clear();
      await loadAllData();
    }
  };

  // --- ALARM TRIGGERS ---
  const handleTriggerAlarmTest = (rem: ReminderItem) => {
    setActiveAlarm({
      title: rem.title,
      contactName: rem.contactName || 'Contact',
      phoneNumber: rem.targetNumber || '+15550000000',
      isBirthday: rem.type === 'BIRTHDAY'
    });
  };

  const handleTriggerBirthdayAlarm = (bday: BirthdayItem) => {
    const ageInfo = calculateAge(bday.birthDate);
    setActiveAlarm({
      title: `Annual Morning Birthday Call`,
      contactName: bday.name,
      phoneNumber: bday.phoneNumber,
      isBirthday: true,
      ageMilestone: ageInfo.nextAge
    });
  };

  return (
    <div className="app-viewport">
      <Header onOpenVault={() => setCurrentTab('vault')} />

      <main className="app-content">
        {currentTab === 'timeline' && (
          <TimelineView
            reminders={reminders}
            onToggleComplete={handleToggleComplete}
            onDeleteReminder={handleDeleteReminder}
            onOpenCreateCall={() => setIsCallModalOpen(true)}
            onTriggerAlarmTest={handleTriggerAlarmTest}
          />
        )}

        {currentTab === 'birthdays' && (
          <BirthdaysView
            birthdays={birthdays}
            onDeleteBirthday={handleDeleteBirthday}
            onOpenCreateBirthday={() => setIsBirthdayModalOpen(true)}
            onTriggerBirthdayAlarm={handleTriggerBirthdayAlarm}
          />
        )}

        {currentTab === 'notes' && (
          <NotesView
            notes={notes}
            onDeleteNote={handleDeleteNote}
            onOpenCreateNote={() => setIsNoteModalOpen(true)}
            onTogglePin={handleTogglePinNote}
          />
        )}

        {currentTab === 'vault' && (
          <SettingsView
            remindersCount={reminders.length}
            birthdaysCount={birthdays.length}
            notesCount={notes.length}
            onClearAll={handleClearAllData}
            onTriggerSampleAlarm={() =>
              setActiveAlarm({
                title: 'Test Call Reminder',
                contactName: 'Sample Contact',
                phoneNumber: '+1 (555) 019-2834',
                isBirthday: false
              })
            }
          />
        )}
      </main>

      <BottomNav
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        onOpenCreateMenu={() => setIsActionMenuOpen(true)}
      />

      {/* Center + Action Sheet */}
      {isActionMenuOpen && (
        <div className="modal-backdrop" onClick={() => setIsActionMenuOpen(false)}>
          <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-handle"></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Create New Entry
              </div>
              <button
                onClick={() => setIsActionMenuOpen(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                onClick={() => {
                  setIsActionMenuOpen(false);
                  setIsCallModalOpen(true);
                }}
                className="task-card"
                style={{ cursor: 'pointer', textAlign: 'left', width: '100%' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: 10, borderRadius: 10 }}>
                    <PhoneCall size={20} color="var(--accent-call)" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                      Schedule Call Reminder
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Auto direct-dial alarm to a contact
                    </div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  setIsActionMenuOpen(false);
                  setIsBirthdayModalOpen(true);
                }}
                className="task-card"
                style={{ cursor: 'pointer', textAlign: 'left', width: '100%' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ background: 'rgba(245, 158, 11, 0.15)', padding: 10, borderRadius: 10 }}>
                    <Cake size={20} color="var(--accent-warning)" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                      Add Birthday Milestone
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Age calculator & annual morning call
                    </div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  setIsActionMenuOpen(false);
                  setIsNoteModalOpen(true);
                }}
                className="task-card"
                style={{ cursor: 'pointer', textAlign: 'left', width: '100%' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ background: 'rgba(59, 130, 246, 0.15)', padding: 10, borderRadius: 10 }}>
                    <FileText size={20} color="var(--accent-info)" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                      Create Private Note
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Encrypted local thoughts & checklists
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Creation Modals */}
      {isCallModalOpen && (
        <CallReminderModal
          onClose={() => setIsCallModalOpen(false)}
          onSave={handleSaveCallReminder}
        />
      )}

      {isBirthdayModalOpen && (
        <BirthdayModal
          onClose={() => setIsBirthdayModalOpen(false)}
          onSave={handleSaveBirthday}
        />
      )}

      {isNoteModalOpen && (
        <NoteModal
          onClose={() => setIsNoteModalOpen(false)}
          onSave={handleSaveNote}
        />
      )}

      {/* Full-Screen Incoming Call Alarm Interface */}
      {activeAlarm && (
        <CallAlarmScreen
          alarmData={activeAlarm}
          onDismiss={() => setActiveAlarm(null)}
          onSnooze={() => {
            setActiveAlarm(null);
          }}
        />
      )}
    </div>
  );
}
