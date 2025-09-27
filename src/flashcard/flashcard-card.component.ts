import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CardFaceComponent } from '../card-face/card-face.component';
import { LangIndicatorComponent } from '../lang-indicator/lang-indicator.component';

@Component({
  selector: 'app-flashcard-card',
  standalone: true,
  imports: [CommonModule, MatIconModule, CardFaceComponent, LangIndicatorComponent],
  templateUrl: './flashcard-card.component.html'
})
export class FlashcardCardComponent {
  @Input() meta?: Record<string, any>;
  @Input() frontPrimary = '';
  @Input() frontSecondary = '';
  @Input() backPrimary = '';
  @Input() backSecondary = '';
  @Input() frontLang: 'fr' | 'de' = 'fr';
  @Input() backLang: 'fr' | 'de' = 'de';
  @Input() flipped = false; // welches Face ist sichtbar
  @Input() hovered = false; // für Opacity der Flip-Hilfe
  @Input() interactive = true; // Cursor/Pointer
}
