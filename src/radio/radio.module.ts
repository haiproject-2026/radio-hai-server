import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RadioService } from "./radio.service";
import { RadioController } from "./radio.controller";
import { RadioGateway } from "./radio.gateway";
import { ProgrammeEntity } from "../programmes/programme.entity";
import { Contact } from "../contact/entities/contact.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ProgrammeEntity, Contact])],
  controllers: [RadioController],
  providers: [RadioService, RadioGateway],
  exports: [RadioGateway, TypeOrmModule],
})
export class RadioModule {}
