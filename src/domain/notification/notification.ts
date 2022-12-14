import { NotificationContent } from './notification-content';
import { Entity } from '@core/domain/entity';
import { Guard, GuardFail, GuardSuccess } from '@core/logic/guard';
import { InvalidParamsError } from '../errors/invalid-params-error';

interface NotificationProps {
  recipientId: string;
  content: NotificationContent;
  category: string;
  readAt?: Date | null;
  cancelledAt?: Date | null;
  createdAt: Date;
}

export interface CreateNotificationProps {
  id?: string;
  recipientId: string;
  content: string;
  category: string;
  readAt?: Date | null;
  cancelledAt?: Date | null;
  createdAt?: Date;
}

export class Notification extends Entity<NotificationProps> {
  private constructor(props: NotificationProps, id?: string) {
    super(props, id);
  }

  public get recipientId(): string {
    return this._props.recipientId;
  }

  public get content(): NotificationContent {
    return this._props.content;
  }

  public get category(): string {
    return this._props.category;
  }

  public get createdAt(): Date {
    return this._props.createdAt;
  }

  public get readAt(): Date | null | undefined {
    return this._props.readAt;
  }

  public get cancelledAt(): Date | null | undefined {
    return this._props.cancelledAt;
  }

  public cancel(): void {
    this._props.cancelledAt = new Date();
  }

  public read(): void {
    this._props.readAt = new Date();
  }

  public unread(): void {
    this._props.readAt = null;
  }

  private static guard(props: CreateNotificationProps): GuardFail | GuardSuccess {
    const { category, recipientId, id } = props;

    const guardResults = [
      Guard.againstEmptyString(category, 'Notification Category'),
      Guard.againstEmptyString(recipientId, 'Recipient ID'),
      Guard.againstNonUUID(recipientId, 'Recipient ID'),
    ];

    if (id !== undefined) {
      guardResults.push(Guard.againstNonUUID(id, 'Notification ID'));
    }

    const combinedResult = Guard.combine(guardResults);

    return combinedResult;
  }

  public static create(props: CreateNotificationProps): Notification {
    const guardResult = Notification.guard(props);

    if (guardResult.isFailure()) {
      throw InvalidParamsError.create(guardResult.message);
    }

    const notificationContent = NotificationContent.create(props.content);
    const readAt = props.readAt !== undefined ? props.readAt : undefined;
    const cancelledAt = props.cancelledAt !== undefined ? props.cancelledAt : undefined;
    const createdAt = props.createdAt ?? new Date();

    return new Notification(
      {
        recipientId: props.recipientId,
        category: props.category,
        content: notificationContent,
        readAt,
        cancelledAt,
        createdAt,
      },
      props.id,
    );
  }
}
