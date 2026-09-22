import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  nom!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  sujet!: string;

  @IsString()
  @IsNotEmpty()
  texte!: string;
}
