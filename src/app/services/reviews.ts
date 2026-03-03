import { Injectable } from '@angular/core';
import { Review } from '../interfaces/review.interface';

@Injectable({ providedIn: 'root' })
export class ReviewsService {
  private reviews: Review[] = [
    {
      id: 1,
      projectId: 1,
      author: 'Rafa',
      rating: 5,
      comment: 'Buen portfolio, se nota el trabajo con Angular.',
      date: new Date('2025-06-10'),
    },
    {
      id: 2,
      projectId: 1,
      author: 'Compañero DAW',
      rating: 4,
      comment: 'Muy completo, me mola el diseño oscuro.',
      date: new Date('2025-06-12'),
    },
    {
      id: 3,
      projectId: 2,
      author: 'Gamer123',
      rating: 5,
      comment: 'El modpack va increíble, buen trabajo.',
      date: new Date('2025-06-15'),
    },
  ];

  private nextId = 4;

  // Obtiene las reseñas de un proyecto concreto
  getReviewsByProject(projectId: number): Review[] {
    return this.reviews.filter((r) => r.projectId === projectId);
  }

  // Añade una nueva reseña
  addReview(projectId: number, author: string, rating: number, comment: string): Review {
    const newReview: Review = {
      id: this.nextId++,
      projectId,
      author,
      rating,
      comment,
      date: new Date(),
    };
    this.reviews.push(newReview);
    return newReview;
  }

  // Elimina una reseña por su ID
  deleteReview(reviewId: number): void {
    this.reviews = this.reviews.filter((r) => r.id !== reviewId);
  }

  // Calcula la media de puntuación de un proyecto
  getAverageRating(projectId: number): number {
    const projectReviews = this.getReviewsByProject(projectId);
    if (projectReviews.length === 0) return 0;
    const sum = projectReviews.reduce((acc, r) => acc + r.rating, 0);
    return Math.round((sum / projectReviews.length) * 10) / 10;
  }
}
