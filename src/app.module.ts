import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RadioModule } from './radio/radio.module';
import { AnimateursModule } from './animateurs/animateurs.module';
import { ProgrammesModule } from './programmes/programmes.module';
import { ActualitesModule } from './actualites/actualites.module';
import { PodcastsModule } from './podcasts/podcasts.module';
import { ContactModule } from './contact/contact.module';

// Contrôleurs
import { AuthController } from './auth/auth.controller';
import { AntenneController } from './radio/antenne.controller';
import { UploadsController } from './uploads.controller';

// Services
import { RadioService } from './radio/radio.service';
import { MinioService } from './minio.service';

// Entités
import { AnimateurEntity } from './animateurs/entities/animateur.entity';

@Module({
  imports: [
    // ==============================
    // CONFIGURATION .ENV
    // ==============================
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // ==============================
    // POSTGRESQL + TYPEORM
    // ==============================
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: Number(configService.get<string>('DB_PORT')),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [AnimateurEntity],
        autoLoadEntities: true,
        synchronize: true,
        retryAttempts: 5,
        retryDelay: 3000,
      }),
    }),

    // ==============================
    // MODULES
    // ==============================
    ProgrammesModule,
    RadioModule,
    AnimateursModule,
    ActualitesModule,
    PodcastsModule,
    ContactModule,
  ],
  controllers: [AuthController, AntenneController, UploadsController],
  providers: [RadioService, MinioService],
})
export class AppModule {}
