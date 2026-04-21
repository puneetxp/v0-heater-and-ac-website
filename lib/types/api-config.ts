export interface ApiConfig {
  id: number;
  name: string;
  provider: 'intax' | 'stripe' | 'twilio' | 'sendgrid' | string;
  api_key: string;
  book_id: number | null;
  is_enabled: boolean;
  description: string | null;
  settings: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export type ApiConfigProvider = 'intax' | 'stripe' | 'twilio' | 'sendgrid' | 'custom';

export const API_PROVIDERS: Record<ApiConfigProvider, string> = {
  intax: 'Intax ERP',
  stripe: 'Stripe Payments',
  twilio: 'Twilio SMS',
  sendgrid: 'SendGrid Email',
  custom: 'Custom API',
};
