import {
  Component,
  ElementRef,
  inject,
  OnInit,
  signal,
  viewChild,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { KeyboardService } from '../../services/keyboard.service';
import { NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { StorageService } from '../../services/storage.service';
import { faker } from '@faker-js/faker';

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

  private storageService: StorageService = inject(StorageService);
  private keyboardService: KeyboardService = inject(KeyboardService);

  private sound: WritableSignal<boolean> = signal(
    Boolean(this.storageService.getKey('sound') ?? false),
  );

  public text!: string;

  private originalText!: string;

  @ViewChild('textContainer', { static: false }) textContainer!: ElementRef;

  ngOnInit(): void {
    this.keyboardService.keyboard$.subscribe((key: KeyboardEvent) =>
      this.controlKey(key),
    );

    this.keyboardService.sound$.subscribe((status: boolean) =>
      this.sound.set(status),
    );

    this.keyboardService.text$.subscribe(() => this.genText());

    this.genText();
  }

  public isWrong: WritableSignal<boolean> = signal(false);

  public init: WritableSignal<boolean> = signal(false);

  public index: number = 0;
  public indexChar: number = 0;
  private longIndex: number = 0;

  private genText(): void {
    this.index = this.indexChar = this.longIndex = 0;
    this.originalText = faker.lorem.paragraph();
    this.text = this.originalText.replace(/ /g, ' _');
  }

  controlKey(key: KeyboardEvent): void {
    if (!this.init()) return;

    const textSplit: string[] = this.text.split('_');
    const currentWord: string = textSplit[this.index];

    if (this.longIndex == this.originalText.length - 1) this.genText();

    if (key.key === currentWord[this.indexChar]) {
      if (this.sound()) this.soundSucess.play();
      this.indexChar++;
      this.isWrong.set(false);

      if (this.indexChar >= currentWord.length)
        this.index++, (this.indexChar = 0);

      this.longIndex++;
    } else {
      if (this.sound()) this.soundWrong.play();
      this.isWrong.set(true);
    }
  }
}
