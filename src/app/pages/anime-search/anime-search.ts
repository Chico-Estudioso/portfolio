import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AnimeService } from '../../services/anime';
import { FavoritesService } from '../../services/favorites';
import { Anime } from '../../interfaces/anime.interface';
import { AnimeCard } from '../../components/anime-card/anime-card';

@Component({
  selector: 'app-anime-search',
  standalone: true,
  imports: [FormsModule, AnimeCard, RouterLink], // Importamos el componente hijo
  templateUrl: './anime-search.html',
  styleUrl: './anime-search.scss',
})
export class AnimeSearch implements OnDestroy {
  searchQuery: string = '';
  animeList: Anime[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  hasSearched: boolean = false;

  // Guardamos la suscripción para limpiarla en ngOnDestroy
  private searchSub?: Subscription;

  constructor(
    private animeService: AnimeService,
    private favoritesService: FavoritesService
  ) {}

  // ---- Ciclo de vida: ngOnDestroy ----
  // Limpiamos la suscripción HTTP al destruir el componente
  ngOnDestroy(): void {
    this.searchSub?.unsubscribe();
  }

  onSearch(): void {
    if (!this.searchQuery.trim()) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.hasSearched = true;
    this.animeList = [];

    // Cancelamos búsqueda anterior si existe
    this.searchSub?.unsubscribe();

    this.searchSub = this.animeService.searchAnime(this.searchQuery).subscribe({
      next: (response) => {
        this.animeList = response.data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching anime:', err);
        this.errorMessage = 'Hubo un error al buscar los animes. Inténtalo de nuevo.';
        this.isLoading = false;
      },
    });
  }

  // Comprueba si un anime es favorito (para pasarlo como @Input al hijo)
  checkFavorite(malId: number): boolean {
    return this.favoritesService.isFavorite(malId);
  }

  // El PADRE escucha el evento del HIJO y gestiona la lógica
  onToggleFavorite(anime: Anime): void {
    if (this.favoritesService.isFavorite(anime.mal_id)) {
      this.favoritesService.remove(anime.mal_id);
    } else {
      this.favoritesService.add(anime);
    }
  }

  get favoritesCount(): number {
    return this.favoritesService.count();
  }
}
