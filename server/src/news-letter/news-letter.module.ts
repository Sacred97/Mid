import { Module } from '@nestjs/common';
import { NewsLetterController } from './news-letter.controller';
import { NewsLetterService } from './news-letter.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {NewsLetter} from "./entity/news-letter.entity";

@Module({
  imports: [TypeOrmModule.forFeature([NewsLetter])],
  exports: [NewsLetterService],
  controllers: [NewsLetterController],
  providers: [NewsLetterService]
})
export class NewsLetterModule {}
