/**
 * Utility functions for date calculations, birthday milestones, and countdowns.
 */

export function calculateAge(birthDateStr: string): { currentAge: number; nextAge: number; daysUntil: number } {
  const [yearStr, monthStr, dayStr] = birthDateStr.split('-');
  const birthYear = parseInt(yearStr, 10);
  const birthMonth = parseInt(monthStr, 10) - 1; // 0-indexed
  const birthDay = parseInt(dayStr, 10);

  const now = new Date();
  const currentYear = now.getFullYear();

  // Current age
  let currentAge = currentYear - birthYear;
  const hasHadBirthdayThisYear =
    now.getMonth() > birthMonth || (now.getMonth() === birthMonth && now.getDate() >= birthDay);

  if (!hasHadBirthdayThisYear) {
    currentAge -= 1;
  }

  // Next birthday calculation
  let nextBirthday = new Date(currentYear, birthMonth, birthDay);
  if (now.getTime() > nextBirthday.getTime() + 86400000) {
    // If birthday already passed this year, next one is next year
    nextBirthday = new Date(currentYear + 1, birthMonth, birthDay);
  }

  const nextAge = nextBirthday.getFullYear() - birthYear;

  // Days until next birthday
  const diffTime = nextBirthday.getTime() - now.getTime();
  const daysUntil = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  return {
    currentAge: Math.max(0, currentAge),
    nextAge: Math.max(1, nextAge),
    daysUntil
  };
}

export function formatEventTime(timestamp: number): string {
  const date = new Date(timestamp);
  const today = new Date();
  const isToday =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (isToday) {
    return `Today at ${timeStr}`;
  }

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const isTomorrow =
    date.getDate() === tomorrow.getDate() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getFullYear() === tomorrow.getFullYear();

  if (isTomorrow) {
    return `Tomorrow at ${timeStr}`;
  }

  return `${date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })} at ${timeStr}`;
}
