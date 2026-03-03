import { Component, Output, EventEmitter, OnDestroy } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { noWhitespaceValidator } from '../../validators/no-whitespace.validator';

// Interfaz local para los datos que emite el formulario al padre
export interface ReviewFormData {
  author: string;
  rating: number;
  comment: string;
}

@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './review-form.html',
  styleUrl: './review-form.scss',
})
export class ReviewForm implements OnDestroy {
  // ---- Comunicación Hijo → Padre con @Output ----
  @Output() newReview = new EventEmitter<ReviewFormData>();

  reviewForm: FormGroup;
  submitted = false;
  private resetTimeout: ReturnType<typeof setTimeout> | null = null;

  // Opciones de rating para el select
  ratingOptions = [
    { value: 5, label: '★★★★★ Excelente' },
    { value: 4, label: '★★★★☆ Muy bueno' },
    { value: 3, label: '★★★☆☆ Normal' },
    { value: 2, label: '★★☆☆☆ Mejorable' },
    { value: 1, label: '★☆☆☆☆ Malo' },
  ];

  constructor(private fb: FormBuilder) {
    this.reviewForm = this.fb.group({
      author: ['', [Validators.required, Validators.minLength(2), noWhitespaceValidator]],
      rating: [null, [Validators.required]],
      comment: ['', [Validators.required, Validators.minLength(10), noWhitespaceValidator]],
    });
  }

  // ---- Ciclo de vida: ngOnDestroy ----
  // Limpia el timeout pendiente si el componente se destruye
  ngOnDestroy(): void {
    if (this.resetTimeout) {
      clearTimeout(this.resetTimeout);
    }
  }

  // Getter para acceder a los controles del formulario
  get f() {
    return this.reviewForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.reviewForm.valid) {
      // Emitimos los datos al PADRE: él decide qué hacer con ellos
      this.newReview.emit({
        author: this.reviewForm.value.author,
        rating: Number(this.reviewForm.value.rating),
        comment: this.reviewForm.value.comment,
      });

      // Reset del formulario
      this.reviewForm.reset();
      this.submitted = false;
    }
  }
}
