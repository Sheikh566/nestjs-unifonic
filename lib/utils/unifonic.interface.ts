export interface ExtraConfiguration {
  isGlobal?: boolean;
}
export interface UnifonicModuleOptions extends ExtraConfiguration {
  appSid: string;
  senderId: string;
}

export type UnifonicSmsResponse = {
  success: boolean;
  message: string;
  errorCode: string;
  Status?: string;
  data: any;
};
