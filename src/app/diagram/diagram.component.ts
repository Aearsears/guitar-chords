import { ThisReceiver } from '@angular/compiler';
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
    selectedKey!: string;
    selectedSuffix!: string;
    chords: any;
    fingerPos!: any[];
    chosenFingerPos!: any;
    chosenFingerCount!: number;
    canvas!: Svg;
    circlesNested!: Svg;
    subscription!: Subscription;
    fretToNote = new FretToNote();
    name: string;
    //inheriters can use but not other objects
    protected chordService: ChordServiceService;
    protected clickService: ClickListenerService;

    constructor(
        chordService: ChordServiceService,
        clickService: ClickListenerService,
        @Inject(String) name: string
    ) {
        this.chordService = chordService;
        this.clickService = clickService;
        this.name = name;
    }

    setKey(key: string): void {
        this.selectedKey = key;
    }
    setSuffix(suff: string): void {
        this.selectedSuffix = suff;
        this.fingerPos = this.getFingerPos();
        this.chosenFingerCount = 0;
        this.chosenFingerPos = this.fingerPos[this.chosenFingerCount];
        console.log(this.chosenFingerPos);
        this.drawChord();
    }
    setFingerPos(type: 'increase' | 'decrease'): void {
        if (type === 'increase') {
            this.chosenFingerCount++;
            this.chosenFingerCount =
                this.chosenFingerCount % this.fingerPos.length;
        } else {
            this.chosenFingerCount--;
            if (this.chosenFingerCount < 0) {
                // handling negative numbers in modulo, could have also just handled the case where it is equal to -1
                this.chosenFingerCount =
                    ((this.chosenFingerCount % this.fingerPos.length) +
                        this.fingerPos.length) %
                    this.fingerPos.length;
            } else {
                this.chosenFingerCount =
                    this.chosenFingerCount % this.fingerPos.length;
            }
        }
        this.chosenFingerPos = this.fingerPos[this.chosenFingerCount];
        this.drawChord();
    }
    drawChord(): void {
        throw new Error('drawChord() not yet implemented!');
    }

    getFingerPos(): any[] {
        console.log(this.chords);
        let obj = this.chords.chords[this.selectedKey].find(
            (element: any) => element.suffix === this.selectedSuffix
        );
        return obj.positions;
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

    onClickChangePos(type: 'increase' | 'decrease'): void {
        this.clickService.broadcastClick(type);
    }

    ngOnInit(): void {
        this.chords = this.chordService.getChordsJson();
        this.canvas = SVG().addTo(this.name).size('100%', 600);
        this.circlesNested = this.canvas.nested();
        this.subscription = this.clickService.clickedNoteObservable.subscribe(
            (x: string) => {
                if (x === 'increase' || x === 'decrease') {
                    this.setFingerPos(x);
                } else {
                    this.afterClickCircleBroadcast(x);
                }
            }
        );
    }
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
