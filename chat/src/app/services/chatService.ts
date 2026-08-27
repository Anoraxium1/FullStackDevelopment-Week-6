import { Service } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Service()
export class Chat {
  private readonly socket: Socket = io('http://localhost:3000');
  private readonly messageReceived = new Subject<string>();

  readonly messages$: Observable<string> = this.messageReceived.asObservable();

  constructor() {
    this.socket.on('chat message', (message: string) => {
      this.messageReceived.next(message);
    });
  }

  sendMessage(message: string): void {
    this.socket.emit('chat message', message);
  }
}
