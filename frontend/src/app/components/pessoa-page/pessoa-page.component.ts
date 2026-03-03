import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { PessoaService } from '../../services/pessoa.service';
import { Pessoa, PesoIdealResponse } from '../../models/pessoa.model';
import { ApiError } from '../../models/api-error.model';
import { PessoaSearchComponent } from '../pessoa-search/pessoa-search.component';
import { PessoaFormComponent } from '../pessoa-form/pessoa-form.component';
import { PesoIdealModalComponent } from '../peso-ideal-modal/peso-ideal-modal.component';

@Component({
  selector: 'app-pessoa-page',
  standalone: true,
  imports: [CommonModule, PessoaSearchComponent, PessoaFormComponent, PesoIdealModalComponent],
  templateUrl: './pessoa-page.component.html',
  styleUrls: ['./pessoa-page.component.css'],
})
export class PessoaPageComponent {
  @ViewChild(PessoaFormComponent) formComponent!: PessoaFormComponent;
  @ViewChild(PessoaSearchComponent) searchComponent!: PessoaSearchComponent;

  pessoaSelecionada: Pessoa | null = null;
  resultadosBusca: Pessoa[] = [];
  pesoIdealResult: PesoIdealResponse | null = null;
  showPesoIdealModal = false;

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private pessoaService: PessoaService) {}

  // --- Eventos do pessoa-search ---

  onPesquisar(query: string): void {
    this.isLoading = true;
    this.clearMessages();
    this.pessoaSelecionada = null;

    this.pessoaService.pesquisar(query).subscribe({
      next: (results) => {
        this.resultadosBusca = results;
        if (results.length === 1) {
          this.onSelecionar(results[0]);
        } else if (results.length === 0) {
          this.errorMessage = 'Nenhuma pessoa encontrada.';
        }
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.handleError(err);
        this.isLoading = false;
      },
    });
  }

  onSelecionar(pessoa: Pessoa): void {
    this.pessoaSelecionada = pessoa;
    this.resultadosBusca = [];
    this.clearMessages();
    this.successMessage = `Pessoa '${pessoa.nome}' selecionada.`;
  }

  // --- Eventos do pessoa-form ---

  onIncluir(payload: Pessoa): void {
    this.isLoading = true;
    this.clearMessages();

    this.pessoaService.criar(payload).subscribe({
      next: (created) => {
        this.successMessage = `Pessoa '${created.nome}' incluída com sucesso (id=${created.id}).`;
        this.pessoaSelecionada = null;
        this.formComponent.resetForm();
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.handleError(err);
        this.isLoading = false;
      },
    });
  }

  onAlterar(payload: Pessoa): void {
    if (!this.pessoaSelecionada) return;
    this.isLoading = true;
    this.clearMessages();

    this.pessoaService.atualizar(this.pessoaSelecionada.id!, payload).subscribe({
      next: (updated) => {
        this.successMessage = `Pessoa '${updated.nome}' atualizada com sucesso.`;
        this.pessoaSelecionada = updated;
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.handleError(err);
        this.isLoading = false;
      },
    });
  }

  onExcluir(id: number): void {
    this.isLoading = true;
    this.clearMessages();

    this.pessoaService.excluir(id).subscribe({
      next: () => {
        this.successMessage = 'Pessoa excluída com sucesso.';
        this.pessoaSelecionada = null;
        this.formComponent.resetForm();
        this.searchComponent.searchQuery.setValue('');
        this.resultadosBusca = [];
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.handleError(err);
        this.isLoading = false;
      },
    });
  }

  onCalcularPesoIdeal(id: number): void {
    this.clearMessages();
    this.pessoaService.calcularPesoIdeal(id).subscribe({
      next: (result) => {
        this.pesoIdealResult = result;
        this.showPesoIdealModal = true;
      },
      error: (err: HttpErrorResponse) => {
        this.handleError(err);
      },
    });
  }

  // --- Eventos do peso-ideal-modal ---

  onFecharModal(): void {
    this.showPesoIdealModal = false;
  }

  // --- Helpers ---

  private handleError(err: HttpErrorResponse): void {
    const apiError: ApiError = err.error;

    if (apiError?.errors) {
      this.formComponent.aplicarErrosServidor(apiError);
      this.errorMessage = apiError.detail || 'Verifique os campos destacados.';
    } else if (apiError?.detail) {
      this.errorMessage = apiError.detail;
    } else {
      this.errorMessage = 'Erro de conexão com o servidor.';
    }
  }

  private clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }
}
