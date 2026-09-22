import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

// En mettant '*' et en supprimant credentials, on débloque complètement l'accès local
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ContactGateway implements OnGatewayConnection {
  @WebSocketServer()
  server!: Server;

  handleConnection(client: Socket) {
    console.log(`🔌 Admin connecté au tunnel Temps Réel : ${client.id}`);
  }

  emettreNouveauMessage(nouveauMessage: any) {
    if (this.server) {
      this.server.emit('nouveau_message_admin', nouveauMessage);
    }
  }
}
