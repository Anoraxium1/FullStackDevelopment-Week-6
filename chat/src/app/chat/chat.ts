import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Chat as ChatService } from '../services/chatService';

@Component({
  imports: [FormsModule],
  selector: 'app-chat',
  styleUrl: './chat.css',
  templateUrl: './chat.html',
})
export class Chat {
  private readonly chatService = inject(ChatService);

  protected readonly messageText = signal('');
  protected readonly messages = signal<string[]>([]);

  constructor() {
    this.chatService.messages$
      .pipe(takeUntilDestroyed())
      .subscribe((message) => {
        this.messages.update((current) => [...current, message]);
      });
  }

  sendMessage(): void {
    const message = this.messageText().trim();
    if (!message) {
      return;
    }

    this.chatService.sendMessage(message);
    this.messageText.set('');
  }
}
