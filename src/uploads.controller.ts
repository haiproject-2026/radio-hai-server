import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MinioService } from './minio.service';

interface UploadResponse {
  success: boolean;
  url: string;
  message: string;
}

@Controller('uploads')
export class UploadsController {
  constructor(private readonly minioService: MinioService) {}

  @Post('media/:folder')
  @UseInterceptors(FileInterceptor('file'))
  async uploadMedia(
    @Param('folder') folder: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UploadResponse> {
    if (folder !== 'client' && folder !== 'admin' && folder !== 'backend') {
      throw new BadRequestException(
        'Le dossier de destination specifie est invalide. Choisissez entre client, admin ou backend.',
      );
    }

    if (!file) {
      throw new BadRequestException("Aucun fichier multimedia n'a été fourni.");
    }

    const fileUrl = await this.minioService.uploadFile(folder, file);

    return {
      success: true,
      url: fileUrl,
      message: `Fichier traite et stocke avec succes dans le bucket associe a la destination : ${folder}.`,
    };
  }
}
