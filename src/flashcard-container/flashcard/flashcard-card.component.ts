import {Component, Input, ViewChild, ElementRef, OnChanges, SimpleChanges} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {CardFaceComponent} from './card-face/card-face.component';
import {LangIndicatorComponent} from '../../lang-indicator/lang-indicator.component';
import gsap from 'gsap';
import {Language, reverseLanguage} from '../../practice/practice.component';

@Component({
  selector: 'app-flashcard-card',
  standalone: true,
  imports: [CommonModule, MatIconModule, CardFaceComponent, LangIndicatorComponent],
  templateUrl: './flashcard-card.component.html'
})
export class FlashcardCardComponent implements OnChanges {
  @Input() meta?: Record<string, any>;
  @Input() frenchPrimary = '';
  @Input() frenchSecondary = '';
  @Input() germanPrimary = '';
  @Input() germanSecondary = '';
  @Input() frontLang: Language = 'french';
  @Input() flipped = false; // welches Face ist sichtbar
  @Input() hovered = false; // für Opacity der Flip-Hilfe
  @Input() interactive = true; // Cursor/Pointer

  @ViewChild('faceContainer', {static: false}) faceContainer?: ElementRef<HTMLDivElement>;

  public animating = false;
  public currentFace: Language = 'french';

  ngOnChanges(changes: SimpleChanges) {
    const nextFace = this.getNextFace();

    // Do not animate if whole card changed
    if (changes['frenchPrimary']) {
      this.currentFace = nextFace;
      return;
    }

    // Card didn't change but maybe the face did
    if (nextFace === this.currentFace) {
      return
    }

    this.animateFlip();
  }

  private getNextFace() {
    return this.flipped ? reverseLanguage(this.frontLang) : this.frontLang;
  }

  animateFlip() {
    if (!this.faceContainer) {
      this.currentFace = this.flipped ? this.frontLang : this.frontLang;
      return;
    }
    this.animating = true;
    const el = this.faceContainer.nativeElement;
    // Altes Face nach oben und opacity 0
    gsap.to(el, {
      y: -40,
      opacity: 0,
      duration: 0.25,
      onComplete: () => {
        // Face wechseln
        this.currentFace = this.getNextFace();
        // Neues Face von unten und opacity 0 auf 1
        gsap.fromTo(
          el,
          {y: 40, opacity: 0},
          {
            y: 0,
            opacity: 1,
            duration: 0.25,
            onComplete: () => {
              this.animating = false;
            }
          }
        );
      }
    });
  }

  protected readonly reverseLanguage = reverseLanguage;
}
