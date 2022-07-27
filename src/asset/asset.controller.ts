import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport'

@Controller('asset')
export class AssetController {

    @UseGuards(AuthGuard('jwt'))
    @Get('image')
    getImage() {
        return 'image'
    }
}
