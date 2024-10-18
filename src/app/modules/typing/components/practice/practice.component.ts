import {
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { KeyboardService } from '../../services/keyboard.service';
import { NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { faker } from '@faker-js/faker';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'practice',
  templateUrl: './practice.component.html',
  styleUrls: ['./practice.component.css'],
  standalone: true,
  imports: [NgClass, NgFor, NgIf, NgStyle],
})
export class PracticeComponent implements OnInit {
  private soundSucess: HTMLAudioElement = new Audio('sounds/success.mp3');
  private soundWrong: HTMLAudioElement = new Audio('sounds/wrong.mp3');

  private keyboardService: KeyboardService = inject(KeyboardService);
  private storageService: StorageService = inject(StorageService);

  public InitialTime!: Date;

  public isWrong: WritableSignal<boolean> = signal(false);

  private countChars: WritableSignal<number> = signal(0);

  private accuracy: WritableSignal<number> = signal(0);

  public init: WritableSignal<boolean> = signal(false);

  public index: WritableSignal<number> = signal(0);
  public indexChar: WritableSignal<number> = signal(0);
  private longIndex: WritableSignal<number> = signal(0);

  private sound: WritableSignal<number> = signal(0);

  public text!: string;

  private originalText!: string;

  ngOnInit(): void {
    this.keyboardService.keyboardSubject
      .asObservable()
      .subscribe((key: KeyboardEvent) => this.controlKey(key));

    this.keyboardService.textSubject
      .asObservable()
      .subscribe(() => this.genText());

    this.keyboardService.pauseSubject
      .asObservable()
      .subscribe(() => (this.init.set(false), this.genText()));

    this.keyboardService.soundSubject
      .asObservable()
      .subscribe((state: number) => this.sound.set(state));

    this.genText();
  }

  public OnInit(): void {
    if (this.longIndex() != 0) return;

    this.init.set(true);
    this.InitialTime = new Date();
  }

  private onFinish(): void {
    this.keyboardService.calculateWpm(
      this.InitialTime,
      new Date(),
      this.countChars(),
    );

    this.keyboardService.calculateAccuracy(
      this.originalText.length - this.accuracy(),
      this.originalText.length,
    );

    this.init.set(false);
    this.genText();
  }

  private genText(): void {
    this.index.set(0),
      this.indexChar.set(0),
      this.longIndex.set(0),
      this.accuracy.set(0);
    this.originalText = faker.lorem.paragraph();
    this.text = this.originalText.replace(/ /g, ' _');

    this.countChars.set(this.originalText.length);
  }

  playAudio(state: boolean): void {
    if (!this.sound()) return;

    const soundToPlay = state ? this.soundSucess : this.soundWrong;

    soundToPlay.playbackRate = 2;

    if (!soundToPlay.paused) {
      soundToPlay.pause(), (soundToPlay.currentTime = 0);
    }

    soundToPlay.play();
  }

  controlKey(key: KeyboardEvent): void {
    if (!this.init()) return;

    const textSplit: string[] = this.text.split('_');
    const currentWord: string = textSplit[this.index()];

    if (this.longIndex() == this.originalText.length - 1) this.onFinish();

    if (key.key === currentWord[this.indexChar()]) {
      this.indexChar.update((i) => i + 1);
      this.isWrong.set(false);
      this.playAudio(true);

      if (this.indexChar() >= currentWord.length)
        this.index.update((i) => i + 1), this.indexChar.set(0);

      this.longIndex.update((i) => i + 1);
    } else {
      this.accuracy.update((i) => i + 1);
      this.playAudio(false);
      this.isWrong.set(true);
    }
  }
}
