/* eslint-disable */
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*', // Permet à tous les clients et admins de se connecter sans blocage CORS
  },
})
export class ActualitesGateway {
  @WebSocketServer()
  server: Server;

  // Envoie l'article à tous les clients connectés simultanément
  diffuserNouvelArticle(article: any) {
    if (this.server) {
      this.server.emit('articleCree', article);
    }
  }

  // Notifie tous les clients d'une suppression simultanément
  diffuserSuppressionArticle(id: string) {
    if (this.server) {
      this.server.emit('articleSupprime', id);
    }
  }
}
