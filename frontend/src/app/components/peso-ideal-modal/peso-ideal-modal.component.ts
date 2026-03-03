import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PesoIdealResponse } from '../../models/pessoa.model';

@Component({
  selector: 'app-peso-ideal-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './peso-ideal-modal.component.html',
  styleUrls: ['./peso-ideal-modal.component.css'],
})
export class PesoIdealModalComponent {
  @Input() resultado: PesoIdealResponse | null = null;
  @Input() visivel = false;

  @Output() fechar = new EventEmitter<void>();

  onFechar(): void {
    this.fechar.emit();
  }

  onOverlayClick(): void {
    this.fechar.emit();
  }
}
