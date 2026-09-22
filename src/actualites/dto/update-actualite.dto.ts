import { PartialType } from "@nestjs/mapped-types";
import { CreateActualiteDto } from "./create-actualite.dto";

export class UpdateActualiteDto extends PartialType(CreateActualiteDto) {}
