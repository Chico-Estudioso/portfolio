import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Review } from '../../interfaces/review.interface';

@Component({
  selector: 'app-review-card',
  standalone: true,
  imports: [],
  templateUrl: './review-card.html',
  styleUrl: './review-card.scss',
})
export class ReviewCard implements OnChanges {
  // ---- Comunicación Padre → Hijo con @Input ----
  @Input() review!: Review;
  @Input() index!: number;

  // ---- Comunicación Hijo → Padre con @Output ----
  @Output() deleteReview = new EventEmitter<number>();

  // Estado interno
  stars: string = '';
  formattedDate: string = '';

  // ---- Ciclo de vida: ngOnChanges ----
  // Se dispara cuando cualquier @Input cambia de valor
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['review'] && this.review) {
      // Generamos las estrellas visuales según el rating
      this.stars = '★'.repeat(this.review.rating) + '☆'.repeat(5 - this.review.rating);
      // Formateamos la fecha
      this.formattedDate = new Date(this.review.date).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    }
  }

  // Emite el evento de borrado al padre
  onDelete(): void {
    this.deleteReview.emit(this.review.id);
  }
}
