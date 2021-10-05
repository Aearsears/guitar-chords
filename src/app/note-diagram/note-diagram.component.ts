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
            // stave horizonal lines
            let line = this.canvas.line(90, 60 + i * rad, 400, 60 + i * rad);
            line.stroke({ color: 'black', width: 3, linecap: 'round' });
        }
        let midiCounter = 0;
        for (let j = 0; j < 6; j++) {
            if (this.chosenFingerPos.frets[j] != -1) {
                // creating circle
                let cir = this.circlesNested.circle(rad);
                cir.x(140 + j * 30).y(
                    this.getYPos(this.chosenFingerPos.midi[midiCounter])
                );
                let note = this.fretToNote.midiToNote(
                    this.chosenFingerPos.midi[midiCounter]
                );
                // position of circle note text
                let pos = this.circlesNested.text(note as string);
                pos.x(150 + j * 30).y(
                    this.getYPos(this.chosenFingerPos.midi[midiCounter]) + 10
                );
                pos.font({
                    fill: 'white',
                    family: 'Roboto',
                    size: 20,
                });
                midiCounter++;
                if (typeof note === 'string') {
                    let n = note.replace(/ /g, '');
                    cir.addClass(n);
                    cir.add(SVG(`<title>${n}</title>`));
                }
                cir.on('mouseover', function () {
                    if (!cir.data('clicked')) {
                        cir.fill({ color: '#f06', opacity: 0.6 });
                    }
                });
                cir.on('mouseout', function () {
                    if (!cir.data('clicked')) {
                        cir.fill({ color: 'black', opacity: 1 });
                    }
                });
                cir.on('click', () => {
                    this.onClickCircle(cir.attr('class'));
                });
            }
        }
    }
    getYPos(midiValue: number): number {
        let step = 20;
        // C4 y position
        let c4 = 280;
        // C4's midi value is 60
        let diff = 60 - midiValue;
        //if diff is even, then move up, if it is odd, then add sharp
        //exception to this rule is E and F and B and C, where a half step will move up the note in the diagram
        let movement = diff / 2;
        return c4 + step * movement;
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
    }
    ngOnDestroy() {
        super.ngOnDestroy();
    }
}
