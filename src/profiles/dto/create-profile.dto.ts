import { IsEmail, IsString } from 'class-validator';
export class CreateProfileDto {
  @IsEmail()
  email: string;

  @IsString()
  profileName: string;
}
