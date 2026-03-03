import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AnimeService } from '../../services/anime';

@Component({
  selector: 'app-anime-search',
  imports: [FormsModule], // Necesario para usar [(ngModel)]
  templateUrl: './anime-search.html',
  styleUrl: './anime-search.scss',
})
export class AnimeSearch {
  searchQuery: string = '';
  animeList: any[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  hasSearched: boolean = false;

  constructor(private animeService: AnimeService) {}

  onSearch(): void {
    if (!this.searchQuery.trim()) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.hasSearched = true;
    this.animeList = [];

    this.animeService.searchAnime(this.searchQuery).subscribe({
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
}
