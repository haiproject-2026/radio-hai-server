import { Entity } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';
import { Column } from 'typeorm';
import { CreateDateColumn } from 'typeorm';

@Entity('contacts')
export class Contact {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  nom!: string;

  @Column()
  email!: string;

  @Column()
  sujet!: string;

  @Column({ type: 'text' })
  texte!: string;

  @CreateDateColumn()
  created_at!: Date;
}
