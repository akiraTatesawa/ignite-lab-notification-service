import { Module } from '@nestjs/common';
import { NotificationsController } from './controllers/notification.controller';
import { DatabaseModule } from '../data/prisma/database.module';
import { CancelNotification } from '@app/use-cases/cancel-notification/cancel-notification.use-case';
import { SendNotification } from '@app/use-cases/send-notification/send-notification.use-case';
import { CountRecipientNotifications } from '@app/use-cases/count-recipient-notifications/count-recipient-notification.use-case';
import { GetRecipientNotifications } from '@app/use-cases/get-recipient-notifications/get-recipient-notifications.use-case';

@Module({
  imports: [DatabaseModule],
  controllers: [NotificationsController],
  providers: [
    SendNotification,
    CancelNotification,
    CountRecipientNotifications,
    GetRecipientNotifications,
  ],
})
export class HTTPModule {}
