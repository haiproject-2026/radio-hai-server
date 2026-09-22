/* eslint-disable */
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ActualitesGateway {
  @WebSocketServer()
  server!: Server;

  diffuserNouvelArticle(article: any) {
    if (this.server) {
      this.server.emit('articleCree', article);
    }
  }

  diffuserSuppressionArticle(id: string) {
    if (this.server) {
      this.server.emit('articleSupprime', id);
    }
  }
}
