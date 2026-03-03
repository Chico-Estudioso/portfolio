import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { About } from './pages/about/about';
import { Projects } from './pages/projects/projects';
import { Contact } from './pages/contact/contact';
import { AnimeSearch } from './pages/anime-search/anime-search';
import { Favorites } from './pages/favorites/favorites';
import { ProjectDetail } from './pages/project-detail/project-detail';
import { favoritesGuard } from './guards/favorites.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  { path: 'home', component: Home },

  { path: 'about', component: About },

  { path: 'projects', component: Projects },

  // Ruta dinámica con parámetro :id (ActivatedRoute)
  { path: 'projects/:id', component: ProjectDetail },

  { path: 'contact', component: Contact },

  { path: 'anime', component: AnimeSearch },

  // Ruta protegida con Guard funcional (CanActivateFn)
  { path: 'favorites', component: Favorites, canActivate: [favoritesGuard] },
];
