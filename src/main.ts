import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from "fs";

async function bootstrap() {
  // const httpsOptions = {
  //   key: fs.readFileSync('./secrets/private-key.pem'),
  //   cert: fs.readFileSync('./secrets/public-certificate.pem')
  // };
  const PORT = process.env.PORT || 5000
  const app = await NestFactory.create(AppModule);
  await app.listen(PORT, () => console.log(`Server started on ${PORT}`));
}
bootstrap();
