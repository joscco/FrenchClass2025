import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';

export type PracticeMode = 'fr-de' | 'de-fr' | 'mixed';

@Component({
  selector: 'app-mode-selector',
  standalone: true,
  imports: [CommonModule, MatButtonToggleModule, MatTooltipModule],
  templateUrl: './mode-selector.component.html'
})
export class ModeSelectorComponent {
  @Input() mode: PracticeMode = 'fr-de';
  @Output() modeChange = new EventEmitter<PracticeMode>();
}

