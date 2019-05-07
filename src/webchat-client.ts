import { SocketClient } from '@cognigy/socket-client';
import { Options } from '@cognigy/socket-client/lib/interfaces/options';
import { IWebchatConfig } from './interfaces/webchat-config';

export { Options }

export class WebchatClient extends SocketClient {
    public webchatConfig: IWebchatConfig;

    private static createDefaultWebchatOptions(): Partial<Options> {
        return {
            channel: 'webchat-client'
        }
    }

    private static createWebchatOptions(options: Partial<Options> = {}): Partial<Options> {
        return {
            ...WebchatClient.createDefaultWebchatOptions(),
            ...options
        };
    }

    private static async fetchWebchatConfig(webchatConfigUrl: string) {
        // @ts-ignore
        return (await window.fetch(webchatConfigUrl)).json();
    }

    private static getEndpointBaseUrl(webchatConfigUrl: string) {
        const partials = webchatConfigUrl.split('/');
        partials.splice(partials.length - 1, 1);
        return partials.join('/');
    }

    private static getEndpointUrlToken(webchatConfigUrl: string) {
        return webchatConfigUrl.split('/').pop();
    }


    
    constructor(webchatConfigUrl: string, options: Partial<Options> = {}) {
        const baseUrl = WebchatClient.getEndpointBaseUrl(webchatConfigUrl);
        const token = WebchatClient.getEndpointUrlToken(webchatConfigUrl);
        const webchatOptions = WebchatClient.createWebchatOptions(options);

        super(baseUrl, token, webchatOptions);
    }

    get webchatConfigUrl(): string {
		// @ts-ignore
        return `${this.socketUrl}/${this.socketURLToken}`;
    }

    async connect() {
        const config = await WebchatClient.fetchWebchatConfig(this.webchatConfigUrl);
        this.webchatConfig = config;

        return super.connect();
    }
}