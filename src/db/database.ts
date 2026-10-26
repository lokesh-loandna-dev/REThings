import Dexie, { type Table } from 'dexie';
import type { ReminderItem, BirthdayItem, NoteItem } from '../types';

export class ReminderDatabase extends Dexie {
  reminders!: Table<ReminderItem, string>;
  birthdays!: Table<BirthdayItem, string>;
  notes!: Table<NoteItem, string>;

  constructor() {
    super('ReminderOfflineDB');
    this.version(1).stores({
      reminders: 'id, type, eventTime, isCompleted, priority, targetNumber',
      birthdays: 'id, name, birthDate',
      notes: 'id, isPinned, updatedAt'
    });
  }
}

export const db = new ReminderDatabase();

// Seed initial data if database is empty
export async function seedInitialData() {
  const birthdayCount = await db.birthdays.count();
  if (birthdayCount === 0) {
    // Seed Mother's Birthday as requested in user specification
    const motherBirthday: BirthdayItem = {
      id: 'bday-mother-01',
      name: 'Mother',
      birthDate: '2001-11-28',
      phoneNumber: '+1 (555) 019-2834',
      notifyTime: '08:00',
      autoDirectCall: true,
      notes: 'Remember to call Mom and wish her a wonderful birthday morning!',
      createdAt: Date.now()
    };
    await db.birthdays.add(motherBirthday);

    // Also add scheduled Call Reminder for Mother
    const nextNov28 = new Date();
    nextNov28.setMonth(10); // November (0-indexed)
    nextNov28.setDate(28);
    nextNov28.setHours(8, 0, 0, 0);

    const callReminder: ReminderItem = {
      id: 'rem-call-mother',
      title: "Call Mother for Birthday",
      type: 'BIRTHDAY',
      eventTime: nextNov28.getTime(),
      targetNumber: '+1 (555) 019-2834',
      contactName: 'Mother',
      isCompleted: false,
      recurrence: 'YEARLY',
      priority: 'HIGH',
      directDial: true,
      createdAt: Date.now()
    };
    await db.reminders.add(callReminder);

    // Add sample notes
    await db.notes.add({
      id: 'note-01',
      title: 'Mom Birthday Gift Ideas',
      content: '1. Handcrafted photo album\n2. Favorite jasmine tea blend\n3. Call early morning at 8:00 AM',
      colorTag: '#10B981',
      isPinned: true,
      updatedAt: Date.now()
    });
  }
}
