import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { Pessoa } from '../../models/pessoa.model';

@Component({
  selector: 'app-pessoa-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pessoa-search.component.html',
  styleUrls: ['./pessoa-search.component.css'],
})
export class PessoaSearchComponent {
  @Input() isLoading = false;
  @Input() resultados: Pessoa[] = [];

  @Output() pesquisar = new EventEmitter<string>();
  @Output() selecionar = new EventEmitter<Pessoa>();

  searchQuery = new FormControl('');
  searchError = '';

  onPesquisar(): void {
    const query = this.searchQuery.value?.trim();
    if (!query) {
      this.searchError = 'Informe um Nome ou CPF para pesquisar.';
      return;
    }
    this.searchError = '';
    this.pesquisar.emit(query);
    this.searchQuery.reset();
  }

  onSelecionar(pessoa: Pessoa): void {
    this.selecionar.emit(pessoa);
  }
}
