import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-finger-diagram',
    templateUrl: './finger-diagram.component.html',
    styleUrls: ['./finger-diagram.component.scss'],
})
export class FingerDiagramComponent implements OnInit {
    chord!: String;
    setChord(s: String): void {
        this.chord = s;
    }
    constructor() {}

    ngOnInit(): void {}
}
