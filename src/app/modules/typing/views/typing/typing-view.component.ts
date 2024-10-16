import {
  Component,
  ElementRef,
  HostListener,
  inject,
  Signal,
  viewChild,
} from '@angular/core';
import { KeyboardComponent } from '@/modules/typing/components/keyboard/keyboard.component';
import { KeyboardService } from '../../services/keyboard.service';
import { PracticeComponent } from '../../components/practice/practice.component';
import { UtilsComponent } from '../../components/utils/utils.component';

@Component({
  selector: 'typing-view',
  templateUrl: './typing-view.component.html',
  standalone: true,
  imports: [KeyboardComponent, PracticeComponent, UtilsComponent],
  host: {
    '(document:keydown)': 'handleKeyPress($event)',
  },
})
export default class TypingViewComponent {
  private practice: Signal<PracticeComponent | undefined> =
    viewChild('practice');

  private keyboardService = inject(KeyboardService);

  private readonly ignoreKeys: string[] = ['Shift', 'Control', 'Enter'];

  public handleKeyPress = (event: KeyboardEvent) => {
    if (event.key == 'Enter') this.practice()?.init.set(true);

    if (!this.ignoreKeys.includes(event.key))
      this.keyboardService.onKeyPress(event);
  };
}
