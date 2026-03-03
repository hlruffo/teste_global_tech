import { Routes } from '@angular/router';
import { PessoaPageComponent } from './components/pessoa-page/pessoa-page.component';

export const routes: Routes = [
  { path: '', redirectTo: 'pessoas', pathMatch: 'full' },
  { path: 'pessoas', component: PessoaPageComponent },
];
