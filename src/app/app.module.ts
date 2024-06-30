import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { VoiceCalculatorComponent } from './voice-calculator/voice-calculator.component';
import { CalculatorComponent } from './calculator/calculator.component';

import { routing } from './app-routing.module'


import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { NbInputModule, NbThemeModule } from '@nebular/theme';


import { NbMenuModule , NbSidebarModule, NbLayoutModule, NbButtonModule } from '@nebular/theme';

import { HttpClientModule } from '@angular/common/http';

 
@NgModule({
  declarations: [
    AppComponent,
    VoiceCalculatorComponent,
    CalculatorComponent 
  ],
  imports: [
    routing,
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDividerModule,
    MatButtonModule, 
    MatIconModule,
    NbLayoutModule,
    NbSidebarModule.forRoot(), // NbSidebarModule.forRoot(), //if this is your app.module
    NbMenuModule.forRoot(),
    NbSidebarModule.forRoot(),
    NbButtonModule,
    NbThemeModule.forRoot({ name: 'default' }),
    NbInputModule,
    HttpClientModule 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

