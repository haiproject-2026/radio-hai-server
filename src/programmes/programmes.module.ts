/* eslint-disable */
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProgrammesService } from "./programmes.service";
import { ProgrammesController } from "./programmes.controller";
import { ProgrammeEntity } from "./programme.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ProgrammeEntity])],
  controllers: [ProgrammesController] as Array<new (...args: any[]) => any>,
  providers: [ProgrammesService],
  exports: [ProgrammesService],
})
export class ProgrammesModule {}
