import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
   
})
export class AppComponent implements OnInit {
  title = 'voice-calculator-front-end';

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
