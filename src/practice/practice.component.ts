import {Component, Input, OnChanges, SimpleChanges, ViewChild, signal, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {PracticeMode} from '../mode-selector/mode-selector.component';
import {FlashcardContainerComponent} from '../flashcard-container/flashcard-container.component';
import {NavButtonComponent} from './nav-button/nav-button.component';

export type Language = 'french' | 'german';

export function reverseLanguage(lang: Language): Language {
  return lang === 'french' ? 'german' : 'french';
}

export interface PracticeCard {
  id: number | string;
  frenchPrimary: string;
  frenchSecondary?: string;
  germanPrimary: string;
  germanSecondary?: string;
  meta?: { category?: string; fr_genus?: string; de_genus?: string, fr_needs_vowel_article: boolean, lesson?: number };
  frontLanguage?: Language;
}

@Component({
  selector: 'app-practice',
  standalone: true,
  imports: [CommonModule, MatButtonModule, FlashcardContainerComponent, FlashcardContainerComponent, NavButtonComponent],
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
    this.prepareAndOrientCards();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cards'] || changes['mode']) {
      this.prepareAndOrientCards();
    }
  }

  prepareAndOrientCards() {
    const arr = [...this.cards];
    const oriented = arr.map(c => this.orientCard(c, this.mode));
    this.oriented.set(oriented);
    this.flashcard?.resetFlip();
  }

  current(): PracticeCard {
    const a = this.oriented();
    const i = this.index();
    return a[Math.min(Math.max(0, i), Math.max(0, a.length - 1))] ?? {
      id: 'empty', frenchPrimary: '', germanPrimary: '', frontLanguage: 'fr', backLang: 'de'
    };
  }

  prev() {
    this.navDirection.set('prev');
    this.index.update(i => Math.max(0, i - 1));
  }

  next() {
    this.navDirection.set('next');
    this.index.update(i => Math.min(this.oriented().length - 1, i + 1));
  }

  private orientCard(card: PracticeCard, mode: PracticeMode): PracticeCard {
    if (mode === 'fr-de') {
      return {...card, frontLanguage: 'french'};
    }
    if (mode === 'de-fr') {
      return {...card, frontLanguage: 'german'};
    }

    // mixed
    const frontLanguage = Math.random() < 0.5 ? 'french' : 'german';
    return {...card, frontLanguage: frontLanguage};
  }
}
