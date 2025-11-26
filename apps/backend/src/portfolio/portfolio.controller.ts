import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';

@Controller('portfolio')
@UseGuards(JwtAuthGuard)
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Get()
  getPortfolio(@CurrentUser() user: any) {
    return this.portfolioService.getPortfolio(user.userId);
  }

  @Get('compare')
  compareWithIndex(@CurrentUser() user: any, @Query('index') index?: string) {
    return this.portfolioService.compareWithIndex(user.userId, index || 'SPX');
  }
}

