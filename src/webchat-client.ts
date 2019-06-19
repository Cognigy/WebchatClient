import { SocketClient } from '@cognigy/socket-client';
import { Options } from '@cognigy/socket-client/lib/interfaces/options';
import { IWebchatConfig } from './interfaces/webchat-config';
import { shouldForceWebsockets } from './helper/compatibility';

export { Options }

export class WebchatClient extends SocketClient {
    public webchatConfig: IWebchatConfig;

    private static createDefaultWebchatOptions(): Partial<Options> {
        const forceWebsockets = shouldForceWebsockets();

        return {
            channel: 'webchat-client',
            forceWebsockets
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
        super(
            WebchatClient.getEndpointBaseUrl(webchatConfigUrl), 
            WebchatClient.getEndpointUrlToken(webchatConfigUrl), 
            WebchatClient.createWebchatOptions(options)
        );
    }

    get webchatConfigUrl(): string {
		// @ts-ignore
        return `${this.socketUrl}/${this.socketURLToken}`;
    }

    loadWebchatConfig = async () => {
        if (this.webchatConfig)
            return;
            
        const config = await WebchatClient.fetchWebchatConfig(this.webchatConfigUrl);
        this.webchatConfig = config;
    }

    async connect() {
        await this.loadWebchatConfig();
        return super.connect();
    }
}