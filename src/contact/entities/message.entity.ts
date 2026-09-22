import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity("messages")
export class MessageEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 150 })
  nom!: string;

  @Column({ type: "varchar", length: 150 })
  email!: string;

  @Column({ type: "varchar", length: 250 })
  sujet!: string;

  @Column({ type: "text" })
  texte!: string;

  @CreateDateColumn({ type: "timestamp" })
  created_at!: Date;
}
