import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { DocumentService } from './document.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { ReturnDocumentDto } from './dto/return-document.dto';
import { UpdatePendingDto } from './dto/update-document.dto';

@ApiTags('document')
@Controller('document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @ApiOkResponse({
    description: '문서 생성이 완료되었습니다.',
  })
  @ApiOperation({ summary: '문서 생성' })
  @Post()
  async createDocument(@Body() createDocumentDto: CreateDocumentDto) {
    return await this.documentService.create(createDocumentDto);
  }

  @ApiOkResponse({
    description: 'outbox, inbox, archive 순으로 데이터 전달',
  })
  @ApiOperation({ summary: '모든 문서 확인' })
  @Get()
  async findAll(@Query('id') userId: number) {
    return await this.documentService.findAll(userId);
  }

  @ApiOkResponse({
    description: '선택된 문서',
    type: ReturnDocumentDto,
  })
  @ApiOperation({ summary: '선택된 문서 보기' })
  @Get('select')
  async findOne(@Query('id') documentId: number) {
    return this.documentService.selectDocument(documentId);
  }

  @ApiOkResponse({
    description: '결제가 완료 되었습니다.',
  })
  @ApiOperation({ summary: '문서 결제' })
  @Patch()
  update(@Body() updateDocumentDto: UpdatePendingDto) {
    return this.documentService.update(updateDocumentDto);
  }
}
