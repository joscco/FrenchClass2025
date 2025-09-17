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

  // Animation-Phase für die Karte
  transitionPhase = signal<'idle' | 'leaving' | 'entering' | 'hidden'>('idle');
  private transitionTimeout: any;

  // Interne Daten für die angezeigte Karte
  private currentMeta: Record<string, any> = {};
  private currentFrontPrimary = '';
  private currentFrontExampleSentence = '';
  private currentBackPrimary = '';
  private currentBackExampleSentence = '';
  private currentFrontLang: 'fr' | 'de' = 'fr';
  private currentBackLang: 'fr' | 'de' = 'de';

  // Getter für Template
  getMeta() { return this.currentMeta; }
  getFrontPrimary() { return this.currentFrontPrimary; }
  getFrontExampleSentence() { return this.currentFrontExampleSentence; }
  getBackPrimary() { return this.currentBackPrimary; }
  getBackExampleSentence() { return this.currentBackExampleSentence; }
  getFrontLang() { return this.currentFrontLang; }
  getBackLang() { return this.currentBackLang; }
  getTransitionPhase() { return this.transitionPhase(); }
  isFlipped(): boolean { return this.flipped(); }
  isHovered(): boolean { return this.hovered(); }

  ngOnInit() {
    // Initialdaten setzen
    this.setCurrentCardData();
  }

  ngOnChanges(changes: SimpleChanges) {
    const watched = ['frontPrimary', 'frontExampleSentence', 'backPrimary', 'backExampleSentence', 'frontLang', 'backLang', 'meta'];
    const relevant = watched.some(k => k in changes && !changes[k]!.firstChange);
    if (!relevant) return;

    // Kartenwechsel erkannt
    this.startCardTransition();
  }

  private setCurrentCardData() {
    this.currentMeta = {...this.meta};
    this.currentFrontPrimary = this.frontPrimary;
    this.currentFrontExampleSentence = this.frontExampleSentence;
    this.currentBackPrimary = this.backPrimary;
    this.currentBackExampleSentence = this.backExampleSentence;
    this.currentFrontLang = this.frontLang;
    this.currentBackLang = this.backLang;
  }

  private startCardTransition() {
    // Karte animiert raus
    this.transitionPhase.set('leaving');
    if (this.transitionTimeout) clearTimeout(this.transitionTimeout);
    this.transitionTimeout = setTimeout(() => {
      // Karte wird "gebeamed" (ohne Transition von links nach rechts)
      this.transitionPhase.set('hidden');
      // Daten aktualisieren
      this.setCurrentCardData();
      // Nächster Frame: Karte animiert rein
      setTimeout(() => {
        this.transitionPhase.set('entering');
        this.transitionTimeout = setTimeout(() => {
          // Animation beendet
          this.transitionPhase.set('idle');
        }, 300);
      }, 10); // Minimaler Delay, damit DOM die hidden-Phase rendert
    }, 300);
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
