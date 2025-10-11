import { Component } from '@capacitor/core';

export interface OneSignalPlugin extends Component {
  setAppId(options: { appId: string }): Promise<void>;
  getDeviceState(): Promise<any>;
  promptForPushNotificationsWithUserResponse(): Promise<{ accepted: boolean }>;
  setNotificationWillShowInForegroundHandler(handler: (notification: any) => void): void;
  setNotificationOpenedHandler(handler: (notification: any) => void): void;
}

declare global {
  interface Window {
    plugins: {
      OneSignal: OneSignalPlugin;
    };
  }
}