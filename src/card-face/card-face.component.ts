import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-face',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-face.component.html'
})
export class CardFaceComponent {
  @Input() primary = '';
  @Input() secondary = '';
  @Input() genus?: string;
  @Input() lang: 'fr' | 'de' = 'fr';
  @Input() needsVowelArticle = false;
  @Input() visible = true;

  public getArticle(): string {
    if (this.lang === 'de') {
      switch (this.genus) {
        case 'm.':
          return 'der';
        case 'f.':
          return 'die';
        case 'n.':
          return 'das';
        default:
          return '';
      }
    }
    if (this.lang === 'fr') {
      if (this.needsVowelArticle) {
        return 'l\'';
      }
      switch (this.genus) {
        case 'm.':
          return 'le';
        case 'f.':
          return 'la';
        case 'm. pl.':
          return 'les';
        case 'f. pl.':
          return 'les';
        default:
          return '';
      }
    }
    return '';
  }
}
