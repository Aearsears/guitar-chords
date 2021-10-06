import { Component, OnInit } from '@angular/core';
import { ChordServiceService } from '../chord-service.service';

@Component({
    selector: 'app-pos-to-chord',
    templateUrl: './pos-to-chord.component.html',
    styleUrls: ['./pos-to-chord.component.scss'],
})
export class PosToChordComponent implements OnInit {
    // TODO: enter in or click on the frets and reutrn the chord name if possible.
    // use a map to implement the serach?
    chords: any;
    fingerMap!: Map<string, string>;
    constructor(private chordService: ChordServiceService) {}

    ngOnInit(): void {
        this.chords = this.chordService.getChordsJson();
        this.fingerMap = new Map<string, string>();
        let suffix: {
            key: string;
            suffix: string;
            positions: [
                {
                    frets: number[];
                    fingers: number[];
                    baseFret: number;
                    barres: number[];
                    midi: number[];
                }
            ];
        };
        for (let key of this.chords.keys) {
            for (suffix of this.chords.chords[key.replace('#', 'sharp')]) {
                for (let pos of suffix.positions) {
                    let accum: string = '';
                    for (let num of pos.frets) {
                        accum = accum + (num + pos.baseFret - 1).toString();
                    }
                    this.fingerMap.set(accum, suffix.key + ' ' + suffix.suffix);
                }
            }
        }
        console.log(this.fingerMap.get('81010988'));
    }
}
