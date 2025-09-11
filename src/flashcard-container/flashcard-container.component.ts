import {Component, Input, signal, OnChanges, SimpleChanges} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {FlashcardCardComponent} from '../flashcard/flashcard-card.component';

@Component({
  selector: 'app-flashcard-container',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, FlashcardCardComponent],
  templateUrl: './flashcard-container.component.html',
})
export class FlashcardContainerComponent implements OnChanges {
  @Input() meta: Record<string, any> = {};
  @Input() frontPrimary = '';
  @Input() frontExampleSentence = '';
  @Input() backPrimary = '';
  @Input() backExampleSentence = '';
  @Input() frontLang: 'fr' | 'de' = 'fr';
  @Input() backLang: 'fr' | 'de' = 'de';
  // Neue Richtung der Navigation
  @Input() direction: 'next' | 'prev' = 'next';

  flipped = signal(false);
  hovered = signal(false);

  // Snapshot komplette alte Karte
  oldMeta: Record<string, any> = {};
  oldFrontPrimary = '';
  oldFrontExampleSentence = '';
  oldBackPrimary = '';
  oldBackExampleSentence = '';
  oldFrontLang: 'fr' | 'de' = 'fr';
  oldBackLang: 'fr' | 'de' = 'de';
  oldWasFlipped = false;

  // Karten-Phasen für Slide: leaving => entering => idle
  cardPhase = signal<'idle' | 'leaving' | 'entering'>('idle');
  private cardPhaseTimeout: any;
  // Neue Phase für Eintritt (erst ohne Transition positionieren, dann animieren)
  cardEnterPhase = signal<'idle' | 'init' | 'animating'>('idle');

  // Getter für Template
  getPhase(): 'idle' | 'leaving' | 'entering' { return this.cardPhase(); }
  getEnterPhase(): 'idle' | 'init' | 'animating' { return this.cardEnterPhase(); }
  isFlipped(): boolean { return this.flipped(); }
  isHovered(): boolean { return this.hovered(); }
  getDirection(): 'next' | 'prev' { return this.direction; }

  ngOnChanges(changes: SimpleChanges) {
    const watched = ['frontPrimary', 'frontExampleSentence', 'backPrimary', 'backExampleSentence', 'frontLang', 'backLang', 'meta'];
    const relevant = watched.some(k => k in changes && !changes[k]!.firstChange);
    if (!relevant) return;

    // Snapshot alte Karte
    this.oldMeta = changes['meta']?.previousValue ?? this.oldMeta;
    this.oldFrontPrimary = changes['frontPrimary']?.previousValue ?? this.oldFrontPrimary;
    this.oldFrontExampleSentence = changes['frontExampleSentence']?.previousValue ?? this.oldFrontExampleSentence;
    this.oldBackPrimary = changes['backPrimary']?.previousValue ?? this.oldBackPrimary;
    this.oldBackExampleSentence = changes['backExampleSentence']?.previousValue ?? this.oldBackExampleSentence;
    this.oldFrontLang = changes['frontLang']?.previousValue ?? this.oldFrontLang;
    this.oldBackLang = changes['backLang']?.previousValue ?? this.oldBackLang;
    this.oldWasFlipped = this.flipped();

    // Neue Karte startet immer Vorderseite
    this.flipped.set(false);

    // Neue Karte vorbereitet (rechts, opacity 0, keine Transition)
    if (this.frontPrimary !== this.oldFrontPrimary && this.frontPrimary !== this.oldBackPrimary) {
      // Neue Karte komplett anders (nicht nur gedreht)
      this.cardEnterPhase.set('init');
      // Slide Animation starten
      this.startCardTransition();
    }
  }

  private startCardTransition() {
    if (this.cardPhaseTimeout) clearTimeout(this.cardPhaseTimeout);
    this.cardPhase.set('leaving');
    // Nächster Frame -> entering Phase (beide Karten gleichzeitig animieren)
    requestAnimationFrame(() => {
      if (this.cardPhase() === 'leaving') {
        this.cardPhase.set('entering');
        // Ab jetzt Transition aktiv für neue Karte
        this.cardEnterPhase.set('animating');
      }
    });
    // Ende nach 500ms
    this.cardPhaseTimeout = setTimeout(() => {
      this.cardPhase.set('idle');
      this.cardEnterPhase.set('idle');
    }, 500); // Dauer 500ms passend zu duration-500
  }

  toggle() {
    this.flipped.update(v => !v);
  }

  hoverOn() {
    this.hovered.set(true);
  }

  hoverOff() {
    this.hovered.set(false);
  }

  reset() {
    this.flipped.set(false);
  }
}
