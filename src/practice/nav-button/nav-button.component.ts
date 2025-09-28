import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-nav-button',
  templateUrl: './nav-button.component.html',
})
export class NavButtonComponent {
  @Input() label = '';
  @Output() btnClick = new EventEmitter<void>();
}

