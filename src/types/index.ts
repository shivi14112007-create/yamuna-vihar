export interface Pledge {
  id: string;
  certificateId: string;
  fullName: string;
  email: string;
  phone?: string;
  city: string;
  state: string;
  country: string;
  organization?: string;
  pledgeAccepted: boolean;
  pledgeAcceptedAt: string;
  createdAt: string;
  status: 'valid' | 'revoked';
}

export interface PledgeFormData {
  fullName: string;
  email: string;
  phone?: string;
  city: string;
  state: string;
  country: string;
  organization?: string;
}

export interface AdminUser {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  createdAt: string;
}

export interface PublicVerificationResult {
  found: boolean;
  certificateId?: string;
  fullName?: string;
  city?: string;
  state?: string;
  country?: string;
  pledgeAcceptedAt?: string;
  status?: 'valid' | 'revoked';
  organization?: string;
}

export interface ImpactStats {
  totalPledges: number;
  certificatesGenerated: number;
  todayPledges: number;
  uniqueCities: number;
  uniqueStates: number;
}

export interface AnalyticsData {
  pledgesOverTime: { date: string; count: number }[];
  pledgesByState: { state: string; count: number }[];
  pledgesByCity: { city: string; count: number }[];
  dailyPledges: number;
  monthlyPledges: number;
}
