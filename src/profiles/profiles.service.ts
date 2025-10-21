import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfilesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createProfileDto: CreateProfileDto) {
    return this.prisma.profiles.create({
      data: createProfileDto,
    });
  }

  findAll() {
    return this.prisma.profiles.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} profile`;
  }

  update(id: number, updateProfileDto: UpdateProfileDto) {
    return this.prisma.profiles.update({
      where: { id },
      data: updateProfileDto,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} profile`;
  }
}
