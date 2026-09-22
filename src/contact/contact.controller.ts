/* eslint-disable */
import { Controller, Get, Post, Delete, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Controller()
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  // Coordonnées stockées en mémoire
  private coordonnees = {
    telephone: '+261 34 00 000 00',
    adresse: 'Studio Radio Hai, Avenue de l’Antenne'
  };

  @Get('station-coordonnees')
  getCoordonnees() {
    return this.coordonnees;
  }

  @Post('station-coordonnees')
  updateCoordonnees(@Body() body: any) {
    this.coordonnees.telephone = body.telephone || this.coordonnees.telephone;
    this.coordonnees.adresse = body.adresse || this.coordonnees.adresse;
    return this.coordonnees;
  }

  // ⚠️ Correction : Route qui causait l'erreur 500
  @Get('messages-auditeurs')
  async getMessages() {
    try {
      return await this.contactService.findAll();
    } catch (error) {
      console.error("Erreur lors de la récupération des messages:", error);
      return []; // Retourne un tableau vide au lieu de faire crasher le serveur (évite l'erreur 500)
    }
  }

  @Post('messages-auditeurs')
  @HttpCode(HttpStatus.CREATED)
  async createMessage(@Body() createContactDto: CreateContactDto) {
    return await this.contactService.create(createContactDto);
  }

  @Delete('messages-auditeurs/:id')
  async deleteMessage(@Param('id') id: string) {
    await this.contactService.remove(id);
    return { success: true };
  }
}
