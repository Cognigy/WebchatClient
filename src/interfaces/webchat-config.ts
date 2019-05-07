export interface IPersistentMenuItem {
    title: string;
    payload: string;
}

export interface IWebchatSettings {
    colorScheme: string;
    designTemplate: number;
    inputPlaceholder: string;
    enableSTT: boolean;
    enableTTS: boolean;
    enableFileUpload: boolean;
    startBehavior: "none" | "button" | "injection";
    getStartedButtonText: string;
    getStartedPayload: string;
    getStartedText: string;
    headerLogoUrl: string;
    messageLogoUrl: string;
    backgroundImageUrl: string;
    enableTypingIndicator: boolean;
    messageDelay: number;
    persistentMenu: {
        title: string;
        menuItems: IPersistentMenuItem[];
    };
    enablePersistentMenu: boolean;
    title: string;
}

export interface IWebchatConfig {
    active: boolean;
    URLToken: string;
    settings: IWebchatSettings;
}
