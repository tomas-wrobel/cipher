/**
 * @typedef {Record<string, Iterable<string>>} CipherMap
 */
class Cipher {
	/**
	 * @param {string} code 
	 */
	constructor(code) {
		this.init(code);
		this.morse = {
			a: '.-', b: '-...', c: '-.-.', d: '-..',
			e: '.', f: '..-.', g: '--.', h: '....',
			i: '..', j: '.---', k: '-.-', l: '.-..',
			m: '--', n: '-.', o: '---', p: '.--.',
			q: '--.-', r: '.-.', s: '...', t: '-',
			u: '..-', v: '...-', w: '.--', x: '-..-',
			y: '-.--', z: '--..', 1: '.----', 2: '..---',
			3: '...--', 4: '....-', 5: '.....', 6: '-....',
			7: '--...', 8: '---..', 9: '----.', 0: '-----',

			'.': '.-.-.-', ',': '--..--', '?': '..--..',
			"'": '.----.', '/': '-..-.', '(': '-.--.',
			')': '-.--.-', '&': '.-...', ':': '---...',
			';': '-.-.-.', '=': '-...-', '+': '.-.-.',
			'-': '-....-', '_': '..--.-', '"': '.-..-.',
			'$': '...-..-', '!': '-.-.--', '@': '.--.-.',
			' ': '\\'
		};
	}
	/**
	 * @param {string} code 
	 */
	init(code) {
		if (!code || !/[A-Fa-f\d]{7}/.test(code)) {
			this.characters = Array(7).fill(0).map(() => String.fromCharCode(Math.floor(Math.random() * 46) + 48));
			this.code = this.characters.map(ch => ch.charCodeAt(0).toString(16)).join("");
		} else {
			this.code = code;
			this.characters = code.match(/.{1,2}(?=(.{2})+(?!.))|.{1,2}$/g).map(code => String.fromCharCode(parseInt(code, 16)));
		}
		/** @type {CipherMap} */
		this.encode_codes = {
			"-": this.characters.slice(0, 3),
			".": this.characters.slice(3, 6),
			" ": this.characters[6].repeat(3)
		}
		/** @type {CipherMap} */
		this.decode_codes = { "|": "" };
		/** @type {string[]} */
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
	/**
	 * @param {string} text 
	 */
	encode(text) {
		const withoutDiacritics = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
		const morseCode = this.encodeMorse(withoutDiacritics.toLowerCase()).split("");
		const encoded = morseCode.reverse().map((ch, i) => (this.encode_codes[ch] || ch.repeat(3))[i % 3]);
		return encoded.join("/").replace(/(\s)|(\/\|\/)/gm, this.characters[6]);
	}
	/**
	 * @param {string} code 
	 */
	decode(code) {
		if (code.split("").some(character => !this.validCharacters.includes(character))) {
			throw new SyntaxError("Invalid code");
		}
		var morseCode = code.replace(/\//gm, "").split("").map(ch => this.decode_codes[ch] || ch).reverse();
		console.log(morseCode.join(""));
		return this.decodeMorse(morseCode.join(""));
	}
	/**
	 * @param {string} morse 
	 */
	decodeMorse(morse) {
		var map = Object.fromEntries(Object.entries(this.morse).map(([k, v]) => [v, k]));
		return morse.split(' ').filter(v => (
			map.hasOwnProperty(v.toLowerCase())
		)).map(v => (
			map[v.toLowerCase()].toLowerCase()
		)).join('');
	}
	/**
	 * @param {string} text 
	 */
	encodeMorse(text) {
		return text.split('').filter(v => (
			this.morse.hasOwnProperty(v.toLowerCase())
		)).map(v => (
			this.morse[v.toLowerCase()].toLowerCase()
		)).join(' ').replace(/,\/,/g, '/');
	}
}