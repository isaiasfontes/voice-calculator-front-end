import { Component, OnInit, NgZone } from '@angular/core';

@Component({
  selector: 'app-voice-calculator',
  templateUrl: './voice-calculator.component.html',
  styleUrls: ['./voice-calculator.component.scss']
})
export class VoiceCalculatorComponent implements OnInit {
  public result: string = '0';
  private recognition: any;

  constructor(private zone: NgZone) {}

  ngOnInit(): void {
    const { webkitSpeechRecognition }: IWindow = window as any;
    this.recognition = new webkitSpeechRecognition();
    this.recognition.lang = 'pt-BR'; // Definindo o idioma para português do Brasil
    this.recognition.continuous = false;
    this.recognition.interimResults = false;

    this.recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.trim();
      this.zone.run(() => {
        this.processVoiceCommand(transcript);
      });
    };

    this.recognition.onerror = (event: any) => {
      console.error('Erro no reconhecimento de voz', event);
    };
  }

  startListening() {
    this.recognition.start();
  }

  processVoiceCommand(command: string) {
    try {
      const sanitizedCommand = command.replace(/mais/g, '+')
                                      .replace(/menos/g, '-')
                                      .replace(/vezes/g, '*')
                                      .replace(/dividido por/g, '/');
      this.result = eval(sanitizedCommand);
    } catch (e) {
      this.result = 'Erro';
    }
  }
}

interface IWindow extends Window {
  webkitSpeechRecognition: any;
}


