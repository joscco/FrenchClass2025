import {
  Component,
  Input,
  signal,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef,
  OnDestroy,
  AfterViewInit
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {FlashcardCardComponent} from '../flashcard/flashcard-card.component';
import gsap from 'gsap';

@Component({
  selector: 'app-flashcard-container',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, FlashcardCardComponent],
  templateUrl: './flashcard-container.component.html',
})
export class FlashcardContainerComponent implements OnChanges, AfterViewInit, OnDestroy {
  @Input() meta: Record<string, any> = {};
  @Input() frontPrimary = '';
  @Input() frontExampleSentence = '';
  @Input() backPrimary = '';
  @Input() backExampleSentence = '';
  @Input() frontLang: 'fr' | 'de' = 'fr';
  @Input() backLang: 'fr' | 'de' = 'de';
  @Input() direction: 'next' | 'prev' = 'next';

  @ViewChild('cardRef', {static: true}) cardRef!: ElementRef<HTMLDivElement>;

  flipped = signal(false);
  hovered = signal(false);

  // Interne Daten für die angezeigte Karte
  private currentMeta: Record<string, any> = {};
  private currentFrontPrimary = '';
  private currentFrontExampleSentence = '';
  private currentBackPrimary = '';
  private currentBackExampleSentence = '';
  private currentFrontLang: 'fr' | 'de' = 'fr';
  private currentBackLang: 'fr' | 'de' = 'de';

  // Getter für Template
  getMeta() {
    return this.currentMeta;
  }

  getFrontPrimary() {
    return this.currentFrontPrimary;
  }

  getFrontExampleSentence() {
    return this.currentFrontExampleSentence;
  }

  getBackPrimary() {
    return this.currentBackPrimary;
  }

  getBackExampleSentence() {
    return this.currentBackExampleSentence;
  }

  getFrontLang() {
    return this.currentFrontLang;
  }

  getBackLang() {
    return this.currentBackLang;
  }

  isFlipped(): boolean {
    return this.flipped();
  }

  isHovered(): boolean {
    return this.hovered();
  }

  ngOnInit() {
    this.setCurrentCardData();
  }

  ngAfterViewInit() {
    if (this.cardRef) {
      gsap.set(this.cardRef.nativeElement, {x: 0, opacity: 1});
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    const watched = ['frontPrimary', 'frontExampleSentence', 'backPrimary', 'backExampleSentence', 'frontLang', 'backLang', 'meta'];
    const relevant = watched.some(k => k in changes && !changes[k]!.firstChange);
    if (!relevant) return;

    this.animateCardSwap();
  }

  ngOnDestroy() {
    if (this.cardRef) {
      gsap.killTweensOf(this.cardRef.nativeElement);
    }
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

  private animateCardSwap() {
    const el = this.cardRef?.nativeElement;
    if (!el) {
      this.setCurrentCardData();
      return;
    }

    // Bestehende Tweens stoppen
    gsap.killTweensOf(el);

    const outX = this.direction === 'next' ? '-100%' : '100%';
    const inFromX = this.direction === 'next' ? '100%' : '-100%';

    // Raus-Animation
    gsap.to(el, {
      x: outX,
      opacity: 0,
      duration: 0.28,
      ease: 'power2.in',
      onComplete: () => {
        // Sofort an die Startposition der Rein-Animation setzen
        gsap.set(el, {x: inFromX});
        // Daten wechseln
        this.setCurrentCardData();
        // Rein-Animation
        gsap.to(el, {x: 0, opacity: 1, duration: 0.32, ease: 'power2.out'});
      }
    });
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
