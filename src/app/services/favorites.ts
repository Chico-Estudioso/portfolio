import { Injectable } from '@angular/core';
import { Anime } from '../interfaces/anime.interface';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private favorites: Anime[] = [];

  getAll(): Anime[] {
    return this.favorites;
  }

  add(anime: Anime): void {
    if (!this.isFavorite(anime.mal_id)) {
      this.favorites.push(anime);
    }
  }

  remove(malId: number): void {
    this.favorites = this.favorites.filter((a) => a.mal_id !== malId);
  }

  isFavorite(malId: number): boolean {
    return this.favorites.some((a) => a.mal_id === malId);
  }

  count(): number {
    return this.favorites.length;
  }
}
