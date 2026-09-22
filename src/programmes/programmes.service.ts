import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProgrammeEntity } from './programme.entity';

interface CreateProgrammeDto {
  nom?: string;
  titre?: string;
  description?: string;
  heureDebut?: string;
  heureFin?: string;
  horaire?: string;
  jours?: string | string[];
  jour?: string | string[];
  animateur?: string;
}

@Injectable()
export class ProgrammesService {
  constructor(
    @InjectRepository(ProgrammeEntity)
    private readonly programmeRepository: Repository<ProgrammeEntity>,
  ) {}

  async findAll() {
    const programmes = await this.programmeRepository.find();

    return programmes.map((p) => ({
      id: String(p.id),
      titre: p.titre,
      horaire: p.horaire || '00:00 - 00:00',
      animateur: p.animateur || 'Animateur inconnu',
      description: p.description || '',
      jours: p.jour ? [p.jour] : [],
      image_url: '',
    }));
  }

  async findOne(id: string): Promise<ProgrammeEntity | null> {
    return await this.programmeRepository.findOne({
      where: { id: +id },
    });
  }

  async create(data: CreateProgrammeDto): Promise<ProgrammeEntity> {
    const titreComplet = data.nom || data.titre || 'Émission';
    const descriptionComplete = data.description || '';

    let horaireComplet = data.horaire || '00:00 - 00:00';
    if (data.heureDebut && data.heureFin) {
      horaireComplet = `${data.heureDebut} - ${data.heureFin}`;
    }

    let jourSelectionne = '';
    if (data.jour) {
      jourSelectionne = Array.isArray(data.jour)
        ? data.jour.join(', ')
        : data.jour;
    } else if (data.jours) {
      jourSelectionne = Array.isArray(data.jours)
        ? data.jours.join(', ')
        : data.jours;
    }

    const payload = {
      titre: titreComplet,
      description: descriptionComplete,
      horaire: horaireComplet,
      jour: jourSelectionne,
      animateur: data.animateur || 'Animateur',
    };

    const nouveauProgramme = this.programmeRepository.create(payload);
    return this.programmeRepository.save(nouveauProgramme);
  }

  async remove(id: string): Promise<{ success: boolean }> {
    const programme = await this.programmeRepository.findOne({
      where: { id: +id },
    });

    if (!programme) {
      throw new NotFoundException(`Le programme avec l'ID ${id} n'existe pas.`);
    }

    await this.programmeRepository.remove(programme);
    return { success: true };
  }
}
