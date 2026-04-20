export const generationOptions = ['child', 'grandchild', 'great-grandchild', 'other'] as const;

export type Generation = (typeof generationOptions)[number];

export interface Person {
  id: string;
  full_name: string;
  birth_date: string;
  generation: Generation;
  order_number: number | null;
  parent_id: string | null;
  parent?: Pick<Person, 'id' | 'full_name'> | null;
  notes: string | null;
  deceased: boolean;
  deceased_at: string | null;
  show_in_memorial: boolean;
  created_at: string;
  updated_at: string;
}

export interface BirthdayEntry extends Person {
  month: number;
  day: number;
  nextBirthday: Date;
  ageTurning: number | null;
  daysUntil: number;
  isToday: boolean;
  isThisWeek: boolean;
  isThisMonth: boolean;
}

export interface BirthdayBuckets {
  today: BirthdayEntry[];
  thisWeek: BirthdayEntry[];
  thisMonth: BirthdayEntry[];
  upcoming: BirthdayEntry[];
}

export interface BirthdayStats {
  today: number;
  thisWeek: number;
  thisMonth: number;
  totalActive: number;
}
