import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})
export class CalculatorComponent {
  inputValue: string = '';
  result: number | string = '';

  appendValue(value: string) {
    this.inputValue += value;
  }

  calculate() {
    try {
      this.result = eval(this.inputValue); // Use eval() cautiously in real applications
    } catch (e) {
      this.result = 'Error';
    }
  }

  clear() {
    this.inputValue = '';
    this.result = '';
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    const allowedKeys = '0123456789/*-+.';
    if (allowedKeys.includes(event.key)) {
      this.appendValue(event.key);
    } else if (event.key === 'Enter') {
      this.calculate();
    } else if (event.key === 'Backspace') {
      this.inputValue = this.inputValue.slice(0, -1);
    }
  }
}
