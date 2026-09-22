import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

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
