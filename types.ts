
export interface TimeSlot {
  id: string;
  time: string;
  isAvailable: boolean;
}

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  tag: string;
  imageUrl: string;
}

export interface WaitlistEntry {
  id: string;
  name: string;
  phone: string;
  timestamp: Date;
}

export interface Member {
  id: string;
  name: string;
  phone: string;
  joinedAt: Date;
}

export interface BookingDetails {
  id: string;
  date: Date;
  time: string;
  duration: 60 | 90;
  name: string;
  phone: string;
  notification: 'SMS' | 'WhatsApp';
  playerType: 'Member' | 'Guest';
  totalPaid: number;
  qrCode?: string;
}
