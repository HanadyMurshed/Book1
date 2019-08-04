import { NONAME } from "dns";
class framework {
    loadEvenHandler: any[];
    doWrokEventHnadler: any[];
    EndEventHnadler: any[];

    constructor() {

        this.loadEvenHandler = [];

        this.doWrokEventHnadler = [];

        this.EndEventHnadler = [];

    }

    RegisterForLoad(handler: any) {
        this.loadEvenHandler.push(handler)
    }
    RegisterForDoWork(handler: any) {
        this.doWrokEventHnadler.push(handler)
    }
    RegisterForEnd(handler: any) {
        this.EndEventHnadler.push(handler)
    }

    run() {
        for (let h in this.loadEvenHandler) {

            this.loadEvenHandler[h]();
        }
        for (let w in this.doWrokEventHnadler) {

            this.doWrokEventHnadler[w]();
        }
        for (let v in this.EndEventHnadler) {
            this.EndEventHnadler[v]();
        }
    }
}

class DataStorage {
    data: string;
    stopWordFilter = undefined;
    wordHnadler = []

    constructor(wfapp: framework, stopWord) {


        this.stopWordFilter = stopWord;
        wfapp.RegisterForLoad(this.read.bind(this));
        wfapp.RegisterForDoWork(this.words.bind(this))

    }

    read() {
        this.data = require('fs').readFileSync('./input\\dummy.txt').toString().replace(/[\W_|]+/gi, " ");
    }

    words() {

        let words = this.data.split(' ');
        for (let w in words) {
            if (!this.stopWordFilter.isStop(words[w]))
                this.wordHnadler[0](words[w])
            else {
                this.wordHnadler[1](words[w])

            }
        }
    }
    registerWordHnadler(handler) {
        this.wordHnadler.push(handler)
    }

}

class StopWords {

    stopWordsList: [];

    constructor(wfapp: framework) {
        this.stopWordsList = [];
        wfapp.RegisterForLoad(this.readStop.bind(this));
    }

    readStop() {
        this.stopWordsList = require('fs').readFileSync('./input\\stopwords.txt').toString().split("\n");

    }
    isStop(word: string): Boolean {
        for (let w in this.stopWordsList) {
            if (this.stopWordsList[w] == word)
                return true;
        }
        return false;
    }
}

class FreqCount {
    freq: [string, number][];

    constructor(wfapp: framework, daraStorag: DataStorage) {
        this.freq = [];
        daraStorag.registerWordHnadler(this.increament.bind(this))
        wfapp.RegisterForEnd(this.sort.bind(this))
        wfapp.RegisterForEnd(this.print.bind(this))

    }
    increament(word: string) {
        let found
        for (let w in this.freq) {
            found = false;
            if (this.freq[w][0] == word) {
                this.freq[w][1] += 1;
                found = true;
                break;
            }

        }
        if (!found)
            this.freq.push([word, 1])
    }
    sort() {
        this.freq = this.freq.sort((n1, n2) => { return n1[1] - n2[1] })

    }
    print() {
        console.log("Result, \n", this.freq.slice(0, 25))
    }
}
class countZ {
    count: number
    constructor(wfapp: framework, daraStorag: DataStorage) {
        this.count = 0;
        daraStorag.registerWordHnadler(this.countZ.bind(this))
        wfapp.RegisterForEnd(this.print.bind(this))

    }
    countZ(word: string) {
        if (word.charAt(0) == 'z')
            this.count += 1;

    }
    print() {
        console.log("count of stop with z is ", this.count)
    }

}
let f = new framework();
let stop = new StopWords(f)
let data = new DataStorage(f, stop)
let freq = new FreqCount(f, data)
let count = new countZ(f, data)

f.run();
