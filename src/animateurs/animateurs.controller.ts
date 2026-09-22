import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";
import * as fs from "fs";
import { Request } from "express";
import { AnimateursService } from "./animateurs.service";

interface AnimateurBodyDto {
  nom?: string;
  name?: string;
  specialite?: string;
  role?: string;
}

interface MulterFileUploaded {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
}

type MulterCallback = (error: Error | null, destination: string) => void;

@Controller("animateurs")
export class AnimateursController {
  constructor(private readonly animateursService: AnimateursService) {}

  @Get()
  async findAll(): Promise<unknown> {
    try {
      return await Promise.resolve(this.animateursService.findAll());
    } catch (error: unknown) {
      console.error("Erreur de récupération des animateurs :", error);
      throw new BadRequestException("Impossible de charger les animateurs.");
    }
  }

  @Delete(":id")
  async remove(@Param("id") id: string): Promise<unknown> {
    try {
      return await Promise.resolve(this.animateursService.remove(id));
    } catch (error: unknown) {
      console.error("Erreur de suppression de l'animateur :", error);
      throw new BadRequestException("Impossible de supprimer cet animateur.");
    }
  }

  @Post()
  @UseInterceptors(
    FileInterceptor("photo", {
      /* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call */
      storage: diskStorage({
        destination: (
          req: Request,
          file: unknown,
          callback: MulterCallback,
        ) => {
          const uploadPath = "./uploads/animateurs";
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }
          callback(null, uploadPath);
        },
        filename: (req: Request, file: unknown, callback: MulterCallback) => {
          const multerFile = file as MulterFileUploaded;
          const uniqueSuffix =
            Date.now() + "-" + Math.round(Math.random() * 1e9);
          const ext = extname(multerFile.originalname);
          callback(null, `animateur-${uniqueSuffix}${ext}`);
        },
      }),
      /* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call */
    }),
  )
  async create(
    @Body() body: AnimateurBodyDto,
    @UploadedFile() file: MulterFileUploaded | undefined,
  ): Promise<unknown> {
    if (!file) {
      throw new BadRequestException("Fichier photo manquant ou invalide.");
    }

    const nomAnimateur = body.nom || body.name || "Animateur";
    const roleAnimateur = body.specialite || body.role || "Antenne";
    const photoUrl = `http://localhost:5000/uploads/animateurs/${file.filename}`;

    try {
      return await Promise.resolve(
        this.animateursService.create({
          nom: nomAnimateur,
          specialite: roleAnimateur,
          photoUrl: photoUrl,
        }),
      );
    } catch (error: unknown) {
      console.error("Détail du crash serveur NestJS :", error);
      throw new BadRequestException(
        "Erreur d'insertion dans la base de données PostgreSQL.",
      );
    }
  }
}
