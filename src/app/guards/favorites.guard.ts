import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { FavoritesService } from '../services/favorites';

// Guard funcional (CanActivateFn) - protege la ruta /favorites
// Solo permite acceso si hay al menos 1 favorito
export const favoritesGuard: CanActivateFn = () => {
  const favoritesService = inject(FavoritesService);
  const router = inject(Router);

  if (favoritesService.count() > 0) {
    return true;
  }

  // Si no hay favoritos, redirige al buscador de anime
  return router.parseUrl('/anime');
};
