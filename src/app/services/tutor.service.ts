import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
}

export interface HealthResponse {
  status: string;
  model_loaded: boolean;
}

@Injectable({ providedIn: 'root' })
export class TutorService {
  private readonly baseUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  ask(question: string): Observable<AskResponse> {
    return this.http.post<AskResponse>(`${this.baseUrl}/ask`, { question });
  }

  health(): Observable<HealthResponse> {
    return this.http.get<HealthResponse>(`${this.baseUrl}/health`);
  }
}
