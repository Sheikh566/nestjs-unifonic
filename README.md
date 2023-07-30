<p align="center">
  <a href="https://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

<p align="center">A <a href="https://www.unifonic.com/" target="_blank">Unifonic</a> API wrapper for Nest.js</p>

[![build status](https://img.shields.io/github/workflow/status/sheikh566/nestjs-unifonic/Github%20CI%20-%20Build%20Status%20and%20Test%20Coverage)](https://github.com/wellyshen/use-places-autocomplete/actions?query=workflow%3ACI)
[![npm version](https://img.shields.io/npm/v/nestjs-unifonic)](https://www.npmjs.com/package/nestjs-unifonic)
[![miniziped size](https://badgen.net/bundlephobia/minzip/nestjs-unifonic)](https://bundlephobia.com/result?p=nestjs-unifonic)
[![Downloads](https://badgen.net/bundlephobia/minzip/nestjs-unifonic)](https://img.shields.io/npm/dt/nestjs-twilio.svg?maxAge=3600)
[![MIT licensed](https://img.shields.io/github/license/sheikh566/nestjs-unifonic)](https://raw.githubusercontent.com/sheikh566/nestjs-unifonic/master/LICENSE)
![GitHub Repo stars](https://img.shields.io/github/stars/sheikh566/nestjs-unifonic)

Implementing the `UnifonicModule` from this package you gain access to Unifonic services through dependency injection with minimal setup.

<b>Note: Only SMS APIs are covered currently. Other Unifonic services are intended for future releases. Meanwhile, you're welcome to contribute for these.</b>

## Installation

```bash
$ npm install --save nestjs-unifonic
```

```bash
$ yarn add nestjs-unifonic
```

## Getting Started

To use Unifonic client we need to register module for example in app.module.ts

```typescript
import { UnifonicModule } from "nestjs-unifonic";

@Module({
  imports: [
    UnifonicModule.forRoot({
      appSid: process.env.UNIFONIC_APP_SID,
      senderId: process.env.UNIFONIC_SENDER_ID,
    }),
  ],
})
export class AppModule {}
```

If you are using the `@nestjs/config package` from nest, you can use the `ConfigModule` using the `forRootAsync()` function to inject your environment variables like this in your custom module:

```typescript
import { UnifonicModule } from "nestjs-unifonic";

@Module({
  imports: [
    UnifonicModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        appSid: configService.get("UNIFONIC_APP_SID"),
        senderId: configService.get("UNIFONIC_SENDER_ID"),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
```

Example usage in service.

```typescript
import { UnifonicService } from "nestjs-unifonic";

@Injectable()
export class AppService {
  public constructor(private readonly unifonicService: UnifonicService) {}

  async sendSMS() {
    return await this.unifonicService.SendMessage(phoneNumber, body);
  }
}
```

Following methods are available currently:

```typescript
/**
   * Send text message, if timeScheduled given than it will be a Scheduled message.
   * @param recipient Required - Destination mobile number, mobile numbers must be in international format without 00 or + Example: (4452023498)
   * @param body Required - Message body supports both English and unicodes characters, concatenated messages is supported
   * @param timeScheduled Optional - Schedule send messages, in the following format yyyy-mm-dd HH:mm:ss
   * @param correlationId Optional - Is a unique identifier value that is attached to requests and messages
   */
  SendMessage(
    recipient: string,
    body: string,
    timeScheduled?: string,
    correlationId?: string
  ): Promise<UnifonicSmsResponse>;
  /**
   * Cancel previously scheduled message. If messageId is given,
   * then only that scheduled message is canceled, otherwise all messages are
   * cancelled that have been scheduled previously.
   * @param messageId Optional - A unique ID that identifies a message
   */
  StopScheduledMessage(messageId?: string): Promise<UnifonicSmsResponse>;
  /**
   * Get details of previously scheduled messages.
   */
  GetScheduledMessages(): Promise<UnifonicSmsResponse>;
  /**
   * Get the status details of a previously sent messages. Optional parameters working as search filters could be specified.
   * @param messageId Optional - A unique ID that identifies a message
   * @param senderId Optional - The Sender ID to send from, App default SenderID is used unless else stated
   * @param recipient Optional - Destination mobile number, mobile numbers must be in international format without 00 or + Example: (4452023498)
   * @param dateFrom Optional - The start date for the report time interval, date format should be yyyy-mm-dd
   * @param dateTo Optional - The end date for the report time interval, date format should be yyyy-mm-dd
   * @param correlationId Optional - Is a unique identifier value that is attached to requests and messages
   */
  GetPreviousMessages(
    messageId?: string,
    senderId?: string,
    recipient?: string,
    dateFrom?: string,
    dateTo?: string,
    correlationId?: string
  ): Promise<UnifonicSmsResponse>;
```

## Author

- Sheikh Abdullah: [GitHub](https://github.com/sheikh566), [Twitter](https://twitter.com/Abdullah_Oye), [LinkedIn](https://linkedin.com/in/sheikhabdullah)

## License

MIT © sheikh566
