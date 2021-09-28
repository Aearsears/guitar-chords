import { Component, OnInit } from '@angular/core';
import { ChordServiceService } from '../chord-service.service';
@Component({
    selector: 'app-main-component',
    templateUrl: './main-component.component.html',
    styleUrls: ['./main-component.component.scss'],
})
export class MainComponentComponent implements OnInit {
    chords: any;
    selectedchord!: string;

    onSelect(chord: string): void {
        this.selectedchord = chord;
        console.log(this.selectedchord);
    }
    constructor(private chordService: ChordServiceService) {}

    ngOnInit(): void {
        this.chords = this.chordService.getChordsJson();
    }
}
