import { CognigyClient, Options } from "./cognigyClient/index";
import { ISpeechOptions } from "./interfaces/speechOptions";

// define the webkitSpeechRecognition as any to make typescript happy
interface IWindow extends Window {
	webkitSpeechRecognition: any,
	SpeechRecognition: any
}

const { webkitSpeechRecognition, SpeechRecognition }: IWindow = <IWindow>window;

/**
 * Class that extends the cognigy clients functionalities. Allows to use the
 * browsers build-in html5-apis to record audio and create transcripts of voice
 * streams.
 */
export class CognigyWebClient extends CognigyClient {
	private voices: SpeechSynthesisVoice[];
	public currentVoice: SpeechSynthesisVoice;
	private recognizer: any;
	private recognizing: boolean;
	private finalTranscript: string;
	private language: string;
	private onRecEnd: (transcript: string) => void;
	private onInterim: (transcript: string) => void;
	public options: ISpeechOptions;
	
	constructor(options: ISpeechOptions) {
		super(options);

		this.voices = [];
		this.currentVoice = null;
		this.recognizer = null;
		this.recognizing = false;
		this.finalTranscript = "";
		this.language = options.language;
		this.onRecEnd = null;
		this.onInterim = null;

		this.currentVoice = this.initSpeechSynthesis(options.language, options.voiceName);

		// register for the "onvoiceschanged" event since speech synthesis
		// voices will get loaded async.
		window.speechSynthesis.onvoiceschanged = () => {
			this.currentVoice = this.initSpeechSynthesis(options.language, options.voiceName);
		};

		this.initSpeechRecognigition();
	}

	private initSpeechSynthesis(language: string, voiceName?: string): any {
		/**
		 * Certain older browsers do not support the SpeechSynthesis API
		 * since this is part of the html5-spec. Check whether the API is
		 * available before we try to use it.
		 */
		if (!window.speechSynthesis) {
			console.log("This browser does not support speech synthesis!");
			return;
		}

		const voices = window.speechSynthesis.getVoices();

		// find desired language, otherwise just return the first one
		for (const voice in voices) {
			if (voices[voice].lang === language) {
				if (!voiceName)
					return voices[voice];
				else if (voices[voice].name.indexOf(voiceName) > -1)
					return voices[voice];
			}
		}

		// return first voice by default
		return voices[0];
	}

	private initSpeechRecognigition(): void {
		/**
		 * Speech recognition is vendor specific and still has some prefixes
		 * for different browsers. Older browsers do not support it.
		 */
		if (SpeechRecognition) {
			this.recognizer = new SpeechRecognition();
		} else if (webkitSpeechRecognition) {
			this.recognizer = new webkitSpeechRecognition();
		} else {
			return;
		}
		
		this.recognizer.continuous = true;
		this.recognizer.interimResults = true;

		this.recognizer.onstart = () => {
			this.recognizing = true;
		};

		this.recognizer.onerror = (event: any) => {
			console.error("Error during speech recognition:", event);
		};

		this.recognizer.onend = () => {
			this.recognizing = false;
			this.recognizer.stop();

			if (this.onRecEnd !== null && this.onRecEnd !== undefined && typeof this.onRecEnd === "function")
				this.onRecEnd(this.finalTranscript);
		};

		this.recognizer.onresult = (event: any) => {
			let firstChar = /\S/;
			let transcript = "";

			for (let i = event.resultIndex; i < event.results.length; ++i) {
				transcript += event.results[i][0].transcript;

				if (event.results[i].isFinal) {
					this.finalTranscript += event.results[i][0].transcript;
					this.finalTranscript = this.finalTranscript.replace(firstChar, (m) => {
						return m.toUpperCase();
					});
				}
			}

			if (this.onInterim !== null && this.onInterim !== undefined && typeof this.onInterim === "function")
				this.onInterim(transcript);
		}
	}

	/**
	 * Uses the browsers build-in html5-api to speak the given input
	 * string using speech synthesis. Some browsers do not support that.
	 * This method will not do anything on these older browsers.
	 */
	public say(message: string): void {
		if (!SpeechSynthesisUtterance) {
			console.log("This browser does not support the speech synthesis utterance api and can therefore not 'speak'.");
			return;
		}

		const vsmg = new SpeechSynthesisUtterance();
		vsmg.voice = this.currentVoice;
		vsmg.text = message;
		vsmg.pitch = (this.options.voicePitch) ? this.options.voicePitch : 1;
		vsmg.rate = (this.options.voiceRate) ? this.options.voiceRate : 1;;

		window.speechSynthesis.speak(vsmg);
	}

	/**
	 * Allows to register a handler method which will be called when the
	 * audio-recording finished. This can be e.g. used to send the transcript
	 * of the audo-stream to the brain-server.
	 */
	public registerOnRecEnd(onRecEnd: (transcript: string) => void): void {
		this.onRecEnd = onRecEnd;
	}

	/**
	 * Allows to register a handler method which will be called when the
	 * audio-recording sends an interim result. 
	 */
	public registerOnInterim(onInterim: (transcript: string) => void): void {
		this.onInterim = onInterim;
	}

	/**
	 * Toggles the audio-recording.
	 * 
	 * @param lang Optional language parameter
	 */
	public toggleRec(lang?: string): void {
		/**
		 * Some browsers can not use the recognizer and therefore this
		 * method will not do anything.
		 */
		if (!SpeechRecognition && !webkitSpeechRecognition) {
			console.log("This browser does not support the speech recognition API.");
			return;
		}

		if (this.recognizing) {
			this.recognizer.stop();
			return;
		}

		this.finalTranscript = "";
		this.recognizer.lang = (lang) ? lang : this.language;
		this.recognizer.start();
	}
}