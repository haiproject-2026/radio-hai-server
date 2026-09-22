/* eslint-disable */
import { Controller, Post, Body } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Post('login')
  login(@Body() body: any) {
    // Version bypass de sécurité : accepte toutes les connexions pour tester le panel
    return {
      success: true,
      token: 'fake-jwt-token-radio-hai-secure',
      user: { nom: 'Super Admin', role: 'DIRECTEUR' }
    };
  }
}
