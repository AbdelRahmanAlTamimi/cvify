import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync } from 'node:fs';
import { unlink } from 'node:fs/promises';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfilesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProfileDto: CreateProfileDto) {
    const existingProfile = await this.prisma.profiles.findUnique({
      where: { profileName: createProfileDto.profileName },
    });
    if (existingProfile) {
      throw new BadRequestException('Profile with this name already exists');
    }

    return this.prisma.profiles.create({
      data: createProfileDto,
    });
  }

  findAll() {
    return this.prisma.profiles.findMany({
      select: {
        id: true,
        profileName: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.profiles.findUnique({
      where: { id },
    });
  }

  update(id: number, updateProfileDto: UpdateProfileDto) {
    return this.prisma.profiles.update({
      where: { id },
      data: updateProfileDto,
    });
  }

  async remove(id: number) {
    // select pdfPath and delete it from the filesystem if exists before deleting the profile
    const profile = await this.prisma.profiles.findUnique({
      where: { id },
      include: {
        cvs: {
          select: { pdfPath: true },
        },
      },
    });

    if (profile?.cvs && profile.cvs.length > 0) {
      // delete all pdf files from the filesystem
      for (const cv of profile.cvs) {
        if (cv.pdfPath && existsSync(cv.pdfPath)) {
          try {
            await unlink(cv.pdfPath);
          } catch (error) {
            console.error(`Failed to delete PDF file: ${cv.pdfPath}`, error);
          }
        }
      }
    }

    return this.prisma.profiles.delete({
      where: { id },
    });
  }
}
