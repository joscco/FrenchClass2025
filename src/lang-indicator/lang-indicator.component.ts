import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-lang-indicator',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './lang-indicator.component.html'
})
export class LangIndicatorComponent {
  @Input() lang: 'fr' | 'de' = 'fr';
}

