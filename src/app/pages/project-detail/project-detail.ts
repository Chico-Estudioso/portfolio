import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { Project, ProjectsService } from '../../services/projects';
import { ReviewsService } from '../../services/reviews';
import { Review } from '../../interfaces/review.interface';
import { ReviewCard } from '../../components/review-card/review-card';
import { ReviewForm, ReviewFormData } from '../../components/review-form/review-form';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [RouterLink, ReviewCard, ReviewForm],
  templateUrl: './project-detail.html',
  styleUrl: './project-detail.scss',
})
export class ProjectDetail implements OnInit, OnDestroy {
  project?: Project;
  reviews: Review[] = [];
  averageRating: number = 0;
  reviewAdded: boolean = false;

  // Guardamos la suscripción de la ruta para limpiarla
  private routeSub?: Subscription;
  private feedbackTimeout: ReturnType<typeof setTimeout> | null = null;

  // Inyección de dependencias en el constructor
  constructor(
    private route: ActivatedRoute,
    private projectsService: ProjectsService,
    private reviewsService: ReviewsService
  ) {}

  // ---- Ciclo de vida: ngOnInit ----
  // Nos suscribimos a los parámetros de la ruta para obtener el :id
  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe((params) => {
      const id = Number(params['id']);
      this.project = this.projectsService.getProjectById(id);
      if (this.project) {
        this.loadReviews(this.project.id);
      }
    });
  }

  // ---- Ciclo de vida: ngOnDestroy ----
  // Limpiamos suscripción de ruta y timeout
  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
    if (this.feedbackTimeout) {
      clearTimeout(this.feedbackTimeout);
    }
  }

  // El PADRE escucha el @Output del hijo ReviewForm
  onNewReview(formData: ReviewFormData): void {
    if (this.project) {
      this.reviewsService.addReview(
        this.project.id,
        formData.author,
        formData.rating,
        formData.comment
      );
      this.loadReviews(this.project.id);

      // Feedback visual
      this.reviewAdded = true;
      this.feedbackTimeout = setTimeout(() => (this.reviewAdded = false), 3000);
    }
  }

  // El PADRE escucha el @Output del hijo ReviewCard
  onDeleteReview(reviewId: number): void {
    this.reviewsService.deleteReview(reviewId);
    if (this.project) {
      this.loadReviews(this.project.id);
    }
  }

  // Carga reseñas y media desde el servicio
  private loadReviews(projectId: number): void {
    this.reviews = this.reviewsService.getReviewsByProject(projectId);
    this.averageRating = this.reviewsService.getAverageRating(projectId);
  }
}
