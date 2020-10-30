/**
 * Cipher.ts
 * @license MIT
 * @version 2.0.1
 */
type CipherMap<T = Iterable<string>> = Record<string, T>;
class Cipher {
	private characters: string[];
	public validCharacters: string[];
	public code: string;
	encode_codes: CipherMap;
	decode_codes: CipherMap;

	constructor(code: string) {
		this.init(code);
	}

	morse: CipherMap<string> = { // you can change it, cryption will work
		a: ".-", b: "-...", c: "-.-.", d: "-..",
		e: ".", f: "..-.", g: "--.", h: "....",
		i: "..", j: ".---", k: "-.-", l: ".-..",
		m: "--", n: "-.", o: "---", p: ".--.",
		q: "--.-", r: ".-.", s: "...", t: "-",
		u: "..-", v: "...-", w: ".--", x: "-..-",
		y: "-.--", z: "--..", 1: ".----", 2: "..---",
		3: "...--", 4: "....-", 5: ".....", 6: "-....",
		7: "--...", 8: "---..", 9: "----.", 0: "-----",

		".": ".-.-.-", ",": "--..--", "?": "..--..",
		"'": ".----.", "/": "-..-.", "(": "-.--.",
		")": "-.--.-", "&": ".-...", ":": "---...",
		";": "-.-.-.", "=": "-...-", "+": ".-.-.",
		"-": "-....-", "_": "..--.-", '"': ".-..-.",
		"$": "...-..-", "!": "-.-.--", "@": ".--.-.",
		" ": "\\"
	};

	init(code?: string) {
		if (!code || !/[A-Fa-f\d]{7}/.test(code)) {
			this.characters = Array(7).fill(0).map(() => String.fromCharCode(Math.floor(Math.random() * 46) + 48));
			this.code = this.characters.map(ch => ch.charCodeAt(0).toString(48)).join("");
		} else {
			this.code = code;
			this.characters = code.match(/.{1,2}(?=(.{2})+(?!.))|.{1,2}$/g).map(code => String.fromCharCode(parseInt(code, 16)));
		}
		this.encode_codes = {
			"-": this.characters.slice(0, 3),
			".": this.characters.slice(3, 6),
			" ": this.characters[6].repeat(3)
		}
		this.decode_codes = { "|": "" };
		this.validCharacters = ["/", " "];
		for (const key in this.encode_codes) {
			if (this.encode_codes.hasOwnProperty(key)) {
				for (const character of this.encode_codes[key]) {
					this.decode_codes[character] = key;
					this.validCharacters.push(character);
				}
			}
		}
		this.decode_codes[" "] = "";
		this.decode_codes["/"] = "";
	}

	encode(text: string) {
		const withoutDiacritics = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
		const morseCode = this.encodeMorse(withoutDiacritics.toLowerCase()).split("");
		const encoded = morseCode.reverse().map((ch, i) => (this.encode_codes[ch] || ch.repeat(3))[i % 3]);
		return encoded.join("/").replace(/(\s)|(\/\|\/)/gm, this.characters[6]);
	}
	
	decode(code: string) {
		if (code.split("").some(character => !this.validCharacters.includes(character))) {
			throw new SyntaxError("Invalid code");
		}
		var morseCode = code.replace(/\//gm, "").split("").map(ch => this.decode_codes[ch] || ch).reverse();
		console.log(morseCode.join(""));
		return this.decodeMorse(morseCode.join(""));
	}

	decodeMorse(morse: string) {
		var map = Object.fromEntries(Object.entries(this.morse).map(([k, v]) => [v, k]));
		return morse.split(' ').filter(v => (
			map.hasOwnProperty(v.toLowerCase())
		)).map(v => (
			map[v.toLowerCase()].toLowerCase()
		)).join('');
	}

	encodeMorse(text: string) {
		return text.split('').filter(v => (
			this.morse.hasOwnProperty(v.toLowerCase())
		)).map(v => (
			this.morse[v.toLowerCase()].toLowerCase()
		)).join(' ').replace(/,\/,/g, '/');
	}
}