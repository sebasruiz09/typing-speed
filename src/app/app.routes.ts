import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./modules/typing/views/typing/typing-view.component'),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
