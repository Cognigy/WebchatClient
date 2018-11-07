import { Options } from "../cognigyClient";

export interface ISpeechOptions extends Options {
    language: string;

    voiceName?: string;
    voiceRate?: number;
    voicePitch?: number;
}