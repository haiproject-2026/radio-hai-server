/* eslint-disable */
import { Controller, Get, Post, Delete, Param, Body, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { ActualitesGateway } from './actualites.gateway';
import { ActualitesService } from './actualites.service'; // 💡 AJOUT : Importation du service

// Définition de l'interface
interface Article {
  id: string;
  titre: string;
  categorie: string;
  texte: string;
  imageUrl: string | null;
  videoUrl: string | null;
  audioUrl: string | null;
}

@Controller('articles-multimedia') 
export class ActualitesController {
  // Chemins absolus sécurisés
  private uploadPath = join(process.cwd(), 'uploads');
  private filePath = join(this.uploadPath, 'articles.json');
  private articles: Article[] = [];

  // 💡 MODIFICATION : Injection conjointe de la Gateway et du Service d'actualités mondiales
  constructor(
    private readonly actualitesGateway: ActualitesGateway,
    private readonly actualitesService: ActualitesService
  ) {
    this.chargerArticles();
  }

  private chargerArticles() {
    try {
      if (!existsSync(this.uploadPath)) {
        mkdirSync(this.uploadPath, { recursive: true });
      }
      
      if (existsSync(this.filePath)) {
        const fileContent = readFileSync(this.filePath, 'utf-8');
        this.articles = JSON.parse(fileContent || '[]');
      } else {
        this.articles = [];
        this.sauvegarderArticles();
      }
    } catch (error) {
      console.error("Erreur lors du chargement du fichier JSON :", error);
      this.articles = [];
    }
  }

  private sauvegarderArticles() {
    try {
      writeFileSync(this.filePath, JSON.stringify(this.articles, null, 2), 'utf-8');
    } catch (error) {
      console.error("Erreur lors de l'écriture du fichier JSON :", error);
    }
  }

  @Get()
  findAll() {
    return this.articles;
  }

  // 🚀 NOUVELLE ROUTE : Expose le point d'accès pour les actualités internationales du monde entier
  @Get('monde')
  async getArticlesMondiaux() {
    return this.actualitesService.getActualitesMondiales();
  }

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'photo', maxCount: 1 },
      { name: 'video', maxCount: 1 },
      { name: 'audio', maxCount: 1 },
    ], {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const dest = join(process.cwd(), 'uploads');
          if (!existsSync(dest)) {
            mkdirSync(dest, { recursive: true });
          }
          cb(null, dest);
        },
        filename: (req, file, cb) => {
          const nomUnique = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${file.fieldname}-${nomUnique}${extname(file.originalname)}`);
        }
      })
    }),
  )
  create(
    @Body() body: any,
    @UploadedFiles() files: { photo?: Express.Multer.File[], video?: Express.Multer.File[], audio?: Express.Multer.File[] }
  ) {
    const photoFile = files?.photo?.[0] || null;
    const videoFile = files?.video?.[0] || null;
    const audioFile = files?.audio?.[0] || null;

    const nouvelArticle: Article = {
      id: Date.now().toString(),
      titre: body.titre ? body.titre.toUpperCase() : 'SANS TITRE',
      categorie: body.categorie || 'general',
      texte: body.corpsArticle || '',
      imageUrl: photoFile ? photoFile.filename : null,
      videoUrl: videoFile ? videoFile.filename : null,
      audioUrl: audioFile ? audioFile.filename : null,
    };

    this.articles.unshift(nouvelArticle);
    this.sauvegarderArticles();

    if (this.actualitesGateway) {
      this.actualitesGateway.diffuserNouvelArticle(nouvelArticle);
    }

    return nouvelArticle;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.articles = this.articles.filter((a: Article) => a.id !== id);
    this.sauvegarderArticles();

    if (this.actualitesGateway) {
      this.actualitesGateway.diffuserSuppressionArticle(id);
    }

    return { success: true };
  }
}
