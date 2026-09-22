import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
export class RadioGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  handleConnection(client: Socket) {
    console.log(`📻 Client connecté au Live : ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`🔌 Client déconnecté du Live : ${client.id}`);
  }

  envoyerMiseAJourGrille() {
    this.server.emit("grilleMiseAJour");
  }

  envoyerNouveauMessage() {
    this.server.emit("messageRecu");
  }
}
