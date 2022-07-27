import { Module } from '@nestjs/common';
import { AssetService } from './asset.service';
import { AssetController } from './asset.controller';
import { SharpModule } from 'nestjs-sharp'

@Module({
  imports: [SharpModule],
  providers: [AssetService],
  controllers: [AssetController]
})
export class AssetModule { }
