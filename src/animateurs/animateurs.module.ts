import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AnimateursController } from "./animateurs.controller"; // Assurez-vous que cette ligne pointe exactement ici
import { AnimateurEntity } from "./entities/animateur.entity";
import { AnimateursService } from "./animateurs.service";

@Module({
  imports: [TypeOrmModule.forFeature([AnimateurEntity])],
  controllers: [AnimateursController],
  providers: [AnimateursService],
  exports: [TypeOrmModule],
})
export class AnimateursModule {}
