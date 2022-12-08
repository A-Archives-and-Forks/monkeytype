import axios from "axios";
import { Section } from "../utils/misc";

const bannedChars = new Set(["—", "_", " "]);
const maxWords = 100;
const apiURL = "https://poetrydb.org/random";

export class Poem extends Section {
  constructor(title: string, author: string, words: string[]) {
    super(title, author, words);
    this.title = title;
    this.author = author;
    this.words = words;

    this.cleanUpText();
  }

  cleanUpText(): void {
    let count = 0;
    const scrubbedWords = [];
    for (let i = 0; i < this.words.length; i++) {
      let scrubbed = "";
      for (let j = 0; j < this.words[i].length; j++) {
        if (!bannedChars.has(this.words[i][j])) {
          scrubbed += this.words[i][j];
        }
      }

      if (scrubbed == "") continue;

      scrubbedWords.push(scrubbed);
      count++;

      if (count == maxWords) break;
    }

    this.words = scrubbedWords;
  }
}

interface PoemObject {
  lines: string[];
  title: string;
  author: string;
}

export async function getPoem(): Promise<Section | false> {
  console.log("Getting poem");

  try {
    const response = await axios.get(apiURL);
    const poemObj: PoemObject = response.data[0];

    const words: string[] = [];

    for (const line of poemObj.lines) {
      for (const word of line.split(/ +/)) {
        words.push(word);
      }
    }

    return new Poem(poemObj.title, poemObj.author, words);
  } catch (error) {
    console.log(error);
    return false;
  }
}
