import { Component, Input, OnInit } from '@angular/core';
import { ChordServiceService } from '../chord-service.service';

@Component({
    selector: 'app-finger-diagram',
    templateUrl: './finger-diagram.component.html',
    styleUrls: ['./finger-diagram.component.scss'],
})
export class FingerDiagramComponent implements OnInit {
    selectedChord!: String;
    chords: any;
    fingerPos!: any[];
    chosenFingerPos!: any;

    setChord(s: String): void {
        this.selectedChord = s;
        this.fingerPos = this.getFingerPos();
        // choosing the first finger position for now
        this.chosenFingerPos = this.fingerPos[0];
        console.log(this.chosenFingerPos);
    }
    getFingerPos(): any[] {
        let part = this.selectedChord.split(' ');
        console.log(part);
        let obj = this.chords.chords[part[0]].find(
            (element: any) => element.suffix === part[1]
        );
        return obj.positions;
    }
    constructor(private chordService: ChordServiceService) {}

    ngOnInit(): void {
        this.chords = this.chordService.getChordsJson();
    }
}
