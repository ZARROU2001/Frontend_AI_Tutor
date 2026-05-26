import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface LabelScore {
  label: string;
  score: number;
}

export interface AskResponse {
  question: string;
  route: string;
  predicted_labels: string[];
  label_scores: LabelScore[];
  slides_used: number[];
  answer: string;
  guard_in_scope?: boolean | null;
  guard_reason?: string | null;
  top_slide_page?: number | null;
  top_slide_text?: string | null;
  slide_image_url?: string | null;
  slides_preview?: {
    page?: number | null;
    text?: string | null;
    image_url?: string | null;
  }[];
}

export interface HealthResponse {
  status: string;
  model_loaded: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TutorService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  ask(question: string): Observable<AskResponse> {
    return this.http.post<AskResponse>(
      `${this.baseUrl}/ask`,
      { question }
    );
  }

  health(): Observable<HealthResponse> {
    return this.http.get<HealthResponse>(
      `${this.baseUrl}/health`
    );
  }
}