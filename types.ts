
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
