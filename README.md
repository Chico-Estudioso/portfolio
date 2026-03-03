# MEGA CHEATSHEET ANGULAR — Temario Completo

> Guía práctica con ejemplos reales de tu portfolio. Para el examen de Rafa.

---

## UT3.02/03 — CLI y Estructura

### Crear proyecto nuevo
```bash
ng new portfolio --standalone --style=scss --routing
```

### Generar cosas por consola
```bash
# Componente (se crea en src/app/components/)
ng generate component components/review-card

# Componente en pages
ng generate component pages/project-detail

# Servicio (se crea en src/app/services/)
ng generate service services/reviews

# Guard
ng generate guard guards/favorites --functional
```

> **Atajo**: `ng g c` en vez de `ng generate component`

### Estructura de un componente standalone
```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-review-card',       // Así lo usas en HTML: <app-review-card />
  standalone: true,                   // No necesita módulo
  imports: [],                        // Aquí metes lo que uses: FormsModule, RouterLink, otros componentes...
  templateUrl: './review-card.html',
  styleUrl: './review-card.scss',
})
export class ReviewCard {}
```

### Archivos que se crean por componente
```
review-card/
  ├── review-card.ts          ← Lógica (clase TypeScript)
  ├── review-card.html        ← Template (HTML)
  ├── review-card.scss        ← Estilos (SCSS)
  └── review-card.spec.ts     ← Tests (puedes ignorarlo)
```

---

## UT3.04 — Data Binding e Interfaces

### Los 4 tipos de binding

```html
<!-- 1. INTERPOLACIÓN: muestra datos del .ts en el HTML -->
{{ review.author }}
{{ 'Hola ' + nombre }}
{{ getTotal() }}

<!-- 2. PROPERTY BINDING: pasa valor del .ts a una propiedad HTML -->
<img [src]="anime.images.jpg.image_url" [alt]="anime.title" />
<button [disabled]="isLoading">Buscar</button>
<div [class.airing]="anime.status === 'Currently Airing'">

<!-- 3. EVENT BINDING: ejecuta método del .ts cuando ocurre un evento -->
<button (click)="onSearch()">Buscar</button>
<input (keyup.enter)="onSearch()" />
<input (input)="onInput()" />

<!-- 4. TWO-WAY BINDING (banana in a box): lee y escribe a la vez -->
<!-- REQUIERE: importar FormsModule en el imports[] del componente -->
<input [(ngModel)]="searchQuery" />
```

> **TWO-WAY BINDING** = `[ngModel]` (property) + `(ngModelChange)` (event) juntos.
> Para usarlo: `imports: [FormsModule]` en el componente.

### Interfaces (tipado fuerte)

```typescript
// src/app/interfaces/review.interface.ts
export interface Review {
  id: number;
  projectId: number;
  author: string;
  rating: number;       // 1-5
  comment: string;
  date: Date;
}
```

**Uso en un componente:**
```typescript
import { Review } from '../../interfaces/review.interface';

// Tipamos la variable
reviews: Review[] = [];

// Tipamos un parámetro
onDeleteReview(review: Review): void { ... }
```

---

## UT3.05 — Control de Flujo y Comunicación Padre-Hijo

### @if / @else if / @else

```html
<!-- Condicional simple -->
@if (isLoading) {
  <p>Cargando...</p>
}

<!-- Con else -->
@if (reviews.length > 0) {
  <p>{{ reviews.length }} reseñas</p>
} @else {
  <p>No hay reseñas aún</p>
}

<!-- Con else if -->
@if (rating >= 4) {
  <span>Excelente</span>
} @else if (rating >= 2) {
  <span>Normal</span>
} @else {
  <span>Malo</span>
}
```

### @for (bucle)

```html
@for (review of reviews; track review.id) {
  <app-review-card [review]="review" />
}

<!-- Con índice -->
@for (review of reviews; track review.id; let i = $index) {
  <app-review-card [review]="review" [index]="i" />
}
```

> **IMPORTANTE**: siempre poner `track` con un identificador único.

---

### COMUNICACIÓN PADRE → HIJO con @Input()

**Paso 1: En el HIJO** — declarar la propiedad con `@Input()`
```typescript
// review-card.ts (HIJO)
import { Component, Input } from '@angular/core';
import { Review } from '../../interfaces/review.interface';

@Component({
  selector: 'app-review-card',
  standalone: true,
  imports: [],
  templateUrl: './review-card.html',
  styleUrl: './review-card.scss',
})
export class ReviewCard {
  @Input() review!: Review;      // El padre le pasa los datos
  @Input() index!: number;       // Puedes tener varios @Input
}
```

**Paso 2: En el PADRE** — pasar datos con property binding `[propiedad]`
```html
<!-- project-detail.html (PADRE) -->
@for (review of reviews; track review.id; let i = $index) {
  <app-review-card
    [review]="review"
    [index]="i"
  />
}
```

**Paso 3: En el PADRE** — importar el componente hijo
```typescript
// project-detail.ts (PADRE)
import { ReviewCard } from '../../components/review-card/review-card';

@Component({
  imports: [ReviewCard],  // ← MUY IMPORTANTE: si no lo pones, no funciona
  ...
})
```

---

### COMUNICACIÓN HIJO → PADRE con @Output() + EventEmitter

**Paso 1: En el HIJO** — declarar el @Output y emitir eventos
```typescript
// review-card.ts (HIJO)
import { Component, Input, Output, EventEmitter } from '@angular/core';

export class ReviewCard {
  @Input() review!: Review;

  // Declaramos el evento que emitiremos al padre
  @Output() deleteReview = new EventEmitter<number>();

  // Método que llama el botón del template
  onDelete(): void {
    this.deleteReview.emit(this.review.id);  // Emitimos el ID al padre
  }
}
```

```html
<!-- review-card.html (HIJO) -->
<button (click)="onDelete()">Eliminar</button>
```

**Paso 2: En el PADRE** — escuchar el evento con `(nombreEvento)`
```html
<!-- project-detail.html (PADRE) -->
<app-review-card
  [review]="review"
  (deleteReview)="onDeleteReview($event)"
/>
<!--  ↑ nombre del @Output     ↑ $event = lo que se emitió (review.id) -->
```

```typescript
// project-detail.ts (PADRE)
onDeleteReview(reviewId: number): void {
  this.reviewsService.deleteReview(reviewId);
  this.loadReviews(this.project.id);
}
```

---

### RESUMEN VISUAL DE LA COMUNICACIÓN

```
┌─────────────────────────────────────────────┐
│  PADRE (ProjectDetail)                       │
│                                              │
│  [review]="review"  ──── @Input() ────►  HIJO (ReviewCard)
│                                              │
│  (deleteReview)="onDeleteReview($event)"     │
│       ◄──── @Output() + EventEmitter ───  HIJO (ReviewCard)
│                                              │
│  (newReview)="onNewReview($event)"           │
│       ◄──── @Output() + EventEmitter ───  HIJO (ReviewForm)
│                                              │
│  ReviewsService (inyectado en el padre)      │
│  → El padre gestiona TODA la lógica          │
│  → Los hijos solo presentan y emiten         │
└─────────────────────────────────────────────┘
```

---

## UT3.06 — Servicios e Inyección de Dependencias

### Crear servicio por consola
```bash
ng generate service services/reviews
```

### Estructura de un servicio
```typescript
// src/app/services/reviews.ts
import { Injectable } from '@angular/core';
import { Review } from '../interfaces/review.interface';

@Injectable({ providedIn: 'root' })  // ← Disponible en TODA la app (singleton)
export class ReviewsService {
  private reviews: Review[] = [];     // Los datos viven aquí, NO en el componente
  private nextId = 1;

  getReviewsByProject(projectId: number): Review[] {
    return this.reviews.filter(r => r.projectId === projectId);
  }

  addReview(projectId: number, author: string, rating: number, comment: string): void {
    this.reviews.push({
      id: this.nextId++,
      projectId,
      author,
      rating,
      comment,
      date: new Date(),
    });
  }

  deleteReview(reviewId: number): void {
    this.reviews = this.reviews.filter(r => r.id !== reviewId);
  }

  getAverageRating(projectId: number): number {
    const projectReviews = this.getReviewsByProject(projectId);
    if (projectReviews.length === 0) return 0;
    const sum = projectReviews.reduce((acc, r) => acc + r.rating, 0);
    return Math.round((sum / projectReviews.length) * 10) / 10;
  }
}
```

### Inyectar servicio en un componente
```typescript
// project-detail.ts
import { ReviewsService } from '../../services/reviews';

export class ProjectDetail {
  reviews: Review[] = [];

  // Se inyecta en el CONSTRUCTOR
  constructor(private reviewsService: ReviewsService) {}

  // Se USA en los métodos
  ngOnInit(): void {
    this.reviews = this.reviewsService.getReviewsByProject(1);
  }
}
```

> **REGLA DE ORO**:
> - Componentes = PRESENTAN datos (template)
> - Servicios = GESTIONAN datos y lógica (fetch, CRUD, cálculos)

### Servicio con HttpClient (API externa)
```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AnimeService {
  private apiUrl = 'https://api.jikan.moe/v4';

  constructor(private http: HttpClient) {}  // Inyectamos HttpClient

  searchAnime(query: string): Observable<AnimeResult> {
    return this.http.get<AnimeResult>(`${this.apiUrl}/anime?q=${query}&limit=12`);
  }
}
```

> **IMPORTANTE**: Para usar HttpClient, en `app.config.ts` debe estar:
> ```typescript
> providers: [provideHttpClient(), provideRouter(routes)]
> ```

---

## UT3.07 — Ciclo de Vida de los Componentes

### Los 4 hooks importantes (en orden de ejecución)

```typescript
import { Component, OnInit, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';

export class MiComponente implements OnInit, OnChanges, OnDestroy {

  // 1. CONSTRUCTOR — Solo para inyección de dependencias
  // NO hacer lógica aquí
  constructor(private miServicio: MiServicio) {
    // ✅ Inyectar servicios
    // ❌ NO llamar APIs, NO suscribirse, NO inicializar datos
  }

  // 2. ngOnChanges — Se ejecuta CADA VEZ que un @Input cambia
  // Solo se usa en componentes HIJOS que reciben @Input
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['review'] && this.review) {
      this.stars = '★'.repeat(this.review.rating);
    }
  }

  // 3. ngOnInit — Se ejecuta UNA VEZ al crearse el componente
  // AQUÍ va la inicialización: cargar datos, suscribirse a rutas, etc.
  ngOnInit(): void {
    this.reviews = this.reviewsService.getReviewsByProject(this.projectId);
    this.routeSub = this.route.params.subscribe(...);
  }

  // 4. ngOnDestroy — Se ejecuta cuando el componente se destruye
  // AQUÍ se limpia: unsubscribe observables, clearTimeout, clearInterval
  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
    if (this.timeout) clearTimeout(this.timeout);
  }
}
```

### Ejemplo real: ReviewCard (hijo)
```typescript
export class ReviewCard implements OnChanges {
  @Input() review!: Review;

  stars: string = '';
  formattedDate: string = '';

  // Cada vez que el padre cambia el @Input "review", regeneramos estrellas
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['review'] && this.review) {
      this.stars = '★'.repeat(this.review.rating) + '☆'.repeat(5 - this.review.rating);
      this.formattedDate = new Date(this.review.date).toLocaleDateString('es-ES');
    }
  }
}
```

### Ejemplo real: ProjectDetail (padre con suscripción)
```typescript
export class ProjectDetail implements OnInit, OnDestroy {
  private routeSub?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private reviewsService: ReviewsService
  ) {}

  ngOnInit(): void {
    // Nos suscribimos a los parámetros de la ruta
    this.routeSub = this.route.params.subscribe(params => {
      const id = Number(params['id']);
      this.loadReviews(id);
    });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();  // ← LIMPIAMOS la suscripción
  }
}
```

### Cuándo usar cada uno — Resumen rápido

| Hook | ¿Cuándo se ejecuta? | ¿Para qué? |
|------|---------------------|-------------|
| `constructor` | Al instanciar la clase | Solo inyectar servicios |
| `ngOnChanges` | Cada vez que cambia un @Input | Reaccionar a datos del padre |
| `ngOnInit` | Una vez, tras crear el componente | Cargar datos, suscripciones |
| `ngOnDestroy` | Al destruir el componente | Limpiar suscripciones/timers |

---

## UT3.08 — Enrutamiento (Routing)

### Definir rutas
```typescript
// app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  // Redirección
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  // Rutas normales
  { path: 'home', component: Home },
  { path: 'projects', component: Projects },

  // Ruta DINÁMICA con parámetro
  { path: 'projects/:id', component: ProjectDetail },

  // Ruta PROTEGIDA con Guard
  { path: 'favorites', component: Favorites, canActivate: [favoritesGuard] },
];
```

### Navegar entre rutas (en HTML)
```html
<!-- Link normal -->
<a routerLink="/projects">Proyectos</a>

<!-- Link dinámico (con variable) -->
<a [routerLink]="['/projects', project.id]">Ver Reseñas</a>

<!-- Marcar link activo -->
<a routerLink="/home" routerLinkActive="active">Home</a>
```

> **IMPORTANTE**: Importar `RouterLink` y `RouterLinkActive` en el componente:
> ```typescript
> imports: [RouterLink, RouterLinkActive]
> ```

### Leer parámetros de ruta con ActivatedRoute
```typescript
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

export class ProjectDetail implements OnInit, OnDestroy {
  private routeSub?: Subscription;

  constructor(private route: ActivatedRoute) {}

  // OPCIÓN 1: Con subscribe (reactivo, detecta cambios)
  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params => {
      const id = Number(params['id']);
      console.log('ID del proyecto:', id);
    });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }

  // OPCIÓN 2: Con snapshot (solo lee una vez)
  // ngOnInit(): void {
  //   const id = Number(this.route.snapshot.params['id']);
  // }
}
```

### Route Guards (CanActivateFn funcional)
```bash
ng generate guard guards/favorites --functional
```

```typescript
// guards/favorites.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { FavoritesService } from '../services/favorites';

export const favoritesGuard: CanActivateFn = () => {
  const favoritesService = inject(FavoritesService);  // inject() en vez de constructor
  const router = inject(Router);

  if (favoritesService.count() > 0) {
    return true;                          // Permite acceso
  }
  return router.parseUrl('/anime');        // Redirige si no cumple condición
};
```

```typescript
// En app.routes.ts → se usa así:
{ path: 'favorites', component: Favorites, canActivate: [favoritesGuard] }
```

---

## UT3.09 — Formularios Reactivos

### Imports necesarios
```typescript
// En el componente
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  imports: [ReactiveFormsModule],  // ← OBLIGATORIO en imports[]
})
```

### Formulario básico con FormBuilder
```typescript
export class ReviewForm {
  reviewForm: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder) {
    this.reviewForm = this.fb.group({
      author: ['', [Validators.required, Validators.minLength(2)]],
      //        ↑ valor inicial   ↑ array de validadores
      rating: [null, [Validators.required]],
      comment: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  // Getter para acceder fácil a los controles
  get f() {
    return this.reviewForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.reviewForm.valid) {
      console.log(this.reviewForm.value);
      this.reviewForm.reset();
      this.submitted = false;
    }
  }
}
```

### Template del formulario
```html
<form [formGroup]="reviewForm" (ngSubmit)="onSubmit()" novalidate>

  <div class="form-group">
    <label for="author">Nombre</label>
    <input id="author" type="text" formControlName="author" />

    <!-- Errores de validación -->
    @if (submitted && f['author'].errors) {
      <div class="error">
        @if (f['author'].errors?.['required']) {
          <span>El nombre es obligatorio</span>
        }
        @if (f['author'].errors?.['minlength']) {
          <span>Mínimo 2 caracteres</span>
        }
      </div>
    }
  </div>

  <button type="submit">Enviar</button>
</form>
```

### Estados de un control

```typescript
// En el .ts
this.reviewForm.controls['author'].invalid   // ¿Tiene errores?
this.reviewForm.controls['author'].touched   // ¿El usuario ha tocado el campo?
this.reviewForm.controls['author'].dirty     // ¿El usuario ha escrito algo?
this.reviewForm.valid                        // ¿Todo el formulario es válido?
```

### Validadores personalizados
```typescript
// validators/no-whitespace.validator.ts
import { AbstractControl, ValidationErrors } from '@angular/forms';

export function noWhitespaceValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  const isWhitespace = control.value.trim().length === 0;
  return isWhitespace ? { whitespace: true } : null;
  //                      ↑ clave del error que usas en el template
}
```

```typescript
// Se usa así en el FormBuilder:
import { noWhitespaceValidator } from '../../validators/no-whitespace.validator';

author: ['', [Validators.required, Validators.minLength(2), noWhitespaceValidator]],
```

```html
<!-- Se comprueba así en el template: -->
@if (f['author'].errors?.['whitespace']) {
  <span>No puede ser solo espacios</span>
}
```

### FormArray (formularios dinámicos)
```typescript
import { FormArray, FormControl } from '@angular/forms';

export class About implements OnInit {
  skillsForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.skillsForm = this.fb.group({
      skills: this.fb.array([          // ← FormArray en vez de FormControl
        this.createSkillControl('Java'),
        this.createSkillControl('Angular'),
      ]),
    });
  }

  // Getter para el FormArray
  get skillsArray(): FormArray {
    return this.skillsForm.get('skills') as FormArray;
  }

  // Crear un control con validaciones
  private createSkillControl(value: string = ''): FormControl {
    return this.fb.control(value, [Validators.required, Validators.minLength(2)]);
  }

  // AÑADIR skill
  addSkill(): void {
    this.skillsArray.push(this.createSkillControl());
  }

  // ELIMINAR skill
  removeSkill(index: number): void {
    this.skillsArray.removeAt(index);
  }
}
```

```html
<!-- Template del FormArray -->
<div [formGroup]="skillsForm">
  @for (control of skillsArray.controls; track control; let i = $index) {
    <app-skill-item
      [skillControl]="getSkillControl(i)"
      [index]="i"
      (remove)="removeSkill($event)"
    />
  }
  <button (click)="addSkill()">+ Añadir Skill</button>
</div>
```

---

## CHECKLIST RÁPIDO — "Voy a crear un componente nuevo"

```
□ 1. ng generate component components/mi-componente
□ 2. ¿Recibe datos del padre?     → @Input() en el hijo
□ 3. ¿Emite eventos al padre?     → @Output() + EventEmitter en el hijo
□ 4. ¿Necesita un servicio?       → Inyectar en constructor
□ 5. ¿Inicializa datos?           → ngOnInit()
□ 6. ¿Reacciona a cambios?        → ngOnChanges()
□ 7. ¿Tiene suscripciones/timers? → ngOnDestroy() para limpiar
□ 8. ¿Tiene formulario?           → imports: [ReactiveFormsModule]
□ 9. ¿Usa ngModel?                → imports: [FormsModule]
□ 10. ¿Usa routerLink?            → imports: [RouterLink]
□ 11. ¿El PADRE lo usa?           → imports: [MiComponente] en el padre
```

---

## ERRORES TÍPICOS EN EXAMEN

```
❌ Olvidar imports: [MiComponente] en el PADRE
   → El componente hijo no se renderiza

❌ Olvidar imports: [ReactiveFormsModule]
   → Error: "formGroup" is not a known property

❌ Olvidar imports: [FormsModule]
   → Error: "ngModel" is not a known property

❌ Poner lógica en el constructor en vez de ngOnInit
   → El profe lo ve y baja nota

❌ No limpiar suscripción en ngOnDestroy
   → Memory leak (el profe busca esto específicamente)

❌ No poner track en @for
   → Error de compilación

❌ Escribir @Output() sin importar EventEmitter
   → No compila

❌ Usar this.route.params sin suscribirse
   → params es un Observable, no un valor directo
```
