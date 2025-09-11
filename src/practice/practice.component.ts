import {Component, Input, OnChanges, SimpleChanges, ViewChild, signal, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {PracticeMode} from '../mode-selector/mode-selector.component';
import {FlashcardContainerComponent} from '../flashcard-container/flashcard-container.component';

export interface PracticeCard {
  id: number | string;
  frontPrimary: string;
  frontSecondary?: string;
  backPrimary: string;
  backSecondary?: string;
  meta?: { category?: string; genus?: string; lesson?: number };
  frontLang?: 'fr' | 'de';
  backLang?: 'fr' | 'de';
}

@Component({
  selector: 'app-practice',
  standalone: true,
  imports: [CommonModule, MatButtonModule, FlashcardContainerComponent, FlashcardContainerComponent],
  templateUrl: './practice.component.html'
})
export class PracticeComponent implements OnInit, OnChanges {
  @Input() cards: PracticeCard[] = [];
  @Input() mode: PracticeMode = 'fr-de';

  @ViewChild('fc') flashcard?: FlashcardContainerComponent;

  index = signal(0);
  oriented = signal<PracticeCard[]>([]);
  navDirection = signal<'next' | 'prev'>('next');

  ngOnInit() {
    this.index.set(0);
    this.prepare();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cards'] || changes['mode']) {
      this.prepare();
    }
  }

  prepare() {
    const arr = [...this.cards];
    const oriented = arr.map(c => this.orientCard(c, this.mode));
    this.oriented.set(oriented);
    this.flashcard?.reset();
  }

  current(): PracticeCard {
    const a = this.oriented();
    const i = this.index();
    return a[Math.min(Math.max(0, i), Math.max(0, a.length - 1))] ?? {
      id: 'empty', frontPrimary: '', backPrimary: '', frontLang: 'fr', backLang: 'de'
    };
  }

  prev() {
    this.navDirection.set('prev');
    this.index.update(i => Math.max(0, i - 1));
    this.flashcard?.reset();
  }

  next() {
    this.navDirection.set('next');
    this.index.update(i => Math.min(this.oriented().length - 1, i + 1));
    this.flashcard?.reset();
  }

  private orientCard(card: PracticeCard, mode: PracticeMode): PracticeCard {
    const base: PracticeCard = {...card, frontLang: 'fr', backLang: 'de'};
    if (mode === 'fr-de') return base;
    if (mode === 'de-fr') {
      return {
        ...card,
        frontPrimary: card.backPrimary,
        frontSecondary: card.backSecondary,
        backPrimary: card.frontPrimary,
        backSecondary: card.frontSecondary,
        frontLang: 'de',
        backLang: 'fr'
      };
    }
    // mixed
    const frFirst = Math.random() < 0.5;
    return frFirst ? base : {
      ...card,
      frontPrimary: card.backPrimary,
      frontSecondary: card.backSecondary,
      backPrimary: card.frontPrimary,
      backSecondary: card.frontSecondary,
      frontLang: 'de',
      backLang: 'fr'
    };
  }
}
