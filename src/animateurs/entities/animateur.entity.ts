import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("animateurs")
export class AnimateurEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  nom!: string;

  @Column()
  specialite!: string;

  @Column({ nullable: true })
  photoUrl!: string;
}
