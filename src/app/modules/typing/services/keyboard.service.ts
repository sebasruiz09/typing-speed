import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class KeyboardService {
  public keyboardSubject = new Subject<KeyboardEvent>();

  public textSubject = new Subject<void>();

  public pauseSubject = new Subject<void>();

  public soundSubject = new Subject<number>();

  public Wpm = new Subject<number>();

  public accuracy = new Subject<number>();

  onKeyPress(event: KeyboardEvent): void {
    this.keyboardSubject.next(event);
  }

  calculateWpm(initTime: Date, finalTime: Date, words: number): void {
    const mins = (finalTime.getTime() - initTime.getTime()) / (1000 * 60);
    this.Wpm.next(words / 5 / mins);
  }

  calculateAccuracy = (accuracy: number, chars: number): void =>
    this.accuracy.next((accuracy / chars) * 100);

  calculateProgress = (entry: number, last: number): number =>
    ((entry - last) / ((entry + last) / 2)) * 100;
}
