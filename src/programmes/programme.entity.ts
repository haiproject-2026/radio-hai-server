import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity("programmes")
export class ProgrammeEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 255 })
  titre!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  horaire!: string;

  @Column({ type: "text", nullable: true })
  description!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  animateur!: string;

  @Column({ type: "varchar", length: 50, default: "LUNDI" })
  jour!: string;

  @CreateDateColumn()
  created_at!: Date;
}
