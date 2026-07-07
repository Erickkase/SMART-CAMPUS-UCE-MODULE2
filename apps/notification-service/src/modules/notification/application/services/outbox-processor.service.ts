import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { OutboxEvent } from '../../domain/entities/outbox-event.entity';
import {
  OUTBOX_REPOSITORY,
  OutboxRepository,
} from '../../domain/repositories/outbox.repository';

@Injectable()
export class OutboxProcessorService implements OnModuleInit {
  private readonly logger = new Logger(OutboxProcessorService.name);
  private isProcessing = false;

  constructor(
    @Inject(OUTBOX_REPOSITORY)
    private readonly outboxRepository: OutboxRepository,
  ) {}

  onModuleInit(): void {
    const intervalMs = Number(process.env.OUTBOX_PROCESSOR_INTERVAL_MS ?? 5000);
    this.logger.log(`Outbox processor started with interval ${intervalMs}ms`);

    setInterval(() => {
      void this.processPendingEvents();
    }, intervalMs);
  }

  async processPendingEvents(batchSize = 10): Promise<void> {
    if (this.isProcessing) {
      return;
    }

    this.isProcessing = true;

    try {
      const pendingEvents = await this.outboxRepository.findPending(batchSize);

      for (const event of pendingEvents) {
        await this.publishEvent(event);
      }
    } finally {
      this.isProcessing = false;
    }
  }

  private async publishEvent(event: OutboxEvent): Promise<void> {
    try {
      this.logger.log(
        `Publishing outbox event: ${event.eventType} for aggregate ${event.aggregateType}:${event.aggregateId} | payload: ${JSON.stringify(event.payload)}`,
      );

      await this.outboxRepository.markAsProcessed(event.id);
      this.logger.log(`Outbox event ${event.id} marked as PROCESSED`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(
        `Failed to publish outbox event ${event.id}: ${errorMessage}`,
      );
      await this.outboxRepository.markAsFailed(event.id, errorMessage);
    }
  }
}
