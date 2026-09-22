import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { PodcastsController } from "./podcasts.controller";

@Entity("podcasts")
export class PodcastEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  titre!: string;

  @Column({ default: "PODCAST" })
  thematique!: string;

  @Column({ default: "30" })
  duree!: string;

  @Column()
  audioUrl!: string;

  @Column({ default: 0 })
  ecoutes!: number;
}

@Module({
  imports: [TypeOrmModule.forFeature([PodcastEntity])],
  controllers: [PodcastsController],
})
export class PodcastsModule {}
