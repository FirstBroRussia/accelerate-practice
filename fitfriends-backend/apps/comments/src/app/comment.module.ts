import { resolve } from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { commentsEnvValidateConfig } from '../assets/validate/comments-env-config.validate';
import { CommentsRepositoryModule } from './comments-repository/comments-repository.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: [
        resolve('./', 'apps', 'comments', 'env', 'development.env'),
      ],
      validate: commentsEnvValidateConfig,
    }),
    CommentsRepositoryModule,
  ],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
