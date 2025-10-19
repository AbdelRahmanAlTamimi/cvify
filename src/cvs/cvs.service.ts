import { Injectable } from '@nestjs/common';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { GroqService } from '../groq/groq.service';
import { PrismaService } from '../prisma/prisma.service';
import { GenerateCvDto } from './dto/generate-cv.dto';
import { PdfGenerator } from './pdf-generator';

@Injectable()
export class CvsService {
  private readonly uploadsDir = path.join(process.cwd(), 'uploads', 'cvs');

  constructor(
    private readonly groq: GroqService,
    private readonly prisma: PrismaService,
  ) {
    // Ensure uploads directory exists
    this.ensureUploadsDirExists();
  }

  private ensureUploadsDirExists() {
    if (!fs.existsSync(this.uploadsDir)) {
      fs.mkdirSync(this.uploadsDir, { recursive: true });
    }
  }

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
    const pdfBuffer = await PdfGenerator.generatePdf(cvData);

    // Save PDF to uploads directory
    const timestamp = Date.now();
    const filename = `cv_${generateCvDto.userId}_${timestamp}.pdf`;
    const filePath = path.join(this.uploadsDir, filename);
    const relativePath = path.join('uploads', 'cvs', filename);

    fs.writeFileSync(filePath, pdfBuffer);

    // Save CV record to database
    await this.prisma.cVs.create({
      data: {
        userId: generateCvDto.userId,
        jobDescription: generateCvDto.jobDescription,
        pdfPath: relativePath,
        cvData: cvData,
      },
    });

    return pdfBuffer;
  }

  findAll() {
    return this.prisma.cVs.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  findOne(id: number) {
    return this.prisma.cVs.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
      },
    });
  }

  findByUser(userId: number) {
    return this.prisma.cVs.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getPdfBuffer(id: number): Promise<Buffer | null> {
    const cv = await this.prisma.cVs.findUnique({
      where: { id },
    });

    if (!cv) {
      return null;
    }

    const fullPath = path.join(process.cwd(), cv.pdfPath);

    if (!fs.existsSync(fullPath)) {
      return null;
    }

    return fs.readFileSync(fullPath);
  }

  async remove(id: number) {
    const cv = await this.prisma.cVs.findUnique({
      where: { id },
    });

    if (!cv) {
      throw new Error('CV not found');
    }

    // Delete the PDF file
    const fullPath = path.join(process.cwd(), cv.pdfPath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }

    // Delete the database record
    return this.prisma.cVs.delete({
      where: { id },
    });
  }
}
