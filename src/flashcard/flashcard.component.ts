import {Component, computed, Input, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-flashcard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './flashcard.component.html'
})
export class FlashcardComponent {
  @Input() meta: Record<string, any> = {};
  @Input() frontPrimary = '';
  @Input() frontExampleSentence = '';
  @Input() backPrimary = '';
  @Input() backExampleSentence = '';
  @Input() frontLang: 'fr' | 'de' = 'fr';
  @Input() backLang: 'fr' | 'de' = 'de';

  flipped = signal(false);
  hovered = signal(false);
  currentLang = computed(() => this.flipped() ? this.backLang : this.frontLang);

  toggle() {
    this.flipped.update(v => !v);
  }

  // Hilfs-API: von außen zurücksetzen
  reset() {
    this.flipped.set(false);
  }

  hoverOn() {
    this.hovered.set(true);
  }

  hoverOff() {
    this.hovered.set(false);
  }
}
