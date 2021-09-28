import { Component, Input, OnInit } from '@angular/core';
import { ChordServiceService } from '../chord-service.service';
import {
    SVG,
    extend as SVGextend,
    Element as SVGElement,
    SvgType,
    Svg,
} from '@svgdotjs/svg.js';

@Component({
    selector: 'app-note-diagram',
    templateUrl: './note-diagram.component.html',
    styleUrls: ['./note-diagram.component.scss'],
})
export class NoteDiagramComponent implements OnInit {
    selectedChord!: String;
    chords: any;
    fingerPos!: any[];
    chosenFingerPos!: any;
    canvas!: Svg;
    circlesNested!: Svg;

    setChord(s: String): void {
        this.selectedChord = s;
        this.fingerPos = this.getFingerPos();
        // choosing the first finger position for now
        this.chosenFingerPos = this.fingerPos[0];
        console.log(this.chosenFingerPos);
        this.drawChord();
    }
    drawChord(): void {
        let rad: number = 40;
        if (this.circlesNested.has(this.circlesNested.circle())) {
            this.circlesNested.clear();
        }
        for (let i = 1; i <= 6; i++) {
            let string = this.canvas.line(100 + i * 50, 100, 100 + i * 50, 300);
            let fret = this.canvas.line(150, 60 + i * 40, 400, 60 + i * 40);
            string.stroke({ color: 'black', width: 2, linecap: 'round' });
            fret.stroke({ color: 'black', width: 3, linecap: 'round' });
            if (this.chosenFingerPos.fingers[i - 1] > 0) {
                if (this.chosenFingerPos.frets[i - 1] != -1) {
                    let cir = this.circlesNested.circle(rad);
                    cir.x(100 + i * 50 - rad / 2).y(
                        60 + this.chosenFingerPos.frets[i - 1] * 40
                    );
                    cir.attr('class', 'mycircle');
                    cir.on('mouseover', function () {
                        cir.fill({ color: '#f06', opacity: 0.6 });
                    });
                    cir.on('mouseout', function () {
                        cir.fill({ color: 'black', opacity: 1 });
                    });
                    let pos = this.circlesNested.text(
                        this.chosenFingerPos.fingers[i - 1]
                    );
                    pos.x(100 + i * 50).y(
                        70 + this.chosenFingerPos.frets[i - 1] * 40
                    );
                    pos.font({
                        fill: 'white',
                        family: 'Roboto',
                        size: 20,
                    });
                }
            }
        }
    }
    getFingerPos(): any[] {
        let split = this.selectedChord.split(' ');
        let obj = this.chords.chords[split[0]].find(
            (element: any) => element.suffix === split[1]
        );
        return obj.positions;
    }
    constructor(private chordService: ChordServiceService) {}

    ngOnInit(): void {
        this.chords = this.chordService.getChordsJson();
        this.canvas = SVG().addTo('.diagram').size(500, 500);
        this.circlesNested = this.canvas.nested();
    }
}
