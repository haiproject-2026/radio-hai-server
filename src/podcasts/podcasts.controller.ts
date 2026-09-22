/* eslint-disable */
import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';

@Controller('podcasts')
export class PodcastsController {
  private podcasts = [
    {
      id: '1',
      titre: 'HAI CLUB CULTURE — EP 04',
      thematique: '🎧 DJ SET / LIVE MIX',
      duree: '60',
      audioUrl: 'https://soundhelix.com',
      ecoutes: 1240
    }
  ];

  @Get()
  findAll() {
    return this.podcasts;
  }

  // 🌟 AJOUT : Route dédiée au Top 5 pour alimenter la barre latérale et la section "À la une"
  @Get('top5')
  getTop5() {
    // Crée une copie du tableau, trie par le nombre d'écoutes (décroissant) et prend les 5 premiers
    return [...this.podcasts]
      .sort((a, b) => b.ecoutes - a.ecoutes)
      .slice(0, 5);
  }

  @Post()
  create(@Body() body: any) {
    const nouveauPodcast = {
      id: Date.now().toString(),
      titre: body.titre.toUpperCase(),
      thematique: body.thematique || 'PODCAST',
      duree: body.duree || '30',
      audioUrl: body.audioUrl,
      ecoutes: 0
    };
    this.podcasts.unshift(nouveauPodcast);
    return nouveauPodcast;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.podcasts = this.podcasts.filter(p => p.id !== id);
    return { success: true };
  }
}
