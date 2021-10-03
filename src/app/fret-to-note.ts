export class FretToNote {
    // for now support up to the 12th fret
    // TODO: add the c4th

    // map of 1:E
    private noteMap: Map<number, string> = new Map<number, string>();
    private notes: string[] = [
        'G9', // MIDI127
        'Fsharp9-Gflat9',
        'F9',
        'E9',
        'Dsharp9-Eflat9',
        'D9',
        'Csharp9-Dflat9',
        'C9',
        'B8',
        'Asharp8-Bflat8',
        'A8',
        'Gsharp8-Aflat8',
        'G8',
        'Fsharp8-Gflat8',
        'F8',
        'E8',
        'Dsharp8-Eflat8',
        'D8',
        'Csharp8-Dflat8',
        'C8',
        'B7',
        'Asharp7-Bflat7',
        'A7',
        'Gsharp7-Aflat7',
        'G7',
        'Fsharp7-Gflat7',
        'F7',
        'E7',
        'Dsharp7-Eflat7',
        'D7',
        'Csharp7-Dflat7',
        'C7',
        'B6',
        'Asharp6-Bflat6',
        'A6',
        'Gsharp6-Aflat6',
        'G6',
        'Fsharp6-Gflat6',
        'F6',
        'E6',
        'Dsharp6-Eflat6',
        'D6',
        'Csharp6-Dflat6',
        'C6',
        'B5',
        'Asharp5-Bflat5',
        'A5',
        'Gsharp5-Aflat5',
        'G5',
        'Fsharp5-Gflat5',
        'F5',
        'E5',
        'Dsharp5-Eflat5',
        'D5',
        'Csharp5-Dflat5',
        'C5',
        'B4',
        'Asharp4-Bflat4',
        'A4',
        'Gsharp4-Aflat4',
        'G4',
        'Fsharp4-Gflat4',
        'F4',
        'E4',
        'Dsharp4-Eflat4',
        'D4',
        'Csharp4-Dflat4',
        'C4',
        'B3',
        'Asharp3-Bflat3',
        'A3',
        'Gsharp3-Aflat3',
        'G3',
        'Fsharp3-Gflat3',
        'F3',
        'E3',
        'Dsharp3-Eflat3',
        'D3',
        'Csharp3-Dflat3',
        'C3',
        'B2',
        'Asharp2-Bflat2',
        'A2',
        'Gsharp2-Aflat2',
        'G2',
        'Fsharp2-Gflat2',
        'F2',
        'E2',
        'Dsharp2-Eflat2',
        'D2',
        'Csharp2-Dflat2',
        'C2',
        'B1',
        'Asharp1-Bflat1',
        'A1',
        'Gsharp1-Aflat1',
        'G1',
        'Fsharp1-Gflat1',
        'F1',
        'E1',
        'Dsharp1-Eflat1',
        'D1',
        'Csharp1-Dflat1',
        'C1',
        'B0',
        'Asharp0-Bflat0',
        'A0', // MIDI 21
    ];

    // first string, second string, ...
    private initialpos: number[] = [0, 5, 10, 3, 7, 0];

    constructor() {
        for (var i = 0; i < this.notes.length; i++) {
            this.noteMap.set(127 - i, this.notes[i]);
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
    midiToNote(value: number): string | Error {
        let note = this.noteMap.get(value);
        if (typeof note === 'string') {
            return note;
        } else {
            return new Error('Cannot find note.');
        }
    }
}
