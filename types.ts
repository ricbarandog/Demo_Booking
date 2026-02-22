
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
  email: string;
  phone: string;
  timestamp: Date;
}

export interface BookingDetails {
  id: string;
  date: Date;
  time: string;
  duration: 60 | 90;
  name: string;
  email: string;
  notification: 'Email' | 'WhatsApp';
  playerType: 'Member' | 'Guest';
  totalPaid: number;
}
