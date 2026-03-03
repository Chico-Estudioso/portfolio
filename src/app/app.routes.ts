import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { About } from './pages/about/about';
import { Projects } from './pages/projects/projects';
import { Contact } from './pages/contact/contact';
import { AnimeSearch } from './pages/anime-search/anime-search';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  { path: 'home', component: Home },

  { path: 'about', component: About },

  { path: 'projects', component: Projects },

  { path: 'contact', component: Contact },
  { path: 'anime', component: AnimeSearch },
];
