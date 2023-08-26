import { Inject, Injectable } from '@nestjs/common';
import { OPTIONS_TYPE, MODULE_OPTIONS_TOKEN, UnifonicSmsResponse } from '../utils';
import axios from 'axios';

@Injectable()
export class UnifonicService {
  private readonly APP_SID: string;
  private readonly SENDER_ID: string;

  constructor(
    @Inject(MODULE_OPTIONS_TOKEN)
    private opt: typeof OPTIONS_TYPE,
  ) {
    this.APP_SID = opt.appSid;
    this.SENDER_ID = opt.senderId;
  }

  private createQueryParams(obj: any): string {
    const params: string[] = [];
    for (const key of Object.keys(obj)) {
      params.push(key + '=' + obj[key]);
    }
    return '?' + params.join('&');
  }

  /**
   * Send text message, if timeScheduled given than it will be a Scheduled message.
   * @param recipient Required - Destination mobile number, mobile numbers must be in international format without 00 or + Example: (4452023498)
   * @param body Required - Message body supports both English and unicodes characters, concatenated messages is supported
   * @param timeScheduled Optional - Schedule send messages, in the following format yyyy-mm-dd HH:mm:ss
   * @param correlationId Optional - Is a unique identifier value that is attached to requests and messages
   */
  public async SendMessage(
    recipient: string,
    body: string,
    timeScheduled?: string,
    correlationId?: string,
  ): Promise<UnifonicSmsResponse> {
    let queryParams: any = {
      AppSid: this.APP_SID,
      SenderID: this.SENDER_ID,
      Recipient: recipient,
      Body: encodeURIComponent(body),
    };
    if (timeScheduled) queryParams['TimeScheduled'] = timeScheduled;
    if (correlationId) queryParams['correlationID'] = correlationId;

    queryParams = this.createQueryParams(queryParams);

    const options = {
      url: `https://el.cloud.unifonic.com/rest/SMS/messages${timeScheduled ? '/scheduledmessages' : ''}${queryParams}`,
      method: 'POST',
      headers: { accept: 'application/json' },
    };

    const response = await axios(options);
    return response.data;
  }

  /**
   * Cancel previously scheduled message. If messageId is given,
   * then only that scheduled message is canceled, otherwise all messages are
   * cancelled that have been scheduled previously.
   * @param messageId Optional - A unique ID that identifies a message
   */
  public async StopScheduledMessage(messageId?: string): Promise<UnifonicSmsResponse> {
    let queryParams: any = {
      AppSid: this.APP_SID,
    };
    if (messageId) queryParams['MessageID'] = messageId;

    queryParams = this.createQueryParams(queryParams);

    const options = {
      url: `https://el.cloud.unifonic.com/rest/SMS/messages/scheduledmessages${queryParams}`,
      method: 'DELETE',
      headers: { accept: 'application/json' },
    };

    const response = await axios(options);
    return response.data;
  }

  /**
   * Get details of previously scheduled messages.
   */
  public async GetScheduledMessages(): Promise<UnifonicSmsResponse> {
    const options = {
      url: `https://el.cloud.unifonic.com/rest/SMS/messages/scheduledmessages?AppSid=${this.APP_SID}`,
      method: 'GET',
      headers: { accept: 'application/json' },
    };

    const response = await axios(options);
    return response.data;
  }

  /**
   * Get the status details of a previously sent messages. Optional parameters working as search filters could be specified.
   * @param messageId Optional - A unique ID that identifies a message
   * @param senderId Optional - The Sender ID to send from, App default SenderID is used unless else stated
   * @param recipient Optional - Destination mobile number, mobile numbers must be in international format without 00 or + Example: (4452023498)
   * @param dateFrom Optional - The start date for the report time interval, date format should be yyyy-mm-dd
   * @param dateTo Optional - The end date for the report time interval, date format should be yyyy-mm-dd
   * @param correlationId Optional - Is a unique identifier value that is attached to requests and messages
   */
  public async GetPreviousMessages(
    messageId?: string,
    senderId?: string,
    recipient?: string,
    dateFrom?: string,
    dateTo?: string,
    correlationId?: string,
  ): Promise<UnifonicSmsResponse> {
    let queryParams: any = {
      AppSid: this.APP_SID,
      Limit: 1000,
    };
    if (messageId) queryParams['MessageID'] = messageId;
    if (senderId) queryParams['senderID'] = senderId;
    if (recipient) queryParams['Recipient'] = recipient;
    if (dateFrom) queryParams['dateFrom'] = dateFrom;
    if (dateTo) queryParams['dateTo'] = dateTo;
    if (correlationId) queryParams['CorrelationID'] = correlationId;

    queryParams = this.createQueryParams(queryParams);

    const options = {
      url: `https://el.cloud.unifonic.com/rest/SMS/Messages/GetMessagesDetails${queryParams}`,
      method: 'POST',
      headers: { accept: 'application/json' },
    };

    const response = await axios(options);
    return response.data;
  }
}
