import { Component, OnInit, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-voice-calculator',
  templateUrl: './voice-calculator.component.html',
  styleUrls: ['./voice-calculator.component.scss']
})
export class VoiceCalculatorComponent implements OnInit {
  public expression: string = '';
  public transcription: string = '';
  public result: string = '0';
  public apiResponse: string = '';
  public isRecording: boolean = false;
  private recognition: any;
  private mediaRecorder: any;
  private audioChunks: any[] = [];

  private chunks: any[] = [];
  private audioContext: AudioContext = new AudioContext({ sampleRate: 16000 });
  
  private url = 'http://localhost:8000/process_audio';

  constructor(private zone: NgZone, private http: HttpClient) {}

  
  ngOnInit(): void {
    const { webkitSpeechRecognition }: IWindow = window as any;
    this.recognition = new webkitSpeechRecognition();
    this.recognition.lang = 'pt-BR'; // Definindo o idioma para português do Brasil
    this.recognition.continuous = false;
    this.recognition.interimResults = false;

    this.recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.trim();
      this.zone.run(() => {
      this.expression = transcript;
      this.processVoiceCommand(transcript);
      
      });
    };

    this.recognition.onerror = (event: any) => {
      console.error('Erro no reconhecimento de voz', event);
    };

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        this.mediaRecorder = new MediaRecorder(stream);
        this.mediaRecorder.ondataavailable = (event: any) => {
          this.audioChunks.push(event.data);
        };
        // this.mediaRecorder.onstop = async () => {
        //   // this.sendAudio();
        //   this.startListening();
        // };
      })
      .catch(error => console.error('Erro ao acessar microfone', error));
  }

 async startListening() {
    if (this.isRecording) {
      this.stopListening();
    } else {
      this.audioChunks = [];
      

      const audioConstraints = {
        audio: {
          autoGainControl: false,
          noiseSuppression: true,
          echoCancellation: false,
          channelCount: 1,
          sampleRate: 16000
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(audioConstraints);

      const mediaRecorderOptions = {
        mimeType: 'audio/webm',
        audioBitsPerSecond: 16000,
      };

      this.mediaRecorder = new MediaRecorder(stream, mediaRecorderOptions);
      this.mediaRecorder.start();
      this.recognition.start();
      this.isRecording = true;

      this.mediaRecorder = new MediaRecorder(stream, mediaRecorderOptions);
      this.mediaRecorder.start();
      this.isRecording = true;

      this.mediaRecorder.ondataavailable = (event: any) => this.chunks.push(event.data);

      this.mediaRecorder.onstop = async () => {
        const audioData = await new Blob(this.chunks).arrayBuffer();
        const audioBuffer = await this.audioContext.decodeAudioData(audioData);
        const wavBlob = this.bufferToWave(audioBuffer, audioBuffer.length);
        this.chunks = [];

        // Download the audio file
        //this.downloadBlob(wavBlob, 'audio.wav');
        this.sendAudioPost(wavBlob);

      };

    }
  }

   stopListening() {
    this.recognition.stop();
    this.mediaRecorder.stop();
    this.isRecording = false;
      
  }

  processVoiceCommand(command: string) {
    try {
      const sanitizedCommand = command.replace(/mais/g, '+')
                                      .replace(/menos/g, '-')
                                      .replace(/vezes/g, '*')
                                      .replace(/dividido por/g, '/');
      //this.result = eval(sanitizedCommand);
      

    } catch (e) {
      this.result = 'Erro:'  + console.error("Não foi possivel enviar o áudio", e);
    }
  }

  sendAudio() {
     
    const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
    const formData = new FormData();
    formData.append('audio', audioBlob, 'audio.wav');

    // Download the audio file
    //this.downloadBlob(audioBlob, 'audio.wav');

    this.http.post(this.url, audioBlob).subscribe(
      (response: any) => {
        console.log('Áudio enviado com sucesso', response);
        // this.apiResponse = response.message;  // Ajuste conforme a estrutura da resposta da API
      },
      error => {
        console.error('Erro ao enviar áudio', error);
        this.apiResponse = 'Erro ao enviar áudio';
      }
    );
  }

  private sendAudioPost(blob: Blob) {

   const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
    const formData = new FormData();
    

    formData.append('audio', audioBlob );


    this.http.post<{ result: string }>(this.url, formData ).subscribe(
      (response: any) => {
        console.log('Áudio enviado com sucesso', response);
        this.apiResponse =  response.message; // Ajuste conforme a estrutura da resposta da API
      },
      (error: any)  => {
        console.error('Erro: ', error);
        console.error('Status: ', error.status );
        console.error('Message Erro: ', error.message );
        console.error('Details Erro: ', error.error.detail );
        this.apiResponse =  error.message ; 
      }
    );

      }

  private downloadBlob(blob: Blob, filename: string) {
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

  }

  calculateResult(transcription: string) {
    console.log('transcription', transcription);
  }

  private bufferToWave(abuffer: any, len: number) {
    let numOfChan = abuffer.numberOfChannels,
      length = len * numOfChan * 2 + 44,
      buffer = new ArrayBuffer(length),
      view = new DataView(buffer),
      channels = [],
      i, sample,
      offset = 0,
      pos = 0;

    // write WAVE header
    setUint32(0x46464952);                         // "RIFF"
    setUint32(length - 8);                         // file length - 8
    setUint32(0x45564157);                         // "WAVE"

    setUint32(0x20746d66);                         // "fmt " chunk
    setUint32(16);                                 // length = 16
    setUint16(1);                                  // PCM (uncompressed)
    setUint16(numOfChan);
    setUint32(abuffer.sampleRate);
    setUint32(abuffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
    setUint16(numOfChan * 2);                      // block-align
    setUint16(16);                                 // 16-bit (hardcoded in this demo)

    setUint32(0x61746164);                         // "data" - chunk
    setUint32(length - pos - 8);                   // chunk length

    // write interleaved data
    for (i = 0; i < abuffer.numberOfChannels; i++)
      channels.push(abuffer.getChannelData(i));

    while (pos < length) {
      for (i = 0; i < numOfChan; i++) {             // interleave channels
        sample = Math.max(-1, Math.min(1, channels[i][offset])); // clamp
        sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0; // scale to 16-bit signed int
        view.setInt16(pos, sample, true);          // write 16-bit sample
        pos += 2;
      }
      offset++                                     // next source sample
    }

    // create Blob
    return new Blob([buffer], { type: "audio/wav" });

    function setUint16(data: any) {
      view.setUint16(pos, data, true);
      pos += 2;
    }

    function setUint32(data: any) {
      view.setUint32(pos, data, true);
      pos += 4;
    }
}
}
interface IWindow extends Window {
  webkitSpeechRecognition: any;
}
