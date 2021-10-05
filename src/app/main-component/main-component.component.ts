import { Component, OnInit } from '@angular/core';
import { ChordServiceService } from '../chord-service.service';
@Component({
    selector: 'app-main-component',
    templateUrl: './main-component.component.html',
    styleUrls: ['./main-component.component.scss'],
})
export class MainComponentComponent implements OnInit {
    chords: any;
    selectedKey!: string;
    selectedSuffix!: string;

    constructor(private chordService: ChordServiceService) {}

    onSelectKey(key: string): void {
        this.selectedKey = key;
    }
    onSelectSuffix(s: string): void {
        this.selectedSuffix = s;
    }
    ngOnInit(): void {
        this.chords = this.chordService.getChordsJson();
    }
}
