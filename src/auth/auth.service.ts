import { ConfigService } from '@nestjs/config';
import { AuthDto } from './dto/auth.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Body, ForbiddenException, Injectable } from '@nestjs/common';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt'

@Injectable({})
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
        private config: ConfigService
    ) { }

    async signup(dto: AuthDto) {
        try {
            const hashPassword = await argon.hash(dto.password)
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    password: hashPassword
                }
            })

            const token = await this.generateToken(user.id, user.email)
            return {
                email: user.email,
                access_token: token
            }

        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === "P2002") {
                    throw new ForbiddenException('User sudah ada')
                }
            }
        }
    }

    async signin(dto: AuthDto) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email
            }
        })

        if (!user) {
            throw new ForbiddenException('email atau password salah')
        }

        const isPasswordValid = await argon.verify(user.password, dto.password)

        if (!isPasswordValid) {
            throw new ForbiddenException('email atau password salah')
        }


        var token = await this.generateToken(user.id, user.email)

        return {
            email: user.email,
            access_token: token
        }
    }

    generateToken(userId: number, email: string) {
        const payload = {
            sub: userId,
            email
        }

        const secret = this.config.get('JWT_SECRET')

        return this.jwt.signAsync(payload, {
            expiresIn: '15m',
            secret: secret
        })

    }

}
