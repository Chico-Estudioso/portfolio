import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Project, ProjectsService } from '../../services/projects';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
})
export class Projects implements OnInit {
  projects: Project[] = [];

  constructor(private projectsService: ProjectsService) {}

  ngOnInit(): void {
    this.projects = this.projectsService.getProjects();
  }
}
