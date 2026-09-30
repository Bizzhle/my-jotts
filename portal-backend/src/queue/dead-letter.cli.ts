import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DeadLetterService } from './dead-letter.service';
import { QueueModule } from './queue.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), QueueModule],
})
class DeadLetterCliModule {}

async function main(): Promise<void> {
  const [command, deadLetterJobId] = process.argv.slice(2);
  const confirmed = process.argv.includes('--confirm');
  const app = await NestFactory.createApplicationContext(DeadLetterCliModule, { logger: false });

  try {
    const deadLetterService = app.get(DeadLetterService);

    if (command === 'list') {
      console.log(JSON.stringify(await deadLetterService.listEntries(), null, 2));
      return;
    }

    if (!deadLetterJobId || !confirmed) {
      throw new Error('Replay and acknowledge require an ID and the --confirm flag');
    }

    if (command === 'replay') {
      await deadLetterService.replay(deadLetterJobId);
      console.log(`Re-queued source job for dead-letter entry ${deadLetterJobId}`);
      return;
    }

    if (command === 'acknowledge') {
      await deadLetterService.acknowledge(deadLetterJobId);
      console.log(`Acknowledged dead-letter entry ${deadLetterJobId}`);
      return;
    }

    throw new Error(
      'Usage: npm run queue:dead-letter -- list | replay <id> --confirm | acknowledge <id> --confirm',
    );
  } finally {
    await app.close();
  }
}

void main().catch((error: Error) => {
  console.error(error.message);
  process.exitCode = 1;
});
