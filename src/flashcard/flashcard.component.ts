import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-flashcard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './flashcard.component.html'
})
export class FlashcardComponent {
  @Input() meta: Record<string, any> = {};
  @Input() frontPrimary = '';
  @Input() frontSecondary = '';
  @Input() backPrimary = '';
  @Input() backSecondary = '';

  flipped = signal(false);
  toggle() { this.flipped.update(v => !v); }

  // Hilfs-API: von außen zurücksetzen
  reset() { this.flipped.set(false); }
}
