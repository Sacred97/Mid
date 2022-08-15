import { Module } from '@nestjs/common';
import { PresentationController } from './presentation.controller';
import { PresentationService } from './presentation.service';

@Module({
  imports: [],
  exports: [PresentationService],
  controllers: [PresentationController],
  providers: [PresentationService]
})
export class PresentationModule {}
