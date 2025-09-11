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
  @Input() visible = true;
}
