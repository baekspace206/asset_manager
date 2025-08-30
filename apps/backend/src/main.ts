import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS 설정
//  app.enableCors({
//    origin: [
//      'http://localhost:3001',          // 로컬 개발
//      'http://127.0.0.1:3001',
//      'http://192.168.200.100:3001',    // Pi IP + 프론트 포트
//    ],
//    credentials: true,
//    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
//    allowedHeaders: ['Content-Type', 'Authorization'],
//  });

  // 외부 접근을 위해 0.0.0.0 리스닝
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
