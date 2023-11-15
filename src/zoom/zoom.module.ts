import { Module } from '@nestjs/common';
import { ZoomController } from './zoom.controller';
import { ZoomService } from './zoom.service';

@Module({
  controllers: [ZoomController],
  providers: [ZoomService]
})
export class ZoomModule {}
