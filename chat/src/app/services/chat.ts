import { Service, signal } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Service()
export class Chat {
  private readonly socket: Socket = io('http://localhost:3000');

  private readonly _messages = signal<string[]>([]);
  readonly messages = this._messages.asReadonly();

  constructor() {
    this.socket.on('chat message', (message: string) => {
      this._messages.update((messages) => [...messages, message]);
    });
  }

  sendMessage(message: string): void {
    this.socket.emit('chat message', message);
  }
}
