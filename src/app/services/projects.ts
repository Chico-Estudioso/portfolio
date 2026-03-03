import { Injectable } from '@angular/core';

export interface Project {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  repoUrl: string;
}

@Injectable({ providedIn: 'root' })
export class ProjectsService {
  private projectsList: Project[] = [
    {
      id: 1,
      title: 'Portfolio Angular',
      description: 'Portfolio personal con standalone components y routing.',
      imageUrl: 'https://placehold.co/400x200/1a1a2e/e94560?text=Portfolio',
      repoUrl: 'https://github.com/Chico-Estudioso/portfolio',
    },
    {
      id: 2,
      title: 'Minecraft Modpack',
      description: 'Servidor personalizado con All The Mons y Cobblemon.',
      imageUrl: 'https://placehold.co/400x200/1a1a2e/e94560?text=Minecraft+Mod',
      repoUrl: 'https://github.com/Chico-Estudioso/modpack',
    },
    {
      id: 3,
      title: 'Discord Bot',
      description: 'Bot de Discord en Java con comandos para servidores.',
      imageUrl: 'https://placehold.co/400x200/1a1a2e/e94560?text=Discord+Bot',
      repoUrl: 'https://github.com/Chico-Estudioso/discord-bot',
    },
  ];

  getProjects(): Project[] {
    return this.projectsList;
  }
}
