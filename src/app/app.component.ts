import {ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NbMenuItem } from '@nebular/theme';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
   
})
export class AppComponent implements OnInit {
  title = 'voice-calculator-front-end';

  menuItems = [
    {
      title: 'Calculadora Virtual',
      icon: 'mic-outline',
      link: '/calculator', // Ajuste conforme sua rota
    },
    {
      title: 'Calculadora de Voz',
      icon: 'mic-outline',
      link: '/voice-calculator', // Ajuste conforme sua rota
    },
    // Adicione outros itens de menu conforme necessário

   
  ];
  
  constructor (
    private router: Router
  ){}
  ngOnInit() {
      
  }

  goToCalculator() {
    this.router.navigate(['/calculator']);
  }

  goToVoiceCalculator() {
    this.router.navigate(['/voice-calculator']);
  }

}
