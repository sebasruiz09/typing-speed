import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class KeyboardService {
  private keyboardSubject = new Subject<KeyboardEvent>();
  public keyboard$ = this.keyboardSubject.asObservable();

  public soundSubject = new Subject<boolean>();
  public sound$ = this.soundSubject.asObservable();

  public textSubject = new Subject<void>();
  public text$ = this.textSubject.asObservable();

  onKeyPress(event: KeyboardEvent): void {
    this.keyboardSubject.next(event);
  }
}
