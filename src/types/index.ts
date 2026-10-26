export type ReminderType = 'CALL' | 'STANDARD' | 'BIRTHDAY';
export type RecurrenceType = 'NONE' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
export type PriorityLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface ReminderItem {
  id: string;
  title: string;
  type: ReminderType;
  eventTime: number; // epoch ms
  targetNumber?: string;
  contactName?: string;
  isCompleted: boolean;
  recurrence: RecurrenceType;
  priority: PriorityLevel;
  directDial: boolean;
  createdAt: number;
}

export interface BirthdayItem {
  id: string;
  name: string;
  birthDate: string; // YYYY-MM-DD (e.g. 2001-11-28)
  phoneNumber: string;
  notifyTime: string; // HH:mm (e.g. 08:00)
  autoDirectCall: boolean;
  notes?: string;
  createdAt: number;
}

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  colorTag: string;
  isPinned: boolean;
  updatedAt: number;
}
