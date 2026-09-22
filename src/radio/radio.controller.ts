import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { RadioService } from "./radio.service";
import { CreateRadioDto } from "./dto/create-radio.dto";
import { UpdateRadioDto } from "./dto/update-radio.dto";

@Controller("radio")
export class RadioController {
  constructor(private readonly radioService: RadioService) {}

  // PLACÉ TOUT EN HAUT : NestJS va lire cette route fixe en premier !
  @Get("stations")
  findAllStations() {
    return [];
  }

  @Post()
  create(@Body() createRadioDto: CreateRadioDto) {
    return this.radioService.create(createRadioDto);
  }

  @Get()
  findAll() {
    return this.radioService.findAll();
  }

  // PLACÉ APRÈS LES ROUTES FIXES : Évite d'intercepter le mot "stations"
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.radioService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateRadioDto: UpdateRadioDto) {
    return this.radioService.update(+id, updateRadioDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.radioService.remove(+id);
  }
}
