import {Component, computed, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LessonOption, LessonSelectorComponent} from '../lesson-selector/lesson-selector.component';
import {ModeSelectorComponent, PracticeMode} from '../mode-selector/mode-selector.component';
import {PracticeCard, PracticeComponent} from '../practice/practice.component';

export interface VocabRow {
  date: number;
  id: number;
  category: 'verb' | 'noun' | 'adj' | 'expr' | string;
  genus?: 'm.' | 'f.' | 'mpl.' | '';
  fr_word: string;
  fr_sentence?: string;
  de_word: string;
  de_sentence?: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, LessonSelectorComponent, ModeSelectorComponent, PracticeComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  // Dummy-Lektionen (aus deiner Struktur "date" als Lektionsnummer)
  private data = signal<VocabRow[]>([
    { date: 1, id: 1, category: 'verb', fr_word: "s'inscrire", fr_sentence: "Je vais m'inscrire à un cours de français.", de_word: "sich anmelden", de_sentence: "Ich melde mich zu einem Französischkurs an." },
    { date: 1, id: 2, category: 'noun', genus: 'f.', fr_word: "une manifestation", fr_sentence: "Il y avait une manifestation dans la rue principale.", de_word: "eine Demonstration", de_sentence: "In der Hauptstraße gab es eine Demo." },
    { date: 1, id: 3, category: 'verb', fr_word: "désinfecter", fr_sentence: "Il faut désinfecter la plaie.", de_word: "desinfizieren", de_sentence: "Man muss die Wunde desinfizieren." },
    { date: 1, id: 4, category: 'noun', genus: 'm.', fr_word: "le frigidaire", fr_sentence: "Le frigidaire est plein de légumes.", de_word: "der Kühlschrank", de_sentence: "Der Kühlschrank ist voller Gemüse." },
    { date: 1, id: 5, category: 'noun', genus: 'm.', fr_word: "le camping", fr_sentence: "Nous faisons du camping près du lac.", de_word: "Camping", de_sentence: "Wir machen Camping am See." },
  ]);

  // Lektionen aus den vorhandenen "date"-Werten ermitteln
  lessons = computed<LessonOption[]>(() => {
    const set = new Set(this.data().map(r => r.date));
    return ['Alle', ...Array.from(set).sort((a,b)=>a-b).map(n => `Lektion ${n}` as LessonOption)];
  });

  selectedLessons = signal<LessonOption>('Alle');
  mode = signal<PracticeMode>('fr-de');

  // Filter + Mapping zu PracticeCards
  practiceCards = computed<PracticeCard[]>(() => {
    const sel = this.selectedLessons();
    const rows = this.data().filter(r => {
      if (sel === 'Alle') return true;
      const n = Number(sel.replace('Lektion ', ''));
      return r.date === n;
    });
    return rows.map<PracticeCard>(r => ({
      id: r.id,
      frontPrimary: r.fr_word,
      frontSecondary: r.fr_sentence ?? '',
      backPrimary: r.de_word,
      backSecondary: r.de_sentence ?? '',
      meta: { category: r.category, genus: r.genus, lesson: r.date }
    }));
  });

  onLessonsChange(sel: LessonOption) {
    this.selectedLessons.set(sel);
  }
}
