/* eslint-disable */
import { Module, Provider } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios"; // 💡 AJOUT : Requis pour passer des requêtes HTTP externes
import { ActualitesService } from "./actualites.service";
import { ActualitesController } from "./actualites.controller";
import { ActualitesGateway } from "./actualites.gateway";

const providersList: Provider[] = [ActualitesService, ActualitesGateway];

@Module({
  imports: [HttpModule], // 💡 AJOUT : Active le HttpService dans votre dossier d'actualités
  controllers: [ActualitesController],
  providers: providersList,
})
export class ActualitesModule {}
