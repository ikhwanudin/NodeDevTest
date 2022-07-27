import { PrismaService } from './../prisma/prisma.service';
import { ImageDto } from './dto/image.dto';
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { join, parse } from 'path'
import { SharpService } from 'nestjs-sharp'

@Injectable()
export class AssetService {
    constructor(private prisma: PrismaService, private sharp: SharpService) { }

    async getImage(path: string, res: any) {
        var filename = ''
        var defaultImageFilename = 'default-image.png'

        var parseSlug = this.base64DecodeSlug(path)
        path = parseSlug.toString('ascii')

        const imgPath = await this.prisma.image.findFirst({
            where: {
                path: path
            }
        })

        if (!imgPath) {
            filename = defaultImageFilename
        } else {
            filename = imgPath.path
        }


        var getFileFromStorage = this.publicStorage(filename)


        if (fs.existsSync(getFileFromStorage)) {
            return res.sendFile(getFileFromStorage)
        } else {
            getFileFromStorage = this.publicStorage(defaultImageFilename)
            return res.sendFile(getFileFromStorage)
        }
    }

    async getImages() {
        var images = await this.prisma.image.findMany()
        var preDataImages = images.map(image => ({
            id: image.id,
            //still hardcode url temp, bad practice
            path: 'http://localhost:3000/asset/image/' + this.base64EncodeSlug(image.path)
        }))
        return { data: preDataImages }
    }

    base64EncodeFile(file: string) {
        var bitmap = fs.readFileSync(join(__dirname, '../..', 'public/img/' + file));
        return Buffer.from(bitmap).toString('base64');
    }

    base64DecodeFile(base64str: string, newFile: string) {
        var bitmap = Buffer.from(base64str, 'base64');
        fs.writeFileSync(this.publicStorage(newFile), bitmap);
    }

    base64EncodeSlug(slug: string) {
        return Buffer.from(slug).toString('base64')
    }

    base64DecodeSlug(slug: string) {
        return Buffer.from(slug, 'base64')
    }

    publicStorage(imgPath: string) {
        return join(__dirname, '../..', 'public/img/' + imgPath)
    }
}
