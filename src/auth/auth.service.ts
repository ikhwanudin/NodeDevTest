import { AuthDto } from './dto/auth.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Body, ForbiddenException, Injectable } from '@nestjs/common';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable({})
export class AuthService {
    constructor(private prisma: PrismaService) { }

    async signup(dto: AuthDto) {
        try {
            const hashPassword = await argon.hash(dto.password)
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    password: hashPassword
                }
            })

            delete user.password

            return user;
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

        delete user.password

        return user
    }

}
