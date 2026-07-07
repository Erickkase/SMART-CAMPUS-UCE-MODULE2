import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CreateNotificationDto } from '../../application/dtos/create-notification.dto';
import { UpdateNotificationDto } from '../../application/dtos/update-notification.dto';
import { UpdateNotificationStatusDto } from '../../application/dtos/update-notification-status.dto';
import { NotificationService } from '../../application/services/notification.service';
import { Notification } from '../../domain/entities/notification.entity';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create notification' })
  @ApiBody({ type: CreateNotificationDto })
  @ApiCreatedResponse({ description: 'Notification created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid request payload' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  createNotification(@Body() createNotificationDto: CreateNotificationDto): Promise<Notification> {
    return this.notificationService.createNotification(createNotificationDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List notifications' })
  @ApiOkResponse({ description: 'Notification list returned successfully' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  getNotifications(): Promise<Notification[]> {
    return this.notificationService.getNotifications();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get notification by id' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ description: 'Notification returned successfully' })
  @ApiBadRequestResponse({ description: 'Invalid notification id' })
  @ApiNotFoundResponse({ description: 'Notification not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  getNotificationById(@Param('id', new ParseUUIDPipe()) id: string): Promise<Notification> {
    return this.notificationService.getNotificationById(id);
  }

  @Get('recipient/:recipientId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List notifications by recipient id' })
  @ApiParam({ name: 'recipientId', format: 'uuid' })
  @ApiOkResponse({ description: 'Notifications returned successfully' })
  @ApiBadRequestResponse({ description: 'Invalid recipient id' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  getNotificationsByRecipientId(
    @Param('recipientId', new ParseUUIDPipe()) recipientId: string,
  ): Promise<Notification[]> {
    return this.notificationService.getNotificationsByRecipientId(recipientId);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update notification' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiBody({ type: UpdateNotificationDto })
  @ApiOkResponse({ description: 'Notification updated successfully' })
  @ApiBadRequestResponse({ description: 'Invalid request payload or id' })
  @ApiNotFoundResponse({ description: 'Notification not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  updateNotification(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ): Promise<Notification> {
    return this.notificationService.updateNotification(id, updateNotificationDto);
  }

  @Patch(':id/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update notification status' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiBody({ type: UpdateNotificationStatusDto })
  @ApiOkResponse({ description: 'Notification status updated successfully' })
  @ApiBadRequestResponse({ description: 'Invalid request payload or id' })
  @ApiNotFoundResponse({ description: 'Notification not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  updateNotificationStatus(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateNotificationStatusDto: UpdateNotificationStatusDto,
  ): Promise<Notification> {
    return this.notificationService.updateNotificationStatus(
      id,
      updateNotificationStatusDto.status,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete notification' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiNoContentResponse({ description: 'Notification deleted successfully' })
  @ApiBadRequestResponse({ description: 'Invalid notification id' })
  @ApiNotFoundResponse({ description: 'Notification not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async deleteNotification(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    await this.notificationService.deleteNotification(id);
  }
}
