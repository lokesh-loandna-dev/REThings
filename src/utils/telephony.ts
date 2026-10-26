/**
 * Telephony helpers for direct calling and contact selection.
 */

export function initiatePhoneCall(phoneNumber: string) {
  if (!phoneNumber) return;
  // Clean phone number
  const cleanNumber = phoneNumber.replace(/[^0-9+]/g, '');
  window.location.href = `tel:${cleanNumber}`;
}

export async function pickContact(): Promise<{ name: string; number: string } | null> {
  // Try modern Web Contact Picker API if supported on mobile device
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
