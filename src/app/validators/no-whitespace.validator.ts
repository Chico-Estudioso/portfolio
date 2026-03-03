import { AbstractControl, ValidationErrors } from '@angular/forms';

// Validador personalizado: comprueba que el valor no sea solo espacios en blanco
export function noWhitespaceValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) {
    return null; // Si está vacío, dejamos que 'required' lo maneje
  }
  const isWhitespace = control.value.trim().length === 0;
  return isWhitespace ? { whitespace: true } : null;
}
