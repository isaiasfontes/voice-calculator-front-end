import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoiceCalculatorComponent } from './voice-calculator.component';

describe('VoiceCalculatorComponent', () => {
  let component: VoiceCalculatorComponent;
  let fixture: ComponentFixture<VoiceCalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoiceCalculatorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoiceCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


