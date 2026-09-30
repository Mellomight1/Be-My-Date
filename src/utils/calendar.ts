import { DatePlan, InviteConfig } from '../types';

export function formatDateTimeToICS(dateStr: string, timeStr: string): { start: string; end: string } {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hours, minutes] = timeStr.split(':').map(Number);

  const startDate = new Date(year, (month || 1) - 1, day || 1, hours || 19, minutes || 0, 0);
  const endDate = new Date(startDate.getTime() + 2.5 * 60 * 60 * 1000); // 2.5 hours dinner

  const pad = (n: number) => String(n).padStart(2, '0');

  const toICSString = (d: Date) => {
    return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
  };

  return {
    start: toICSString(startDate),
    end: toICSString(endDate),
  };
}

export function generateGoogleCalendarUrl(plan: DatePlan, invite: InviteConfig): string {
  const { start, end } = formatDateTimeToICS(plan.date, plan.time);
  const title = encodeURIComponent(`Dinner Date with ${invite.recipientName || 'You'} & ${invite.senderName || 'Me'} 🍷`);
  
  let detailsText = `Dinner Date Plan!\n\n`;
  if (plan.preferredFood) detailsText += `🍽️ Preferred Food: ${plan.preferredFood}\n`;
  detailsText += `\n"I knew you would say yes!" ❤️`;

  const details = encodeURIComponent(detailsText);
  const location = encodeURIComponent(plan.preferredFood ? `${plan.preferredFood} Place` : 'Dinner Spot');

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
}

export function downloadICSFile(plan: DatePlan, invite: InviteConfig) {
  const { start, end } = formatDateTimeToICS(plan.date, plan.time);
  const title = `Dinner Date with ${invite.recipientName || 'You'} & ${invite.senderName || 'Me'} 🍷`;
  const description = `Dinner Date!\nPreferred Food: ${plan.preferredFood || 'Surprise'}\n"I knew you would say yes!" ❤️`;
  
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//DinnerDateInviter//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `SUMMARY:${title}`,
    `DESCRIPTION:${description.replace(/\n/g, '\\n')}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `LOCATION:${plan.preferredFood ? `${plan.preferredFood} Place` : 'Dinner Spot'}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `dinner-date-${plan.date}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
