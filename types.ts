export type AttendanceStatus = 'Hadir' | 'Tidak Hadir' | 'Masih Ragu';

export interface GuestComment {
  id: number;
  name: string;
  attendance: AttendanceStatus;
  message: string;
  timestamp: string;
}

export interface RsvpSubmission {
  name: string;
  attendance: 'attending' | 'not_attending';
  guests: number;
  submittedAt: string;
}

export interface StoryMilestone {
  chapter: string;
  year: string;
  title: string;
  narrative: string;
}

export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  caption: string;
  location: string;
  span?: 'lead' | 'standard';
}
