import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  namespace: '/',
})
export class ActualitesGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  declare server: Server;

  handleConnection(client: Socket): void {
    console.log(`[Socket.io] Nouvel administrateur connecté : ${client.id}`);
  }

  handleDisconnect(client: Socket): void {
    console.log(`[Socket.io] Administrateur déconnecté : ${client.id}`);
  }

  emettreChangementContenu(
    action: 'CREATION' | 'SUPPRESSION',
    donnee?: unknown,
  ): void {
    if (this.server) {
      this.server.emit('actualites_change', { action, donnee });
    }
  }

  @SubscribeMessage('ping_serveur')
  handlePing(): string {
    return 'pong';
  }
}
