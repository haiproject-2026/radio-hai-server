import { Controller, Get, Post, Body } from '@nestjs/common';

// Définition d'une interface claire pour éviter les erreurs d'affectation non sécurisées (any)
interface ModifAntenneBody {
  programmeActuel?: string;
  mediaEnCours?: string;
}

@Controller('antenne')
export class AntenneController {
  private antenneStatus = {
    programmeActuel: 'RADIO HAI INAUGURATION',
    mediaEnCours: 'Direct Studio.mp3',
    dureeMedia: '01:24',
  };

  @Get('status')
  getStatus() {
    return this.antenneStatus;
  }

  @Post('modifier')
  modifierStatus(@Body() body: ModifAntenneBody) {
    // Les affectations sont maintenant sécurisées grâce à l'interface
    this.antenneStatus.programmeActuel =
      body.programmeActuel || this.antenneStatus.programmeActuel;
    this.antenneStatus.mediaEnCours =
      body.mediaEnCours || this.antenneStatus.mediaEnCours;

    return this.antenneStatus;
  }
}
