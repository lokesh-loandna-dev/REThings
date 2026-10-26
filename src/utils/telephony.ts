import { registerPlugin, Capacitor } from '@capacitor/core';

export interface CallReminderPluginInterface {
  scheduleCallAlarm(options: {
    id: string;
    timestamp: number;
    phoneNumber: string;
    contactName: string;
    title: string;
    isBirthday?: boolean;
    ageMilestone?: number;
  }): Promise<{ scheduled: boolean; alarmId: number }>;

  cancelCallAlarm(options: { id: string }): Promise<{ cancelled: boolean }>;

  directDial(options: { phoneNumber: string }): Promise<{ success: boolean }>;
}

export const CallReminderNative = registerPlugin<CallReminderPluginInterface>('CallReminder');

export async function initiatePhoneCall(phoneNumber: string) {
  if (!phoneNumber) return;
  const cleanNumber = phoneNumber.replace(/[^0-9+]/g, '');

  if (Capacitor.isNativePlatform()) {
    try {
      await CallReminderNative.directDial({ phoneNumber: cleanNumber });
      return;
    } catch (e) {
      console.warn('Native direct dial fallback to window.location', e);
    }
  }

  // Fallback to standard telephony URI
  window.location.href = `tel:${cleanNumber}`;
}

export async function scheduleNativeCallAlarm(params: {
  id: string;
  timestamp: number;
  phoneNumber: string;
  contactName: string;
  title: string;
  isBirthday?: boolean;
  ageMilestone?: number;
}) {
  if (Capacitor.isNativePlatform()) {
    try {
      await CallReminderNative.scheduleCallAlarm(params);
    } catch (e) {
      console.warn('Failed to register native alarm', e);
    }
  }
}

export async function cancelNativeCallAlarm(id: string) {
  if (Capacitor.isNativePlatform()) {
    try {
      await CallReminderNative.cancelCallAlarm({ id });
    } catch (e) {
      console.warn('Failed to cancel native alarm', e);
    }
  }
}

export async function pickContact(): Promise<{ name: string; number: string } | null> {
  if ('contacts' in navigator && 'ContactsManager' in window) {
    try {
      const nav = navigator as unknown as {
        contacts: {
          select: (props: string[], opts: { multiple: boolean }) => Promise<Array<{ name?: string[]; tel?: string[] }>>;
        };
      };
      const contacts = await nav.contacts.select(['name', 'tel'], { multiple: false });
      if (contacts && contacts.length > 0) {
        const contact = contacts[0];
        const name = contact.name && contact.name[0] ? contact.name[0] : '';
        const number = contact.tel && contact.tel[0] ? contact.tel[0] : '';
        return { name, number };
      }
    } catch {
      // User cancelled or browser denied
    }
  }
  return null;
}
