import { Component, OnInit, Inject } from '@angular/core';
import { List, SVG, Svg, Element } from '@svgdotjs/svg.js';
import { Subscription } from 'rxjs';
import { ChordServiceService } from '../chord-service.service';
import { ClickListenerService } from '../click-listener.service';
import { FretToNote } from '../fret-to-note';

@Component({
    selector: 'app-diagram',
    templateUrl: './diagram.component.html',
    styleUrls: ['./diagram.component.scss'],
})
export class DiagramComponent implements OnInit {
    selectedChord!: String;
    chords: any;
    fingerPos!: any[];
    chosenFingerPos!: any;
    canvas!: Svg;
    circlesNested!: Svg;
    subscription!: Subscription;
    fretToNote = new FretToNote();
    name: string;
    //inheriters can use but not other objects
    protected chordService: ChordServiceService;
    protected clickService: ClickListenerService;

    setChord(s: String): void {
        this.selectedChord = s;
        this.fingerPos = this.getFingerPos();
        // choosing the first finger position for now
        this.chosenFingerPos = this.fingerPos[0];
        console.log(this.chosenFingerPos);
        this.drawChord();
    }
    drawChord(): void {
        throw new Error('drawChord() not yet implemented!');
    }

    getFingerPos(): any[] {
        let split = this.selectedChord.split(' ');
        console.log(this.chords);
        let obj = this.chords.chords[split[0]].find(
            (element: any) => element.suffix === split[1]
        );
        return obj.positions;
    }

    constructor(
        chordService: ChordServiceService,
        clickService: ClickListenerService,
        @Inject(String) name: string
    ) {
        this.chordService = chordService;
        this.clickService = clickService;
        this.name = name;
    }

    onClick() {
        // this.clickService.broadcastClick('finger diagram was clicked!');
    }
    onClickCircle(note: string) {
        this.clickService.broadcastClick(note);
    }
    afterClickCircleBroadcast(note: string) {
        //because each subscriber will receive their own message, we will first broadcast the message, then perform the operations to avoid doing it two times
        let clickedC: List<Element> = this.canvas.find(`.${note}`);
        console.log(clickedC.length);
        for (var circle of clickedC) {
            if (typeof circle != 'undefined') {
                if (!circle.data('clicked')) {
                    circle.data('clicked', true, true);
                    circle.fill({ color: 'red', opacity: 1 });
                } else {
                    circle.data('clicked', false, true);
                    circle.fill({ color: 'black', opacity: 1 });
                }
            }
        }
    }
    ngOnInit(): void {
        this.chords = this.chordService.getChordsJson();
        this.canvas = SVG().addTo(this.name).size(500, 500);
        this.circlesNested = this.canvas.nested();
        this.subscription = this.clickService.clickedNoteObservable.subscribe(
            (x) => {
                this.afterClickCircleBroadcast(x);
            }
        );
    }
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
