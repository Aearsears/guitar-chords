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
        let midiCounter = 0;
        for (let i = 1; i <= 6; i++) {
            let string = this.canvas.line(100 + i * 50, 100, 100 + i * 50, 300);
            let fret = this.canvas.line(150, 60 + i * 40, 400, 60 + i * 40);
            string.stroke({ color: 'black', width: 2, linecap: 'round' });
            fret.stroke({ color: 'black', width: 3, linecap: 'round' });
            if (this.chosenFingerPos.frets[i - 1] === -1) {
                let cir = this.circlesNested.circle(rad);
                cir.x(100 + i * 50 - rad / 2).y(60);
                let pos = this.circlesNested.text('X');
                pos.x(100 + i * 50).y(70);
                pos.font({
                    fill: 'white',
                    family: 'Roboto',
                    size: 20,
                });
            }
            // drawing circles on the strings
            else {
                let cir = this.circlesNested.circle(rad);
                cir.x(100 + i * 50 - rad / 2).y(
                    60 + this.chosenFingerPos.frets[i - 1] * 40
                );
                let note = this.fretToNote.midiToNote(
                    this.chosenFingerPos.midi[midiCounter]
                );
                if (typeof note === 'string') {
                    cir.attr('class', note.replace(/ /g, ''));
                }
                midiCounter++;
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
