import {Component, computed, signal, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LessonOption, LessonSelectorComponent} from '../lesson-selector/lesson-selector.component';
import {ModeSelectorComponent, PracticeMode} from '../mode-selector/mode-selector.component';
import {PracticeCard, PracticeComponent} from '../practice/practice.component';
import {VocabService} from './vocab.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, LessonSelectorComponent, ModeSelectorComponent, PracticeComponent],
  templateUrl: './app.html',
  host: {'class': 'h-full'},
})
export class AppComponent {
  private vocab = inject(VocabService);
  loading = signal(true);

  constructor() {
    // CSV Dateien laden
    this.vocab.loadAll().finally(() => this.loading.set(false));
  }

  // Alle Lektionen aus geladenen Rows ableiten
  lessons = computed<LessonOption[]>(() => {
    const rows = this.vocab.rows();
    const set = new Set(rows.map(r => r.lesson));
    return ['Alle', ...Array.from(set).sort((a,b)=>a-b).map(n => `Lektion ${n}` as LessonOption)];
  });

  selectedLessons = signal<LessonOption>('Alle');
  mode = signal<PracticeMode>('fr-de');

  practiceCards = computed<PracticeCard[]>(() => {
    const rows = this.vocab.rows();
    const sel = this.selectedLessons();
    return rows.filter(r => {
      if (sel === 'Alle') return true;
      const n = Number(sel.replace('Lektion ', ''));
      return r.lesson === n;
    }).map<PracticeCard>(r => ({
      id: r.id,
      frontPrimary: r.fr_word,
      frontSecondary: r.fr_sentence ?? '',
      backPrimary: r.de_word,
      backSecondary: r.de_sentence ?? '',
      meta: { category: r.category, fr_genus: r.fr_genus, de_genus: r.de_genus, fr_needs_vowel_article: r.fr_needs_vowel_article, lesson: r.lesson }
    }));
  });

  onLessonsChange(sel: LessonOption) { this.selectedLessons.set(sel); }
}
