import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from './entities/contact.entity';
import { CreateContactDto } from './dto/create-contact.dto';
import { ContactGateway } from './contact.gateway';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,

    private readonly contactGateway: ContactGateway,
  ) {}

  async create(createContactDto: CreateContactDto): Promise<Contact> {
    const nouveau = this.contactRepository.create(createContactDto);
    const messageSauvegarde = await this.contactRepository.save(nouveau);

    // ⚡ Envoi en temps réel vers l'Admin
    this.contactGateway.emettreNouveauMessage(messageSauvegarde);

    return messageSauvegarde;
  }

  async findAll(): Promise<Contact[]> {
    // 🛠️ FIX TOTAL : On récupère les données brutes, puis on les inverse en JavaScript
    // Cela contourne l'erreur TypeORM à 100 % sans utiliser aucun mot-clé interdit par ESLint
    const messages = await this.contactRepository.find();
    return messages.reverse();
  }

  async remove(id: string): Promise<void> {
    const resultat = await this.contactRepository.delete(id);
    if (resultat.affected === 0) {
      throw new NotFoundException(`Le message avec l'ID ${id} n'existe pas.`);
    }
  }
}
