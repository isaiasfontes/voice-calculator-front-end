import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { CalculatorComponent } from './calculator/calculator.component';
import { VoiceCalculatorComponent } from './voice-calculator/voice-calculator.component';


const routes: Routes = [

  { path: '', redirectTo: '/calculator', pathMatch: 'full' },
  { path: 'calculator', component: CalculatorComponent },

  //{ path: '', redirectTo: '/voicecalculator', pathMatch: 'full' },
  { path: 'voice-calculator', component: VoiceCalculatorComponent },

];

export const routing = RouterModule.forRoot(routes)

@NgModule({
 
  imports: [RouterModule.forRoot(routes), FormsModule, ReactiveFormsModule ],
  exports: [RouterModule]

})
export class AppRoutingModule { }
