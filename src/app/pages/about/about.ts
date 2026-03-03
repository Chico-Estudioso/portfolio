import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {
  skills = ['Java', 'TypeScript', 'Angular', 'Python', 'SQL', 'AWS', 'Git', 'Linux'];
}
