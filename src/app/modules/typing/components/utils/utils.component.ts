import { NgClass, NgIf } from '@angular/common';
import {
  Component,
  signal,
  WritableSignal,
  inject,
  OnInit,
  AfterViewInit,
} from '@angular/core';
import { KeyboardService } from '../../services/keyboard.service';

@Component({
  selector: 'utils',
  templateUrl: './utils.component.html',
  standalone: true,
  imports: [NgClass, NgIf],
  host: {},
})
export class UtilsComponent implements OnInit, AfterViewInit {
  private keyboardService: KeyboardService = inject(KeyboardService);

  public sound: WritableSignal<boolean> = signal(true);

  private lastWpm: WritableSignal<number> = signal(0);
  public wpm: WritableSignal<number> = signal(0);

  public wpmProgress: WritableSignal<number> = signal(0);
  public wpmProgressStatus: WritableSignal<boolean> = signal(false);

  public accuracy: WritableSignal<number> = signal(0);
  public lastAccuracy: WritableSignal<number> = signal(0);

  public AccuracyProgress: WritableSignal<number> = signal(0);
  public AccuracyProgressStatus: WritableSignal<boolean> = signal(false);

  ngOnInit(): void {
    this.keyboardService.Wpm.asObservable().subscribe((wpm: number) =>
      this.calculateProgressWpm(wpm),
    );

    this.keyboardService.accuracy
      .asObservable()
      .subscribe((accuracy: number) => this.calculateAccuracy(accuracy));
  }

  ngAfterViewInit(): void {
    this.keyboardService.soundSubject.next(true);
  }

  public isBooleanNumber(progress: number): boolean {
    return Math.sign(progress) > 0;
  }

  private calculateAccuracy(accuracy: number): void {
    this.accuracy.set(accuracy);

    if (!this.lastAccuracy()) {
      this.lastAccuracy.set(accuracy);
      return;
    }

    this.AccuracyProgress.set(
      this.keyboardService.calculateProgress(
        this.accuracy(),
        this.lastAccuracy(),
      ),
    );

    this.lastAccuracy.set(accuracy);
    this.AccuracyProgressStatus.set(
      this.isBooleanNumber(this.AccuracyProgress()),
    );
  }

  private calculateProgressWpm(wpm: number): void {
    this.wpm.set(wpm);

    if (!this.lastWpm()) {
      this.lastWpm.set(wpm);
      return;
    }

    this.wpmProgress.set(
      this.keyboardService.calculateProgress(this.wpm(), this.lastWpm()),
    );

    this.lastWpm.set(wpm);

    this.wpmProgressStatus.set(this.isBooleanNumber(this.wpmProgress()));
  }

  //public changeSound(status: boolean): void {
  //console.log(status);
  //this.sound.set(status);
  //}

  genText = () => this.keyboardService.textSubject.next();
  pause = () => this.keyboardService.pauseSubject.next();
}
