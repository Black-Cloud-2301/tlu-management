import { ForbiddenException, Injectable } from '@nestjs/common';
import { SigninDto, SignupDto } from './dto';
import { Tokens } from './types';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signup(dto: SignupDto): Promise<Tokens> {
    const hash = await this.hashData(dto.password);

    const generateId = await this.prisma.user.findMany({
      orderBy: {
        id: 'desc',
      },
      take: 1,
      select: {
        id: true,
      },
    });

    console.log(generateId);
    if (generateId.length === 0) generateId[0] = { id: 'A000000' };
    console.log(generateId);

    try {
      const newUser = await this.prisma.user.create({
        data: {
          id: 'A' + this.convertIdPlus(generateId[0].id),
          firstname: dto.firstname,
          lastname: dto.lastname,
          phoneNumber: dto.phoneNumber,
          address: dto.address,
          email: dto.email,
          hash,
        },
      });

      const tokens = await this.getTokens(newUser.id);
      await this.updateRtHash(newUser.id, tokens.refresh_token);
      return tokens;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        console.log(error);
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }

  async signin(dto: SigninDto): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: dto.id,
      },
    });

    if (!user) throw new ForbiddenException('Mã sinh viên không tồn tại');

    const PasswordMatches = await bcrypt.compare(dto.password, user.hash);

    if (!PasswordMatches)
      throw new ForbiddenException('Mã sinh viên hoặc mật khẩu không đúng');

    const tokens = await this.getTokens(user.id);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async logout(userId: string) {
    console.log(userId);
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        hashedRt: {
          not: null,
        },
      },
      data: {
        hashedRt: null,
      },
    });
  }

  async refreshTokens(userId: string, rt: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) throw new ForbiddenException('Access Denied');

    const rtMatches = await bcrypt.compare(rt, user.hashedRt);
    if (!rtMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  async getTokens(userId: string) {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
        },
        {
          secret: this.configService.get('AT_SECRET'),
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
        },
        {
          secret: this.configService.get('RT_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async updateRtHash(userId: string, rt: string) {
    const hash = await this.hashData(rt);
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hashedRt: hash,
      },
    });
  }

  convertIdPlus(userId: string) {
    const getNumber = parseInt(userId.substring(1)) + 1;
    let value = getNumber.toString();
    for (let i = getNumber.toString().length; i < 5; i++) {
      value = '0' + value;
    }
    console.log('getNumber: ', getNumber.toString().length);
    console.log(value);
    return value;
  }
}
