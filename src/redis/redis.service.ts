import {Injectable, OnModuleDestroy, OnModuleInit} from '@nestjs/common';
import {Redis} from "ioredis";

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy{
    private redisClient: Redis;

    onModuleInit() {
        this.redisClient = new Redis({
            host: '44.214.50.62',
            password: "12345",// Замените на ваш хост Redis
            port: 6379,
            // и порт
            // Пароль, если есть
            // Другие параметры конфигурации
        });
    }

    onModuleDestroy() {
        if (this.redisClient) {
            this.redisClient.quit();
        }
    }

    // Пример операции: получение значения по ключу
    async get(key: string): Promise<string> {
        return await this.redisClient.get(key);
    }

    // Пример операции: установка значения
    async set(key: string, value: string, ttlInSeconds: number): Promise<void> {
        await this.redisClient.set(key, value, "EX", ttlInSeconds);
    }
}
