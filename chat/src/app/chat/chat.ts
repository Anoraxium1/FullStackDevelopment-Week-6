import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Chat as ChatService } from '../services/chat';

@Component({
  imports: [FormsModule],
  selector: 'app-chat',
  styleUrl: './chat.css',
  templateUrl: './chat.html',
})
export class Chat {
  private readonly chatService = inject(ChatService);

  protected readonly messageText = signal('');
  protected readonly messages = this.chatService.messages;

  sendMessage(): void {
    const message = this.messageText().trim();
    if (!message) {
      return;
    }

    this.chatService.sendMessage(message);
    this.messageText.set('');
  }
}
