import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { UpdateActualiteDto } from './dto/update-actualite.dto';

interface NewsApiArticle {
  title: string | null;
  description: string | null;
  content: string | null;
  publishedAt: string | null;
  urlToImage: string | null;
}

interface NewsApiResponse {
  articles?: NewsApiArticle[];
}

interface ArticleFormate {
  id: string;
  categorie: string;
  titre: string;
  description: string;
  date: string;
  imageUrl: string;
  videoUrl: null;
  audioUrl: null;
}

@Injectable()
export class ActualitesService {
  private readonly logger = new Logger(ActualitesService.name);
  private readonly apiKey = 'VOTRE_CLE_API_INTERNATIONALE';

  constructor(private readonly httpService: HttpService) {}

  create() {
    return 'This action adds a new actualite';
  }

  findAll() {
    return 'This action returns all actualites';
  }

  async getActualitesMondiales(): Promise<ArticleFormate[]> {
    try {
      const url = `https://newsapi.org{this.apiKey}`;

      const response = await firstValueFrom(
        this.httpService.get<NewsApiResponse>(url),
      );
      const articlesBruts = response.data?.articles || [];

      return articlesBruts
        .map((art: NewsApiArticle, index: number): ArticleFormate => ({
          id: `world-${index}-${Date.now()}`,
          categorie: 'MONDE',
          titre: art.title || 'Actualité Internationale',
          description:
            art.description ||
            art.content ||
            'Aucun résumé disponible pour ce flux.',
          date: art.publishedAt || new Date().toISOString(),
          imageUrl: art.urlToImage || 'https://unsplash.com',
          videoUrl: null,
          audioUrl: null,
        }))
        .slice(0, 10);
    } catch (error) {
      this.logger.error(
        "Échec du chargement du fil d'actualités mondiales",
        error,
      );
      return [];
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} actualite`;
  }

  update(id: number, updateActualiteDto: UpdateActualiteDto) {
    // 💡 Correction : Utilisation de JSON.stringify pour éviter l'alerte [object Object]
    return `This action updates a #${id} actualite ${JSON.stringify(updateActualiteDto)}`;
  }

  remove(id: number) {
    return `This action removes a #${id} actualite`;
  }
}
