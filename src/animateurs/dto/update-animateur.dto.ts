import { PartialType } from "@nestjs/mapped-types";
import { CreateAnimateurDto } from "./create-animateur.dto";

export class UpdateAnimateurDto extends PartialType(CreateAnimateurDto) {}
