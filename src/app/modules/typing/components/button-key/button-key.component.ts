import {
  Component,
  ElementRef,
  input,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'button-key',
  templateUrl: './button-key.component.html',
  styleUrls: ['./button-key.component.scss'],
  standalone: true,
})
export class ButtonKeyComponent implements OnInit {
  public isDoubleSize = input<boolean>();

  private equalsTable: Record<string, string> = {
    ' ': 'space',
    Backspace: 'del',
    Enter: 'enter',
    _: 'space',
  };

  public isPressed = signal(false);

  value = viewChild<ElementRef<HTMLButtonElement>>('button');

  ngOnInit(): void {}

  public keyPressed(key: string): void {
    key = this.equalsTable[key] || key;

    const output = this.value()?.nativeElement.innerText.toLowerCase();

    if (output != key) return;

    this.isPressed.set(true);

    setTimeout(() => {
      this.isPressed.set(false);
    }, 150);
  }
}
