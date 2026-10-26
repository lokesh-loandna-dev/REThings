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
