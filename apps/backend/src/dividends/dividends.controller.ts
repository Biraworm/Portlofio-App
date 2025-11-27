import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { DividendsService } from './dividends.service';
import { CreateDividendDto } from './dto/create-dividend.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';

@Controller('dividends')
@UseGuards(JwtAuthGuard)
export class DividendsController {
  constructor(private readonly dividendsService: DividendsService) {}

  @Post()
  create(@CurrentUser() user: any, @Body() createDividendDto: CreateDividendDto) {
    return this.dividendsService.create(user.userId, createDividendDto);
  }

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.dividendsService.findAll(user.userId);
  }

  @Get(':id')
  findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.dividendsService.findOne(user.userId, id);
  }
}


