import { Component, OnInit } from '@angular/core';
import { FavoritesService } from '../../services/favorites';
import { Anime } from '../../interfaces/anime.interface';
import { AnimeCard } from '../../components/anime-card/anime-card';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [AnimeCard, RouterLink],
  templateUrl: './favorites.html',
  styleUrl: './favorites.scss',
})
export class Favorites implements OnInit {
  favoriteAnimes: Anime[] = [];

  // Inyección de dependencias en el constructor
  constructor(private favoritesService: FavoritesService) {}

  // ngOnInit: cargamos los datos al inicializar
  ngOnInit(): void {
    this.loadFavorites();
  }

  // El padre escucha el evento del hijo AnimeCard
  onRemoveFavorite(anime: Anime): void {
    this.favoritesService.remove(anime.mal_id);
    this.loadFavorites(); // Recargamos la lista
  }

  private loadFavorites(): void {
    this.favoriteAnimes = this.favoritesService.getAll();
  }
}
