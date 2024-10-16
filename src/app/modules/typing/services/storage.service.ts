import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  setKey = (key: string, value: string): void =>
    localStorage.setItem(key, value);

  getKey = (key: string): string | null => localStorage.getItem(key);
}
