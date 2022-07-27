import { ImageDto } from './dto/image.dto';
import { Controller, Get, Param, Response, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport'
import { AssetService } from './asset.service';

@Controller('asset')
export class AssetController {

    constructor(private assetService: AssetService) { }

    @UseGuards(AuthGuard('jwt'))
    @Get('image/:path')
    async getImage(@Param() dto: ImageDto, @Response() res) {
        return await this.assetService.getImage(dto.path, res)
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('images')
    async getImages() {
        return await this.assetService.getImages()
    }
}
