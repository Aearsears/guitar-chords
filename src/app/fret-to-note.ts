export class FretToNote {
    // for now support up to the 12th fret
    // TODO: add the c4th

    // map of 1:E
    private noteMap: Map<number, string> = new Map<number, string>();
    private notes: string[] = [
        'E',
        'F',
        'F#',
        'G',
        'G#',
        'A',
        'A#',
        'B',
        'C',
        'C#',
        'D',
        'D#',
    ];
    // first string, second string, ...
    private initialpos: number[] = [0, 5, 10, 3, 7, 0];

    constructor() {
        for (var i = 0; i < this.notes.length; i++) {
            this.noteMap.set(i, this.notes[i]);
        }
    }

    fretToNote(string: number, fret: number): string | Error {
        let x: number = this.initialpos[string];
        let y: number = x + fret;
        let z: number = y % 12;
        let a = this.noteMap.get(z);
        if (typeof a === 'string') {
            return a;
        } else {
            return new Error('Cannot find string');
        }
    }
}
