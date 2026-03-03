import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SkillsService {
  private defaultSkills: string[] = [
    'Java',
    'TypeScript',
    'Angular',
    'Python',
    'SQL',
    'AWS',
    'Git',
    'Linux',
  ];

  getDefaultSkills(): string[] {
    return [...this.defaultSkills];
  }

  // Simula guardar skills (en un caso real sería una llamada HTTP)
  saveSkills(skills: string[]): void {
    this.defaultSkills = [...skills];
    console.log('Skills guardadas:', skills);
  }
}
