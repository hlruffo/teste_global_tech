import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appCpfMask]',
  standalone: true,
})
export class CpfMaskDirective {
  constructor(private el: ElementRef, private control: NgControl) {}

  @HostListener('input')
  onInput(): void {
    const raw = this.el.nativeElement.value.replace(/\D/g, '').slice(0, 11);
    const masked = this.applyMask(raw);
    this.el.nativeElement.value = masked;
    this.control.control?.setValue(masked, { emitEvent: false });
  }

  private applyMask(value: string): string {
    if (value.length <= 3) return value;
    if (value.length <= 6) return `${value.slice(0, 3)}.${value.slice(3)}`;
    if (value.length <= 9) return `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6)}`;
    return `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6, 9)}-${value.slice(9)}`;
  }
}
