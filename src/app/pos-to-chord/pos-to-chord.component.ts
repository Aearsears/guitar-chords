import { Component, ElementRef, OnInit } from '@angular/core';
import { Circle, Rect, Svg, Element } from '@svgdotjs/svg.js';
import { ChordServiceService } from '../chord-service.service';
import { ClickListenerService } from '../click-listener.service';
import { DiagramComponent } from '../diagram/diagram.component';

@Component({
    selector: 'app-pos-to-chord',
    templateUrl: './pos-to-chord.component.html',
    styleUrls: ['./pos-to-chord.component.scss'],
})
export class PosToChordComponent extends DiagramComponent implements OnInit {
    // TODO: mute and open string
    // use graphql
    fingerMap!: Map<string, string>;
    frets!: Svg;
    strings!: Svg;
    boundingBoxes!: Svg;
    searchArray: number[] = [0, 0, 0, 0, 0, 0];
    searchResult!: string | undefined;
    timer!: NodeJS.Timeout | null;
    searching: boolean = false;
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
    drawChord(): void {
        let rad = 40;
        let spacing = 90;
        let notes = ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'];
        let pt = this.canvas.point();
        let endline = this.strings.line(90, 60, 90, 260);
        endline.stroke({ color: 'black', width: 10, linecap: 'square' });
        endline.id('endline');
        for (let i = 0; i < 6; i++) {
            // stave horizonal lines
            let line = this.strings.line(90, 60 + i * rad, 1210, 60 + i * rad);
            line.stroke({ color: 'black', width: 5, linecap: 'round' });
            // the first string drawn is E4, then B3, etc
            line.id(notes[5 - i]);
            line.on('click', (event: Event) => {
                console.log(event);
                if (!this.isPointerEvent(event)) {
                    throw new Error('Event Type Error.');
                }
                //map the client coord to svg coord
                let CTM = line.screenCTM();
                pt.x = event.clientX;
                pt.y = event.clientY;
                let cursorPt = pt.transform(CTM.inverse());
                //if the string already has a circle on it then just move the circle, one circle per string
                let c: Circle = this.circlesNested.findOne(
                    '.' + line.id()
                ) as Circle;
                if (c) {
                    c.x(cursorPt.x - rad / 2).y(cursorPt.y - rad / 2);
                } else {
                    let cir = this.circlesNested.circle(rad);
                    cir.x(cursorPt.x - rad / 2).y(cursorPt.y - rad / 2);
                    cir.addClass(line.id());
                }
                //modify search array and set timeout to search the chord

                //check which bbox is overlapping with the point
                let overlaping: Element | undefined = this.isOverlap(
                    cursorPt.x,
                    cursorPt.y
                );
                if (overlaping) {
                    this.searchArray[notes.indexOf(line.id())] =
                        overlaping.attr('fret');
                }
                // if timer is already rolling and the user inputs a new circle
                if (this.timer) {
                    clearTimeout(this.timer);
                    this.timer = null;
                }
                this.timer = setTimeout(() => this.search(), 1000);
                this.searching = true;
            });
            //drawing XO to the left of the stave lines
            let open = this.canvas.circle(rad);
            open.fill('none');
            open.stroke({ color: 'black', opacity: 1, width: 2 });
            open.x(45).y(40 + i * rad);
            open.addClass(line.id());
            let closed = this.canvas.path('M16 16 36 36 M36 16 16 36');
            closed.stroke({ color: 'black', opacity: 1, width: 2 });
            closed.addClass('checkmark__check');
        }
        for (let i = 0; i < 13; i++) {
            // fret vertical lines and fret bounding boxes
            let line = this.frets.line(
                90 + i * spacing,
                60,
                90 + i * spacing,
                260
            );
            line.stroke({ color: 'black', width: 2, linecap: 'round' });
            line.id(notes[i]);

            let bbox = this.boundingBoxes
                .rect(90, 200)
                .x(90 + i * spacing)
                .y(60);
            bbox.fill({ color: 'red', opacity: 0.4 });
            bbox.stroke({ color: 'blue', width: 1 });
            bbox.attr({ fret: i + 1 });
        }
        //need to put the strings before the bboxes so user can click on them
        this.strings.front();
    }
    // TODO sometimes when clickout of bbox it will give undefined, need to make the click space bigger
    isOverlap(x: number, y: number): Element | undefined {
        //could also do some kind of click listener and detect when a bbox was clicked and modify the array
        let rect: Element | undefined;
        for (rect of this.boundingBoxes.children()) {
            if (rect.inside(x, y)) {
                return rect;
            }
        }
        rect = undefined;
        return rect;
    }
    search(): void {
        //after the array has been modified, wait few seconds and then do the serach array.
        //settimeout(search,1000);
        let accum: string = '';
        //iterate through array of num and append to accum string
        console.log(this.searchArray);
        for (let num of this.searchArray) {
            accum = accum + num.toString();
        }
        //search the map for this position
        let result = this.fingerMap.get(accum);
        if (result) {
            this.searchResult = result;
        } else {
            this.searchResult = 'Chord not found.';
        }
        this.searching = false;
    }
    isPointerEvent(event: Event): event is PointerEvent {
        // type guarding
        return 'detail' in event;
    }
    resetCircles(): void {
        this.circlesNested.clear();
        this.searchArray = [0, 0, 0, 0, 0, 0];
        this.searchResult = undefined;
    }
    ngOnInit(): void {
        super.ngOnInit();
        this.fingerMap = new Map<string, string>();
        this.strings = this.canvas.nested();
        this.frets = this.canvas.nested();
        this.boundingBoxes = this.canvas.nested();
        let suffix: {
            key: string;
            suffix: string;
            positions: [
                {
                    frets: number[];
                    fingers: number[];
                    baseFret: number;
                    barres: number[];
                    midi: number[];
                }
            ];
        };
        for (let key of this.chords.keys) {
            for (suffix of this.chords.chords[key.replace('#', 'sharp')]) {
                for (let pos of suffix.positions) {
                    let accum: string = '';
                    //iterate through array of num and append to accum string
                    for (let num of pos.frets) {
                        accum = accum + (num + pos.baseFret - 1).toString();
                    }
                    //add the finger position into map
                    this.fingerMap.set(accum, suffix.key + ' ' + suffix.suffix);
                }
            }
        }
        this.drawChord();
    }
}
