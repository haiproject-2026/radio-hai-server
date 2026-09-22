/* eslint-disable */
import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { RadioGateway } from './radio.gateway'; // 1. Importation de la Gateway

@Controller('grille-programmes')
export class GrilleController {
  // 2. Injection de la Gateway dans le constructeur pour pouvoir l'utiliser
  constructor(private readonly radioGateway: RadioGateway) {}

  private programmes = [
    {
      id: '1',
      nomEmission: 'LE GRAND REVEIL HAI',
      jour: 'LUNDI',
      heureDebut: '06:00',
      heureFin: '09:00',
      description: 'Matinale officielle de la station.',
    },
  ];

  @Get()
  getGrille() {
    return this.programmes;
  }

  @Post()
  ajouterProgramme(@Body() body: any) {
    const nouveau = {
      id: Date.now().toString(),
      nomEmission: body.nomEmission.toUpperCase(),
      jour: body.jour,
      heureDebut: body.heureDebut,
      heureFin: body.heureFin,
      description: body.description || '',
    };
    this.programmes.push(nouveau);

    // 3. ENVOI INSTANTANÉ : Le site se met à jour à la milliseconde près !
    this.radioGateway.envoyerMiseAJourGrille();

    return nouveau;
  }

  @Delete(':id')
  supprimerProgramme(@Param('id') id: string) {
    this.programmes = this.programmes.filter((p) => p.id !== id);

    // 4. MISE À JOUR INSTANTANÉE APRÈS SUPPRESSION
    this.radioGateway.envoyerMiseAJourGrille();

    return { success: true };
  }

  @Post('reset-urgence')
  resetUrgence() {
    this.programmes = [];

    // 5. MISE À JOUR INSTANTANÉE APRÈS RESET
    this.radioGateway.envoyerMiseAJourGrille();

    return { success: true };
  }
}
