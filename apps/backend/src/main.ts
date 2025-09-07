import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Body parser 크기 제한 설정 (이미지 업로드를 위해)
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));

  // CORS 설정
  app.enableCors({
    origin: [
      'http://localhost:3001',          // 로컬 개발
      'http://127.0.0.1:3001',
      'http://192.168.200.100:3001',    // Pi IP + 프론트 포트
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // 외부 접근을 위해 0.0.0.0 리스닝
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
