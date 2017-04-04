import {CognigyClient} from "./client";
import {Options} from "./interfaces/options";

// define the webkitSpeechRecognition as any to make typescript happy
interface IWindow extends Window {
    webkitSpeechRecognition : any
}

const {webkitSpeechRecognition} : IWindow = <IWindow>window;

export class CognigyWebClient extends CognigyClient {
    constructor(options : Options) {
        super(options);

        this.voices = [];
        this.currentVoice = null;
        this.recognizer = null;
        this.recognizing = false;
        this.finalTranscript = "";
        this.language = options.language;
        this.onRecEnd = null;

        // register for the "onvoiceschanged" event since speech synthesis
        // voices will get loaded async.
        window.speechSynthesis.onvoiceschanged = () => {
            this.currentVoice = this.initSpeechSynthesis(options.language);
        };

        this.initSpeechRecognigition();
    }

    private voices : SpeechSynthesisVoice[];
    public currentVoice : SpeechSynthesisVoice;
    private recognizer : any;
    private recognizing : boolean;
    private finalTranscript : string;
    private language : string;
    private onRecEnd : (transcript : string) => void;

    private initSpeechSynthesis(language : string, voiceName? : string) : SpeechSynthesisVoice {
        let voices : SpeechSynthesisVoice[] = window.speechSynthesis.getVoices();

        // find desired language, otherwise just return the first one
        for(let v in voices) {
            if(voices[v].lang === language) {
                if(!voiceName)
                    return voices[v];
                else if(voices[v].name.indexOf(voiceName) > -1)
                    return voices[v];
            }
        }

        // return first voice by default
        return voices[0];
    }

    private initSpeechRecognigition() : void {
        this.recognizer = new webkitSpeechRecognition();
        this.recognizer.continuous = true;
        this.recognizer.interimResults = true;

        this.recognizer.onstart = () => {
            this.recognizing = true;
        };

        this.recognizer.onerror = (event : any) => {
            console.error("error: ", event);
        };

        this.recognizer.onend = () => {
            this.recognizing = false;

            if(this.onRecEnd !== null && this.onRecEnd !== undefined && typeof this.onRecEnd === "function")
                this.onRecEnd(this.finalTranscript);
        };

        this.recognizer.onresult = (event : any) => {
            let firstChar : RegExp = /\S/;

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    this.finalTranscript += event.results[i][0].transcript;
                    this.finalTranscript = this.finalTranscript.replace(firstChar, (m) => {
                        return m.toUpperCase();
                    });
                }
            }
        }
    }

    public say(message : string) : void {
        let vsmg = new SpeechSynthesisUtterance();
        vsmg.voice = this.currentVoice;
        vsmg.text = message;
        vsmg.pitch = 1;
        vsmg.rate = 1;

        window.speechSynthesis.speak(vsmg);
    }

    public registerOnRecEnd(onRecEnd : (transcript : string) => void) : void {
        this.onRecEnd = onRecEnd;
    }

    public toggleRec() : void {
        if(this.recognizing) {
            this.recognizer.stop();
            return;
        }

        this.finalTranscript = "";
        this.recognizer.lang = this.language;
        this.recognizer.start();
    }
}