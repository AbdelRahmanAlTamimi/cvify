import { Test, TestingModule } from '@nestjs/testing';
import { GroqService } from '../groq/groq.service';
import { PrismaService } from '../prisma/prisma.service';
import { CvsService } from './cvs.service';

describe('CvsService', () => {
  let service: CvsService;

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

    service = module.get<CvsService>(CvsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
