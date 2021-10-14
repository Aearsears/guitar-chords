import { Component, OnInit, ElementRef } from '@angular/core';
import { ChordServiceService } from '../chord-service.service';
import { ClickListenerService } from '../click-listener.service';
import { DiagramComponent } from '../diagram/diagram.component';
import { SVG } from '@svgdotjs/svg.js';
@Component({
    selector: 'app-note-diagram',
    templateUrl: './note-diagram.component.html',
    styleUrls: ['./note-diagram.component.scss'],
})
export class NoteDiagramComponent extends DiagramComponent implements OnInit {
    posMap!: Map<number, number>;
    drawChord(): void {
        let rad: number = 40;
        if (this.circlesNested.has(this.circlesNested.circle())) {
            this.circlesNested.clear();
        }
        this.canvas
            .path(
                'M 138 225 Q 125.5 187.5 163 187.5 Q 200.5 212.5 175.5 237.5 Q 138 275 100.5 237.5 C 88 162.5 163 137.5 175.5 75 Q 163 37.5 113 50 C 100.5 137.5 175.5 212.5 175.5 300 Q 150.5 337.5 138 300 M 145.349 367.004 C 155.232 370.109 141.113 390.723 130.665 370.675 Q 142.242 328.6 174.658 361.034 C 175.918 363.786 210.861 427.998 129.253 419.809 M 196.885 372.865 A 1 1 0 0 0 196.635 376.73 A 1 1 0 0 0 196.766 372.859 M 196.807 385.648 A 1 1 0 0 0 195.71 388.465 A 1 1 0 0 0 196.719 385.615'
            )
            .attr({
                fill: 'none',
                stroke: 'black',
                'stroke-width': '3',
            });
        let bass = this.canvas.line(90, 340, 90, 500);
        bass.stroke({ color: 'black', width: 10, linecap: 'square' });
        let treble = this.canvas.line(90, 100, 90, 260);
        treble.stroke({ color: 'black', width: 10, linecap: 'square' });
        for (let i = 1; i < 13; i++) {
            // stave horizonal lines
            let line = this.canvas.line(90, 60 + i * rad, 400, 60 + i * rad);
            line.stroke({ color: 'black', width: 3, linecap: 'round' });
        }
        let midiCounter = 0;
        for (let j = 0; j < 6; j++) {
            if (this.chosenFingerPos.frets[j] != -1) {
                // creating circle
                let cir = this.circlesNested.circle(rad);
                cir.x(180 + j * 30).y(
                    this.getYPos(this.chosenFingerPos.midi[midiCounter])
                );
                let note = this.fretToNote.midiToNote(
                    this.chosenFingerPos.midi[midiCounter]
                );
                // position of circle note text
                let pos = this.circlesNested.text(note as string);
                pos.x(190 + j * 30).y(
                    this.getYPos(this.chosenFingerPos.midi[midiCounter]) + 10
                );
                pos.font({
                    fill: 'white',
                    family: 'Roboto',
                    size: 20,
                });
                pos.attr({
                    'stroke-width': '10px',
                    'paint-order': 'stroke',
                    'stroke-linecap': 'butt',
                    'stroke-linejoin': 'round',
                    stroke: 'black',
                });
                midiCounter++;
                if (typeof note === 'string') {
                    let n = note.replace(/ /g, '');
                    cir.addClass(n);
                    cir.add(SVG(`<title>${n}</title>`));
                }
                cir.on('mouseover', () => {
                    if (!cir.data('clicked')) {
                        this.onClickCircle('mouseover ' + cir.attr('class'));
                    }
                });
                cir.on('mouseout', () => {
                    if (!cir.data('clicked')) {
                        this.onClickCircle('mouseout ' + cir.attr('class'));
                    }
                });
                cir.on('click', () => {
                    this.onClickCircle(cir.attr('class'));
                });
            }
        }
        this.circlesNested.front();
    }
    // TODO: add sharps and flats to make notes prettier
    getYPos(midiValue: number): number {
        return this.posMap.get(midiValue) as number;
    }
    constructor(
        chordService: ChordServiceService,
        clickService: ClickListenerService,
        elem: ElementRef
    ) {
        super(
            chordService,
            clickService,
            elem.nativeElement.tagName.toLowerCase()
        );
    }

    ngOnInit(): void {
        super.ngOnInit();
        /*  upper end midi is E6 = 88
        lower end is E2 = 40
        c4 y pos is 280
        e2=160

        */
        this.posMap = new Map<number, number>();
        let counter: number = 0;
        let e2: number = 520;
        let step: number = 20;
        for (var i = 40; i <= 88; i++) {
            this.posMap.set(i, e2);
            if (counter === 11) {
                e2 = e2 - step;
                counter = 0;
            } else if (
                counter === 0 ||
                counter === 2 ||
                counter === 4 ||
                counter === 6 ||
                counter === 7 ||
                counter === 9
            ) {
                e2 = e2 - step;
                counter++;
            } else {
                counter++;
            }
        }
    }
    ngOnDestroy() {
        super.ngOnDestroy();
    }
}
