export interface Review {
  id: number;
  projectId: number;
  author: string;
  rating: number; // 1-5
  comment: string;
  date: Date;
}
