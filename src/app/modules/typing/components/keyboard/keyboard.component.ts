import {
  Component,
  input,
  OnInit,
  viewChildren,
  inject,
  OnDestroy,
  viewChild,
} from '@angular/core';
import { ButtonKeyComponent } from '../button-key/button-key.component';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { KeyboardService } from '../../services/keyboard.service';

@Component({
  selector: 'keyboard',
  templateUrl: './keyboard.component.html',
  standalone: true,
  imports: [ButtonKeyComponent, CommonModule],
})
export class KeyboardComponent implements OnInit, OnDestroy {
  public keyslist!: string[];
  public chooseSide = input<boolean>();

  private ButtonKeyComponent = viewChildren(ButtonKeyComponent);

  private keySubscription!: Subscription;

  private keyboardService = inject(KeyboardService);

  ngOnInit(): void {
    this.keyslist = this.chooseSide() ? this.keysRight : this.keysLeft;

    this.keySubscription = this.keyboardService.keyboard$.subscribe(
      (event: KeyboardEvent) => this.handleKeyPress(event),
    );
  }

  ngOnDestroy(): void {
    this.keySubscription.unsubscribe();
  }

  handleKeyPress(event: KeyboardEvent): void {
    this.ButtonKeyComponent().forEach((button) => {
      button.keyPressed(event.key);
    });
  }

  public readonly keysRight = [
    'Y',
    'H',
    'N',
    'U',
    'J',
    'M',
    'I',
    'K',
    ',',
    'O',
    'L',
    '.',
    'P',
    ';',
    '?',
    'Del',
    "'",
    '~',
    'Enter',
    'F3',
    'Tab',
  ];

  public readonly keysLeft = [
    'Esc',
    'shift',
    'ctrl',
    'Q',
    'A',
    'Z',
    'W',
    'S',
    'X',
    'E',
    'D',
    'C',
    'R',
    'F',
    'V',
    'T',
    'G',
    'B',
    'Cmd',
    'F2',
    'Space',
  ];
}
