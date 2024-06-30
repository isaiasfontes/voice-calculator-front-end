import { Component, OnInit, NgZone } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-voice-calculator',
  templateUrl: './voice-calculator.component.html',
  styleUrls: ['./voice-calculator.component.scss']
})
export class VoiceCalculatorComponent implements OnInit {
  public expression: string = '';
  public apiResponse: string = '';
  public isRecording: boolean = false;
  private mediaRecorder: any;
  private audioChunks: any[] = [];

  private chunks: any[] = [];
  private audioContext: AudioContext = new AudioContext({ sampleRate: 16000 });

  private url = 'http://localhost:8000/process_audio';

  constructor(private cdr: ChangeDetectorRef) { }


  ngOnInit(): void {
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
      this.isRecording = true;
      this.cdr.detectChanges();  // Manually trigger change detection

      this.mediaRecorder.ondataavailable = (event: any) => this.chunks.push(event.data);

      this.mediaRecorder.onstop = async () => {
        const audioData = await new Blob(this.chunks).arrayBuffer();
        const audioBuffer = await this.audioContext.decodeAudioData(audioData);
        const wavBlob = this.bufferToWave(audioBuffer, audioBuffer.length);
        this.chunks = [];

        // Download the audio file
        //this.downloadBlob(wavBlob, 'audio.wav');

        this.sendWavFile(wavBlob);

      };

    }
  }

  stopListening() {
    if (this.isRecording) {
      this.isRecording = false;
      this.cdr.detectChanges();  // Manually trigger change detection
      this.mediaRecorder.stop();
    }
  }

  private async sendWavFile(blob: Blob) {
    const formData = new FormData();
    formData.append('audio', blob, 'audio.wav');

    try {
      const response = await fetch(this.url, {
        method: 'POST',
        headers: {
          'accept': 'application/json'
        },
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        const resultado = result.result.split('\n\n') as string[];
        this.apiResponse = resultado[0];
        this.expression = resultado[1];
        this.cdr.detectChanges();  // Manually trigger change detection
        console.log('Success:', result);
      } else {
        console.error('Error:', response.statusText);
        this.apiResponse = 'Error';  // Handle error case
        this.expression = '';
        this.cdr.detectChanges();  // Manually trigger change detection
      }
    } catch (error) {
      console.error('Error:', error);
      this.apiResponse = 'Error';  // Handle error case
      this.expression = '';
      this.cdr.detectChanges();  // Manually trigger change detection
    }
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