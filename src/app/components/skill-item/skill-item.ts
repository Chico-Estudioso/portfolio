import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-skill-item',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './skill-item.html',
  styleUrl: './skill-item.scss',
})
export class SkillItem implements OnChanges {
  // ---- Comunicación Padre → Hijo ----
  @Input() skillControl!: FormControl;
  @Input() index!: number;

  // ---- Comunicación Hijo → Padre ----
  @Output() remove = new EventEmitter<number>();

  // Estado interno
  charCount: number = 0;

  // ---- Ciclo de vida: ngOnChanges ----
  // Detecta cuando el padre cambia el FormControl asignado
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['skillControl'] && this.skillControl) {
      this.charCount = this.skillControl.value?.length || 0;
    }
  }

  // Actualiza el contador al escribir
  onInput(): void {
    this.charCount = this.skillControl.value?.length || 0;
  }

  // Emite evento al padre para eliminar este skill
  onRemove(): void {
    this.remove.emit(this.index);
  }
}
