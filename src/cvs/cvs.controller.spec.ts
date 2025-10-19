import { Test, TestingModule } from '@nestjs/testing';
import { GroqService } from '../groq/groq.service';
import { PrismaService } from '../prisma/prisma.service';
import { CvsController } from './cvs.controller';
import { CvsService } from './cvs.service';

describe('CvsController', () => {
  let controller: CvsController;

  const mockGroqService = {
    getCvAsJson: jest.fn(),
    chat: jest.fn(),
  };

  const mockPrismaService = {
    users: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    cVs: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CvsController],
      providers: [
        CvsService,
        {
          provide: GroqService,
          useValue: mockGroqService,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    controller = module.get<CvsController>(CvsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
