import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisClientType, createClient } from 'redis';
import { Scholarship } from '../../domain/entities/scholarship.entity';

const SCHOLARSHIP_LIST_CACHE_KEY = 'scholarships:list';
const SCHOLARSHIP_LIST_CACHE_TTL_SECONDS = 60;

@Injectable()
export class ScholarshipCacheService implements OnModuleDestroy {
  private readonly logger = new Logger(ScholarshipCacheService.name);
  private readonly redisEnabled: boolean;
  private readonly client: RedisClientType | null;
  private connectionPromise: Promise<void> | null = null;

  constructor(private readonly configService: ConfigService) {
    this.redisEnabled = this.configService.get<boolean>('redis.enabled') ?? false;

    if (!this.redisEnabled) {
      this.client = null;
      return;
    }

    this.client = createClient({
      socket: {
        host: this.configService.get<string>('redis.host'),
        port: this.configService.get<number>('redis.port'),
      },
    });

    this.client.on('error', (error) => {
      this.logger.warn(`Redis cache error: ${error.message}`);
    });
  }

  async getScholarshipList(): Promise<Scholarship[] | null> {
    if (!this.client) {
      return null;
    }

    await this.ensureConnected();

    const cachedValue = await this.client.get(SCHOLARSHIP_LIST_CACHE_KEY);

    if (!cachedValue) {
      return null;
    }

    return JSON.parse(cachedValue) as Scholarship[];
  }

  async setScholarshipList(scholarships: Scholarship[]): Promise<void> {
    if (!this.client) {
      return;
    }

    await this.ensureConnected();
    await this.client.set(
      SCHOLARSHIP_LIST_CACHE_KEY,
      JSON.stringify(scholarships),
      {
        EX: SCHOLARSHIP_LIST_CACHE_TTL_SECONDS,
      },
    );
  }

  async invalidateScholarshipList(): Promise<void> {
    if (!this.client) {
      return;
    }

    await this.ensureConnected();
    await this.client.del(SCHOLARSHIP_LIST_CACHE_KEY);
  }

  async onModuleDestroy(): Promise<void> {
    if (!this.client || !this.client.isOpen) {
      return;
    }

    await this.client.quit();
  }

  private async ensureConnected(): Promise<void> {
    if (!this.client || this.client.isOpen) {
      return;
    }

    this.connectionPromise ??= this.client.connect().then(() => undefined);
    await this.connectionPromise;
  }
}
