import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TutorService, AskResponse } from '../services/tutor.service';
import { LinebreaksPipe } from '../pipes/linebreaks.pipe';

export interface Message {
  role: 'user' | 'assistant';
  text: string;
  route?: string;
  labels?: string[];
  slides?: number[];
  loading?: boolean;
  error?: boolean;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, LinebreaksPipe],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('messagesEnd') private messagesEnd!: ElementRef;

  messages: Message[] = [];
  inputText = '';
  isLoading = false;
  backendOnline = false;

  readonly ROUTE_HINTS = [
    { prefix: '📖', label: 'Alles fragen', example: 'Was ist fallbasiertes Schließen?' },
    { prefix: '📝', label: 'Zusammenfassung', example: 'Zusammenfassung zu Retrieval-Methoden' },
    { prefix: '🧠', label: 'Quiz', example: 'Quiz: CBR-Zyklus Schritte' },
  ];

  constructor(private tutorService: TutorService) {}

  ngOnInit(): void {
    this.tutorService.health().subscribe({
      next: (res) => { this.backendOnline = res.model_loaded; },
      error: ()  => { this.backendOnline = false; }
    });

    this.messages.push({
      role: 'assistant',
      text: 'Hallo! Ich bin dein KI-Tutor. Stell mir eine Frage zu deinen Vorlesungsfolien.\n\n' +
            'Tipp: Beginne mit **„Quiz:"** für eine Quizfrage oder **„Zusammenfassung"** für eine Übersicht.'
    });
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  send(): void {
    const question = this.inputText.trim();
    if (!question || this.isLoading) return;

    this.messages.push({ role: 'user', text: question });
    this.inputText = '';
    this.isLoading = true;

    const placeholder: Message = { role: 'assistant', text: '', loading: true };
    this.messages.push(placeholder);

    this.tutorService.ask(question).subscribe({
      next: (res: AskResponse) => {
        const idx = this.messages.lastIndexOf(placeholder);
        this.messages[idx] = {
          role: 'assistant',
          text: res.answer,
          route: res.route,
          labels: res.predicted_labels,
          slides: res.slides_used,
        };
        this.isLoading = false;
      },
      error: () => {
        const idx = this.messages.lastIndexOf(placeholder);
        this.messages[idx] = {
          role: 'assistant',
          text: 'Fehler: Der Server ist nicht erreichbar. Bitte starte das Backend.',
          error: true,
        };
        this.isLoading = false;
      }
    });
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.send();
    }
  }

  useHint(example: string): void {
    this.inputText = example;
  }

  routeIcon(route: string | undefined): string {
    const icons: Record<string, string> = { tutor: '📖', summary: '📝', quiz: '🧠' };
    return icons[route ?? ''] ?? '📖';
  }

  private scrollToBottom(): void {
    try { this.messagesEnd.nativeElement.scrollIntoView({ behavior: 'smooth' }); }
    catch (_) {}
  }
}
