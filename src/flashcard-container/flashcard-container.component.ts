import {
  Component,
  Input,
  signal,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef,
  OnDestroy,
  AfterViewInit, OnInit, SimpleChange
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {FlashcardCardComponent} from './flashcard/flashcard-card.component';
import gsap from 'gsap';
import {Language} from '../practice/practice.component';

@Component({
  selector: 'app-flashcard-container',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, FlashcardCardComponent],
  templateUrl: './flashcard-container.component.html',
})
export class FlashcardContainerComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @Input() meta: Record<string, any> = {};
  @Input() frenchPrimary = '';
  @Input() frenchExampleSentence = '';
  @Input() germanPrimary = '';
  @Input() germanExampleSentence = '';
  @Input() frontLang: Language = 'french';
  @Input() direction: 'next' | 'prev' = 'next';

  @ViewChild('cardRef', {static: true}) cardRef!: ElementRef<HTMLDivElement>;

  flipped = signal(false);
  hovered = signal(false);

  // Interne Daten für die angezeigte Karte
  private currentMeta: Record<string, any> = {};
  private currentFrenchPrimary = '';
  private currentFrenchExampleSentence = '';
  private currentGermanPrimary = '';
  private currentGermanExampleSentence = '';
  private currentFrontLang: Language = 'french';

  // Getter für Template
  getMeta() {
    return this.currentMeta;
  }

  getFrenchPrimary() {
    return this.currentFrenchPrimary;
  }

  getFrenchExampleSentence() {
    return this.currentFrenchExampleSentence;
  }

  getGermanPrimary() {
    return this.currentGermanPrimary;
  }

  getGermanExampleSentence() {
    return this.currentGermanExampleSentence;
  }

  getFrontLang() {
    return this.currentFrontLang;
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
    const watched = ['frenchPrimary', 'germanPrimary'];
    const relevant = watched.some(k => k in changes && !changes[k]!.firstChange);
    if (relevant) {
      this.animateCardSwap();
    } else {
      this.setCurrentCardData();
    }
  }

  ngOnDestroy() {
    if (this.cardRef) {
      gsap.killTweensOf(this.cardRef.nativeElement);
    }
  }

  private setCurrentCardData() {
    this.currentMeta = {...this.meta};
    this.currentFrenchPrimary = this.frenchPrimary;
    this.currentFrenchExampleSentence = this.frenchExampleSentence;
    this.currentGermanPrimary = this.germanPrimary;
    this.currentGermanExampleSentence = this.germanExampleSentence;
    this.currentFrontLang = this.frontLang;
    this.resetFlip();
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

  resetFlip() {
    this.flipped.set(false);
  }
}
