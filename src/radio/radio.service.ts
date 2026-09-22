/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from "@nestjs/common";
import { CreateRadioDto } from "./dto/create-radio.dto";
import { UpdateRadioDto } from "./dto/update-radio.dto";

@Injectable()
export class RadioService {
  create(createRadioDto: CreateRadioDto) {
    return "This action adds a new radio";
  }

  findAll() {
    return `This action returns all radio`;
  }

  findOne(id: number) {
    return `This action returns a #${id} radio`;
  }

  update(id: number, updateRadioDto: UpdateRadioDto) {
    return `This action updates a #${id} radio`;
  }

  remove(id: number) {
    return `This action removes a #${id} radio`;
  }
}
