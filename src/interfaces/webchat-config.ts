export interface IPersistentMenuItem {
    title: string;
    payload: string;
}

export interface IWebchatSettings {
    disableToggleButton: boolean;
    backgroundImageUrl: string;
    colorScheme: string;
    designTemplate: number;
    enableFileUpload: boolean;
    enablePersistentMenu: boolean;
    enableSTT: boolean;
    enableTTS: boolean;
    enableTypingIndicator: boolean;
    enableConnectionStatusIndicator: boolean;
    getStartedButtonText: string;
    getStartedPayload: string;
    getStartedText: string;
    headerLogoUrl: string;
    inputPlaceholder: string;
    messageDelay: number;
    messageLogoUrl: string;
    persistentMenu: {
        title: string;
        menuItems: IPersistentMenuItem[];
    };
    startBehavior: "none" | "button" | "injection";
    STTLanguage: string;
    title: string;
}

export interface IWebchatConfig {
    active: boolean;
    URLToken: string;
    settings: IWebchatSettings;
}
