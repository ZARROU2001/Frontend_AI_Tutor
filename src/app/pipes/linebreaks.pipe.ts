import { Pipe, PipeTransform } from '@angular/core';

/**
 * Converts newlines in text to <br> tags for display in [innerHTML].
 * Also bolds **text** wrapped in double asterisks.
 */
@Pipe({ name: 'linebreaks', standalone: true })
export class LinebreaksPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
  }
}
