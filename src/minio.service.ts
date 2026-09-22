import { Injectable, OnModuleInit, BadRequestException } from '@nestjs/common';
import * as Minio from 'minio';

interface PolicyStatement {
  Effect: string;
  Principal: string;
  Action: string[];
  Resource: string[];
}

interface BucketPolicy {
  Version: string;
  Statement: PolicyStatement[];
}

@Injectable()
export class MinioService implements OnModuleInit {
  private minioClient: Minio.Client;

  private readonly buckets: Record<'client' | 'admin' | 'backend', string> = {
    client: 'hai-client-assets',
    admin: 'hai-admin-assets',
    backend: 'hai-backend-media',
  };

  constructor() {
    // Récupération dynamique des variables d'environnement du fichier .env
    this.minioClient = new Minio.Client({
      endPoint: process.env.MINIO_ENDPOINT || 'localhost',
      port: Number(process.env.MINIO_PORT) || 9000,
      useSSL: false,
      accessKey: process.env.MINIO_ACCESS_KEY || 'admin_radio',
      secretKey: process.env.MINIO_SECRET_KEY || 'password_radio_123',
    });
  }

  async onModuleInit(): Promise<void> {
    for (const bucketName of Object.values(this.buckets)) {
      const bucketExists = await this.minioClient.bucketExists(bucketName);
      if (!bucketExists) {
        await this.minioClient.makeBucket(bucketName, 'us-east-1');

        // Rendre les fichiers accessibles en lecture publique via URL
        const policy: BucketPolicy = {
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Principal: '*',
              Action: ['s3:GetObject'],
              Resource: [`arn:aws:s3:::${bucketName}/*`],
            },
          ],
        };
        await this.minioClient.setBucketPolicy(
          bucketName,
          JSON.stringify(policy),
        );
      }
    }
  }

  async uploadFile(
    folder: 'client' | 'admin' | 'backend',
    file: Express.Multer.File,
  ): Promise<string> {
    const bucketName = this.buckets[folder];
    if (!bucketName) {
      throw new BadRequestException(
        "Le dossier de destination spécifié n'existe pas.",
      );
    }

    // Génère un nom unique en remplaçant les espaces par des tirets
    const fileName = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;

    await this.minioClient.putObject(
      bucketName,
      fileName,
      file.buffer,
      file.size,
      { 'Content-Type': file.mimetype },
    );

    const endpoint = process.env.MINIO_ENDPOINT || 'localhost';
    const port = process.env.MINIO_PORT || '9000';

    // Retourne l'URL complète pour accéder au média directement
    return `http://${endpoint}:${port}/${bucketName}/${fileName}`;
  }
}
