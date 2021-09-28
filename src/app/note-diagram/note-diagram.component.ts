import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-note-diagram',
    templateUrl: './note-diagram.component.html',
    styleUrls: ['./note-diagram.component.scss'],
})
export class NoteDiagramComponent implements OnInit {
    chord!: String;
    setChord(s: String): void {
        this.chord = s;
    }
    constructor() {}

    ngOnInit(): void {}
}
