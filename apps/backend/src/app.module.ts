import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AssetsModule } from './assets/assets.module';
import { TransactionsModule } from './transactions/transactions.module';
import { DividendsModule } from './dividends/dividends.module';
import { PortfolioModule } from './portfolio/portfolio.module';
import { PricesModule } from './prices/prices.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    AssetsModule,
    TransactionsModule,
    DividendsModule,
    PortfolioModule,
    PricesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}

