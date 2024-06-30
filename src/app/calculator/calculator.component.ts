import { Component, HostListener } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})
export class CalculatorComponent {
  inputValue: string = '';
  result: string = '';

  private url = 'http://localhost:8000/process_equation';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  appendValue(value: string) {
    this.inputValue += value;
  }

  async calculate(): Promise<void> {
    const headers = new HttpHeaders({
      'Accept': 'application/json'
    });

    if (this.inputValue == '')
      return;

    const formData = new FormData();
    formData.append('equation', this.inputValue);

    try {
      const response = await this.http.post<{ result: string }>(this.url, formData, { headers }).toPromise();
      if(response){
        this.result = response.result;  // Update result with API response
        console.log(this.result);
        this.cdr.detectChanges();  // Manually trigger change detection
      }
    } catch (error) {
      console.error('Error calculating equation:', error);
      this.result = 'Error';  // Handle error case
      this.cdr.detectChanges();  // Manually trigger change detection
    }
  }

  clear() {
    this.inputValue = '';
    this.result = '';
  }

  @HostListener('window:keydown', ['$event'])
  async handleKeyboardEvent(event: KeyboardEvent) {
    const allowedKeys = '0123456789/*-+.';
    if (allowedKeys.includes(event.key)) {
      this.appendValue(event.key);
    } else if (event.key === 'Enter') {
      await this.calculate()
    } else if (event.key === 'Backspace') {
      this.inputValue = this.inputValue.slice(0, -1);
    }
  }
}
