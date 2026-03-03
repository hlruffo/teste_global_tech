import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Pessoa } from '../../models/pessoa.model';
import { ApiError } from '../../models/api-error.model';
import { CpfMaskDirective } from '../../directives/cpf-mask.directive';

@Component({
  selector: 'app-pessoa-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CpfMaskDirective],
  templateUrl: './pessoa-form.component.html',
  styleUrls: ['./pessoa-form.component.css'],
})
export class PessoaFormComponent implements OnChanges {
  @Input() pessoaSelecionada: Pessoa | null = null;
  @Input() isLoading = false;

  @Output() incluir = new EventEmitter<Pessoa>();
  @Output() alterar = new EventEmitter<Pessoa>();
  @Output() excluir = new EventEmitter<number>();
  @Output() calcularPesoIdeal = new EventEmitter<number>();

  form!: FormGroup;

  get alterarEnabled(): boolean {
    return this.pessoaSelecionada !== null;
  }

  get excluirEnabled(): boolean {
    return this.pessoaSelecionada !== null;
  }

  get pesoIdealEnabled(): boolean {
    return this.pessoaSelecionada !== null;
  }

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2)]],
      data_nasc: ['', Validators.required],
      cpf: ['', [Validators.required]],
      sexo: ['M', Validators.required],
      altura: [null, [Validators.required, Validators.min(0.5), Validators.max(2.5)]],
      peso: [null, [Validators.required, Validators.min(1), Validators.max(500)]],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pessoaSelecionada']) {
      if (this.pessoaSelecionada) {
        this.form.patchValue({
          nome: this.pessoaSelecionada.nome,
          data_nasc: this.pessoaSelecionada.data_nasc,
          cpf: this.pessoaSelecionada.cpf,
          sexo: this.pessoaSelecionada.sexo,
          altura: this.pessoaSelecionada.altura,
          peso: this.pessoaSelecionada.peso,
        });
        this.form.get('cpf')?.disable();
        this.form.markAsPristine();
      } else {
        this.form.get('cpf')?.enable();
      }
    }
  }

  onIncluir(): void {
    if (this.form.invalid) return;
    this.incluir.emit(this.buildPayload());
  }

  onAlterar(): void {
    if (!this.pessoaSelecionada || this.form.invalid) return;
    this.alterar.emit(this.buildPayload());
  }

  onExcluir(): void {
    if (!this.pessoaSelecionada) return;
    if (!confirm(`Deseja excluir '${this.pessoaSelecionada.nome}'?`)) return;
    this.excluir.emit(this.pessoaSelecionada.id!);
  }

  onCalcularPesoIdeal(): void {
    if (!this.pessoaSelecionada) return;

    if (this.form.dirty) {
      alert('Existem alterações não salvas. Clique em "Alterar" para salvar antes de calcular o peso ideal.');
      return;
    }

    this.calcularPesoIdeal.emit(this.pessoaSelecionada.id!);
  }

  resetForm(): void {
    this.form.reset({ sexo: 'M' });
    this.form.get('cpf')?.enable();
  }

  aplicarErrosServidor(apiError: ApiError): void {
    if (apiError?.errors) {
      Object.entries(apiError.errors).forEach(([field, messages]) => {
        const control = this.form.get(field);
        if (control) {
          control.setErrors({ serverError: messages[0] });
        }
      });
    }
  }

  private buildPayload(): Pessoa {
    const v = this.form.getRawValue();
    return {
      nome: v.nome,
      data_nasc: v.data_nasc,
      cpf: v.cpf,
      sexo: v.sexo,
      altura: parseFloat(v.altura),
      peso: parseFloat(v.peso),
    };
  }
}
