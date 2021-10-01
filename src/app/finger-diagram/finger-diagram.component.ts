import { Component, OnInit, ElementRef } from '@angular/core';
import { ChordServiceService } from '../chord-service.service';
import { ClickListenerService } from '../click-listener.service';
import { DiagramComponent } from '../diagram/diagram.component';

@Component({
    selector: 'app-finger-diagram',
    templateUrl: './finger-diagram.component.html',
    styleUrls: ['./finger-diagram.component.scss'],
})
export class FingerDiagramComponent extends DiagramComponent implements OnInit {
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
                    let note = this.fretToNote.fretToNote(
                        i - 1,
                        this.chosenFingerPos.frets[i - 1]
                    );
                    cir.attr('class', note);
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
    ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}
