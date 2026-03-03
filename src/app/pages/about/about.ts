import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SkillsService } from '../../services/skills';
import { SkillItem } from '../../components/skill-item/skill-item';
import { noWhitespaceValidator } from '../../validators/no-whitespace.validator';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [ReactiveFormsModule, SkillItem],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About implements OnInit {
  skillsForm!: FormGroup;
  saved: boolean = false;

  constructor(
    private fb: FormBuilder,
    private skillsService: SkillsService
  ) {}

  // ngOnInit: inicializamos el formulario con las skills del servicio
  ngOnInit(): void {
    const defaultSkills = this.skillsService.getDefaultSkills();

    this.skillsForm = this.fb.group({
      skills: this.fb.array(
        defaultSkills.map((skill) => this.createSkillControl(skill))
      ),
    });
  }

  // Getter para acceder al FormArray fácilmente
  get skillsArray(): FormArray {
    return this.skillsForm.get('skills') as FormArray;
  }

  // Getter para acceder a cada control individual
  getSkillControl(index: number): FormControl {
    return this.skillsArray.at(index) as FormControl;
  }

  // Crea un FormControl con validadores (incluido el personalizado)
  private createSkillControl(value: string = ''): FormControl {
    return this.fb.control(value, [
      Validators.required,
      Validators.minLength(2),
      noWhitespaceValidator, // Validador personalizado
    ]);
  }

  // Añade una nueva skill vacía al FormArray
  addSkill(): void {
    this.skillsArray.push(this.createSkillControl());
  }

  // El padre escucha el evento @Output del hijo SkillItem
  onRemoveSkill(index: number): void {
    this.skillsArray.removeAt(index);
  }

  // Guarda las skills usando el servicio
  onSaveSkills(): void {
    if (this.skillsForm.valid) {
      const skills = this.skillsArray.value as string[];
      this.skillsService.saveSkills(skills);
      this.saved = true;
      setTimeout(() => (this.saved = false), 3000);
    } else {
      // Marcamos todos los controles como touched para mostrar errores
      this.skillsArray.controls.forEach((control) => control.markAsTouched());
    }
  }
}
