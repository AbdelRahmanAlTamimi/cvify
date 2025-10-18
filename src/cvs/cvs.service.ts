import { Injectable } from '@nestjs/common';
import { GroqService } from '../groq/groq.service';
import { PrismaService } from '../prisma/prisma.service';
import { GenerateCvDto } from './dto/generate-cv.dto';
import { PdfGenerator } from './pdf-generator';

@Injectable()
export class CvsService {
  constructor(
    private readonly groq: GroqService,
    private readonly prisma: PrismaService,
  ) {}

  async generate(generateCvDto: GenerateCvDto): Promise<Buffer | null> {
    // Fetch user data
    const user = await this.prisma.users.findUnique({
      where: { id: generateCvDto.userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Get optimized CV data from Groq
    const cvJsonString = await this.groq.getCvAsJson(
      generateCvDto.jobDescription,
      JSON.stringify(user),
    );

    if (!cvJsonString) {
      throw new Error('Failed to generate CV data');
    }

    // Clean the response - remove markdown code blocks if present
    let cleanedJson = cvJsonString.trim();

    // Remove ```json and ``` markers if present
    if (cleanedJson.startsWith('```json')) {
      cleanedJson = cleanedJson
        .replace(/^```json\s*/, '')
        .replace(/\s*```$/, '');
    } else if (cleanedJson.startsWith('```')) {
      cleanedJson = cleanedJson.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    // Parse the CV data
    const cvData = JSON.parse(cleanedJson.trim());

    // Generate PDF
    return PdfGenerator.generatePdf(cvData);
  }

  findAll() {
    return `This action returns all cvs`;
  }
}
