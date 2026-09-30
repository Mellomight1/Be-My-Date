export type AppTheme = 'sunset' | 'midnight';

export interface InviteConfig {
  recipientName: string;
  senderName: string;
  customMessage: string;
  theme: AppTheme;
}

export interface DatePlan {
  date: string; // YYYY-MM-DD
  time: string; // e.g. "19:30"
  preferredFood: string; // user's custom preferred food/dish
}
