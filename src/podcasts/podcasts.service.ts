import { Injectable } from "@nestjs/common";
import { CreatePodcastDto } from "./dto/create-podcast.dto";
import { UpdatePodcastDto } from "./dto/update-podcast.dto";

@Injectable()
export class PodcastsService {
  create(createPodcastDto: CreatePodcastDto) {
    return "This action adds a new podcast";
  }

  findAll() {
    return `This action returns all podcasts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} podcast`;
  }

  update(id: number, updatePodcastDto: UpdatePodcastDto) {
    return `This action updates a #${id} podcast`;
  }

  remove(id: number) {
    return `This action removes a #${id} podcast`;
  }
}
