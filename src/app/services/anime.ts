import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AnimeResult } from '../interfaces/anime.interface';

@Injectable({
  providedIn: 'root',
})
export class AnimeService {
  private apiUrl = 'https://api.jikan.moe/v4';

  constructor(private http: HttpClient) {}

  searchAnime(query: string): Observable<AnimeResult> {
    return this.http.get<AnimeResult>(`${this.apiUrl}/anime?q=${query}&limit=12`);
  }
}
