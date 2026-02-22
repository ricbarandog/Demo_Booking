
import { NewsItem, TimeSlot } from './types.ts';

export const COLORS = {
  forestGreen: '#1b4332',
  courtBlue: '#e0f2fe',
  accentGreen: '#d9f99d',
};

export const CLUB_RATES = {
  member: 500,
  nonMember: 800,
  guestFee: 200,
};

export const INITIAL_MOCK_SLOTS: TimeSlot[] = [
  { id: '1', time: '07:00 AM', isAvailable: true },
  { id: '2', time: '08:30 AM', isAvailable: false },
  { id: '3', time: '10:00 AM', isAvailable: true },
  { id: '4', time: '11:30 AM', isAvailable: true },
  { id: '5', time: '01:00 PM', isAvailable: true },
  { id: '6', time: '02:30 PM', isAvailable: false },
  { id: '7', time: '04:00 PM', isAvailable: true },
  { id: '8', time: '05:30 PM', isAvailable: true },
];

export const INITIAL_MOCK_NEWS: NewsItem[] = [
  {
    id: 'n1',
    title: 'New Surface on Court 4!',
    description: 'We have upgraded court 4 with high-traction professional grade surface.',
    tag: 'Facility',
    imageUrl: 'https://picsum.photos/seed/court/400/300'
  },
  {
    id: 'n2',
    title: 'Saturday Social Mixer',
    description: 'Join us for refreshments and doubles round-robin this weekend.',
    tag: 'Event',
    imageUrl: 'https://picsum.photos/seed/social/400/300'
  },
  {
    id: 'n3',
    title: 'Youth Training Program',
    description: 'Registration is now open for our summer junior championship camp.',
    tag: 'Training',
    imageUrl: 'https://picsum.photos/seed/kids/400/300'
  }
];
