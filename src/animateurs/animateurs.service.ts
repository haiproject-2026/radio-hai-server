import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AnimateurEntity } from "./entities/animateur.entity";

@Injectable()
export class AnimateursService {
  constructor(
    @InjectRepository(AnimateurEntity)
    private readonly animateurRepository: Repository<AnimateurEntity>,
  ) {}

  async findAll(): Promise<AnimateurEntity[]> {
    return this.animateurRepository.find();
  }

  async create(data: {
    nom: string;
    specialite: string;
    photoUrl: string;
  }): Promise<AnimateurEntity> {
    const nouvelAnimateur = this.animateurRepository.create(data);
    return this.animateurRepository.save(nouvelAnimateur);
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const animateur = await this.animateurRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!animateur) {
      throw new NotFoundException("Animateur introuvable.");
    }
    await this.animateurRepository.remove(animateur);
    return { deleted: true };
  }
}
