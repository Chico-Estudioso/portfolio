import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  OnDestroy,
} from '@angular/core';
import { Anime } from '../../interfaces/anime.interface';

@Component({
  selector: 'app-anime-card',
  standalone: true,
  imports: [],
  templateUrl: './anime-card.html',
  styleUrl: './anime-card.scss',
})
export class AnimeCard implements OnChanges, OnDestroy {
  // ---- Comunicación Padre → Hijo ----
  @Input() anime!: Anime;
  @Input() isFavorite: boolean = false;

  // ---- Comunicación Hijo → Padre ----
  @Output() toggleFavorite = new EventEmitter<Anime>();

  // Estado interno del componente
  favoriteIcon: string = '🤍';
  private animationTimeout: ReturnType<typeof setTimeout> | null = null;
  isAnimating: boolean = false;

  // ---- Ciclo de vida: ngOnChanges ----
  // Se ejecuta cada vez que un @Input cambia de valor
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isFavorite']) {
      this.favoriteIcon = this.isFavorite ? '❤️' : '🤍';
    }
  }

  // ---- Ciclo de vida: ngOnDestroy ----
  // Limpia el timeout pendiente al destruirse el componente
  ngOnDestroy(): void {
    if (this.animationTimeout) {
      clearTimeout(this.animationTimeout);
    }
  }

  // Emite el evento al padre cuando se pulsa el botón
  onToggleFavorite(): void {
    this.isAnimating = true;
    this.toggleFavorite.emit(this.anime);

    // Limpia animación después de 300ms
    this.animationTimeout = setTimeout(() => {
      this.isAnimating = false;
    }, 300);
  }
}
