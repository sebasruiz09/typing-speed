import { NgClass } from '@angular/common';
import {
  Component,
  signal,
  WritableSignal,
  inject,
  OnInit,
} from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { KeyboardService } from '../../services/keyboard.service';

@Component({
  selector: 'utils',
  templateUrl: './utils.component.html',
  standalone: true,
  imports: [NgClass],
  host: {},
})
export class UtilsComponent implements OnInit {
  private storageService: StorageService = inject(StorageService);
  private keyboardService: KeyboardService = inject(KeyboardService);

  public sound: WritableSignal<boolean> = signal(
    Boolean(this.storageService.getKey('sound')) ?? false,
  );

  ngOnInit(): void {
    const soundKey = this.storageService.getKey('sound');
    if (!soundKey) this.storageService.setKey('sound', String(false));
  }

  public changeSound(status: boolean): void {
    this.sound.set(status);
    this.storageService.setKey('sound', String(status));

    this.keyboardService.soundSubject.next(status);
  }

  genText = () => this.keyboardService.textSubject.next();
}
