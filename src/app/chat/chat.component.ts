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
  guardInScope?: boolean | null;
  guardReason?: string | null;
  topSlidePage?: number | null;
  topSlideText?: string | null;
  slideImageUrl?: string | null;
  slidesPreview?: { page?: number | null; text?: string | null; imageUrl?: string | null }[];
  currentSlideIndex?: number;
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
        let slidesPreview = (res.slides_preview || []).map((s: any) => ({ page: s.page, text: s.text, imageUrl: s.image_url }));
        // Fallback: if backend did not provide slides_preview but provided a single slide_image_url or top_slide_text,
        // create a single-entry slidesPreview so the UI can show the preview card (and navigation when >1).
        if ((!slidesPreview || slidesPreview.length === 0) && (res.slide_image_url || res.top_slide_text)) {
          slidesPreview = [{ page: res.top_slide_page ?? null, text: res.top_slide_text ?? null, imageUrl: res.slide_image_url ?? null }];
        }

        console.log('slidesPreview received from API:', slidesPreview);

        this.messages[idx] = {
          role: 'assistant',
          text: res.answer,
          route: res.route,
          labels: res.predicted_labels,
          slides: res.slides_used,
          guardInScope: res.guard_in_scope ?? null,
          guardReason: res.guard_reason ?? null,
          topSlidePage: res.top_slide_page,
          topSlideText: res.top_slide_text,
          slideImageUrl: res.slide_image_url,
          slidesPreview,
          currentSlideIndex: slidesPreview && slidesPreview.length ? 0 : undefined,
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

  prevSlide(msg: Message): void {
    if (!msg.slidesPreview || !msg.slidesPreview.length) return;
    msg.currentSlideIndex = Math.max(0, (msg.currentSlideIndex ?? 0) - 1);
  }

  nextSlide(msg: Message): void {
    if (!msg.slidesPreview || !msg.slidesPreview.length) return;
    const max = msg.slidesPreview.length - 1;
    msg.currentSlideIndex = Math.min(max, (msg.currentSlideIndex ?? 0) + 1);
  }

  

  private scrollToBottom(): void {
    try { this.messagesEnd.nativeElement.scrollIntoView({ behavior: 'smooth' }); }
    catch (_) {}
  }
}
