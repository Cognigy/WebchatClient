import { CognigyError } from "./cognigyError";
import { IProcessOutputData } from "./output";
import { IFinalPing } from "./finalPing";

export interface Options {
	baseUrl: string;
	userId: string;
	sessionId: string;
	URLToken: string;

	channel: string;

	keepMarkup?: boolean;

	language: string;

	reconnection?: boolean;
	interval?: number;
	expiresIn?: number;

	resetState?: boolean;
	resetContext?: boolean;
	resetFlow?: boolean;
	reloadFlow?: boolean;

	handleError?: (error: CognigyError) => void;
	handleException?: (error: CognigyError) => void;
	handleOutput?: (output: IProcessOutputData) => void;

	handleLogstep?: (data: any) => void;
	handleLogstepError?: (data: any) => void;
	handleLogflow?: (data: any) => void;

	handlePing?: (finalPing: IFinalPing) => void

	res?: any;
	passthroughIP?: string;
	token?: string;

	voiceName?: string;
	voiceRate?: number;
	voicePitch?: number;
};