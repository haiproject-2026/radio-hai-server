/* eslint-disable */
import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ProgrammesService } from './programmes.service';

function convertirEnString(valeur: unknown): string {
  return typeof valeur === 'string' ? valeur : '';
}

// 1. On remet la route principale d'origine pour que la récupération (GET) refonctionne
@Controller('emissions')
export class ProgrammesController {
  constructor(private readonly programmesService: ProgrammesService) {}

  @Get()
  async findAllProgrammes(): Promise<unknown> {
    const donneesBrutes = await this.programmesService.findAll();

    if (Array.isArray(donneesBrutes)) {
      return donneesBrutes.map((prog: Record<string, unknown>) => {
        const listeJours = Array.isArray(prog.jours) ? prog.jours : [];
        const premierJour =
          listeJours.length > 0 ? convertirEnString(listeJours[0]) : '';

        const descString = convertirEnString(prog.description);
        const titreString = convertirEnString(prog.titre);
        const horaireString = convertirEnString(prog.horaire);
        const animateurString = convertirEnString(prog.animateur);

        const estAncienneDonnee = titreString === 'Émission';

        const nomEmissionFinal = estAncienneDonnee
          ? descString || 'Émission sans titre'
          : titreString || 'Émission sans titre';

        const descriptionFinale = estAncienneDonnee
          ? 'Aucune description fournie.'
          : descString || 'Aucune description fournie.';

        let hDebut = '';
        let hFin = '';

        if (horaireString.includes('-')) {
          const parties: string[] = horaireString.split('-');
          const debutBrut = parties[0];
          const finBrut = parties[1];
          hDebut = debutBrut ? debutBrut.trim() : '';
          hFin = finBrut ? finBrut.trim() : '';
        }

        let idFinal = String(prog.id);

        return {
          id: idFinal,
          nomEmission: nomEmissionFinal,
          description: descriptionFinale,
          horaire: horaireString || 'Horaire non défini',
          heureDebut: hDebut,
          heureFin: hFin,
          jour: premierJour,
          jours: listeJours,
          animateur: animateurString,
        };
      });
    }
    return [];
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<unknown> {
    const prog = await this.programmesService.findOne(id);
    
    if (!prog) {
      throw new NotFoundException(`L'émission avec l'ID ${id} n'existe pas.`);
    }

    const jourString = convertirEnString(prog.jour);
    const listeJours = jourString ? [jourString] : [];

    const descString = convertirEnString(prog.description);
    const titreString = convertirEnString(prog.titre);
    const horaireString = convertirEnString(prog.horaire);
    const animateurString = convertirEnString(prog.animateur);

    const estAncienneDonnee = titreString === 'Émission';

    const nomEmissionFinal = estAncienneDonnee
      ? descString || 'Émission sans titre'
      : titreString || 'Émission sans titre';

    const descriptionFinale = estAncienneDonnee
      ? 'Aucune description fournie.'
      : descString || 'Aucune description fournie.';

    let hDebut = '';
    let hFin = '';

    if (horaireString.includes('-')) {
      const parties: string[] = horaireString.split('-');
      const debutBrut = parties[0];
      const finBrut = parties[1];
      hDebut = debutBrut ? debutBrut.trim() : '';
      hFin = finBrut ? finBrut.trim() : '';
    }

    return {
      id: String(prog.id),
      nomEmission: nomEmissionFinal,
      description: descriptionFinale,
      horaire: horaireString || 'Horaire non défini',
      heureDebut: hDebut,
      heureFin: hFin,
      jour: jourString,
      jours: listeJours,
      animateur: animateurString,
    };
  }

  // 2. IMPORTANT : On écoute sur '../grille-programmes' pour intercepter la route absolue du frontend !
  @Post('../grille-programmes')
  async create(@Body() body: Record<string, unknown>): Promise<unknown> {
    try {
      const hDebut = convertirEnString(body.heureDebut);
      const hFin = convertirEnString(body.heureFin);
      const nomEmissionInput = convertirEnString(body.nomEmission);
      const titreInput = convertirEnString(body.titre);
      const animateurInput = convertirEnString(body.animateur);
      const jourInput = convertirEnString(body.jour);
      const descriptionInput = convertirEnString(body.description);

      const horaireFormate =
        hDebut && hFin ? `${hDebut} - ${hFin}` : 'Horaire non défini';

      const nouveauCreneau = {
        titre: nomEmissionInput || titreInput || 'Émission sans titre',
        horaire: horaireFormate,
        animateur: animateurInput || '',
        description: descriptionInput,
        jours: jourInput ? [jourInput] : ['Lundi'],
        image_url: '',
      };

      if (
        !nouveauCreneau.titre ||
        nouveauCreneau.titre === 'Émission sans titre'
      ) {
        throw new BadRequestException("Le nom de l'émission est obligatoire.");
      }

      return await this.programmesService.create(nouveauCreneau);
    } catch (error: unknown) {
      console.error('Erreur lors de la création du créneau :', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        "Impossible d'enregistrer le créneau horaire.",
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<unknown> {
    try {
      return await this.programmesService.remove(id);
    } catch (error: unknown) {
      console.error('Erreur lors de la suppression backend :', error);
      throw new NotFoundException(`Impossible de supprimer l'élément avec l'ID ${id}.`);
    }
  }
}
