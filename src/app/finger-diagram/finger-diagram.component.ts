import { Component, Input, OnInit } from '@angular/core';
import { ChordServiceService } from '../chord-service.service';
import { ClickListenerService } from '../click-listener.service';
import { Subscription } from 'rxjs';
import { SVG, Svg } from '@svgdotjs/svg.js';

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
    canvas!: Svg;
    circlesNested!: Svg;
    subscription!: Subscription;

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
        this.canvas
            .path(
                'M 138 225 Q 125.5 187.5 163 187.5 Q 200.5 212.5 175.5 237.5 Q 138 275 100.5 237.5 C 88 162.5 163 137.5 175.5 75 Q 163 37.5 113 50 C 100.5 137.5 175.5 212.5 175.5 300 Q 150.5 337.5 138 300'
            )
            .attr({
                fill: 'none',
                stroke: 'black',
                'stroke-width': '3',
            });
        let endline = this.canvas.line(90, 100, 90, 260);
        endline.stroke({ color: 'black', width: 10, linecap: 'square' });
        for (let i = 1; i < 6; i++) {
            let fret = this.canvas.line(90, 60 + i * 40, 400, 60 + i * 40);
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
    constructor(
        private chordService: ChordServiceService,
        private clickService: ClickListenerService
    ) {}
    onClick() {
        this.clickService.broadcastClick('finger diagram was clicked!');
    }
    ngOnInit(): void {
        this.chords = this.chordService.getChordsJson();
        this.canvas = SVG().addTo('.diagram-fingers').size(500, 500);
        this.circlesNested = this.canvas.nested();
        this.subscription = this.clickService.clickedNoteObservable.subscribe(
            (x) => {
                console.log(x);
            }
        );
    }
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
