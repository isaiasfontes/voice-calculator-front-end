import { Component, HostListener } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})
export class CalculatorComponent {
  inputValue: string = '';
  result: number | string = '';

  private url = 'http://localhost:8000/process_equation';


  appendValue(value: string) {
    this.inputValue += value;
  }
  constructor(private http: HttpClient) {}

  calculate() {
   
    const headers = new HttpHeaders({
      'Accept': 'application/json'
    });

    const formData = new FormData();
    formData.append('equation', this.inputValue);


    this.http.post<{ result: string }>(this.url, formData, { headers }).subscribe(
      (response: any) => {
        this.inputValue = '0';
        this.result = response.result;
      },
      (error : any) => {
        this.inputValue = '0';
        this.result = error.message;
        console.error(error);
      }
    );

    // this.evaluateExpression( this.inputValue.toString()).subscribe(
    //   (response: any) => {
    //     console.log('Expressão enviada com sucesso', response.message);
    //     this.result = response.result;  // Ajuste conforme a estrutura da resposta da API
    //   },
    //   (error : any )=> {
    //     console.error('Erro ao enviar Expressão', error);
    //     console.error('Erro: ', error);
    //     console.error('Status: ', error.status );
    //     console.error('Message Erro: ', error.message );
    //     console.error('Details Erro: ', error.error.detail );
    //     this.result = error.message;
    //   }
    // );

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
