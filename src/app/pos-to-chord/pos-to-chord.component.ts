import { Component, ElementRef, OnInit } from '@angular/core';
import { Circle, Rect, Svg, Element, Path } from '@svgdotjs/svg.js';
import { ChordServiceService } from '../chord-service.service';
import { ClickListenerService } from '../click-listener.service';
import { DiagramComponent } from '../diagram/diagram.component';

@Component({
    selector: 'app-pos-to-chord',
    templateUrl: './pos-to-chord.component.html',
    styleUrls: ['./pos-to-chord.component.scss'],
})
export class PosToChordComponent extends DiagramComponent implements OnInit {
    fingerMap!: Map<string, string>;
    frets!: Svg;
    strings!: Svg;
    boundingBoxes!: Svg;
    openCircles!: Svg;
    mute!: Svg;
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
            // horizonal lines
            let line = this.strings.line(90, 60 + i * rad, 1210, 60 + i * rad);
            line.stroke({ color: 'black', width: 10, linecap: 'square' });
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
                //check if the open circle is clicked
                let open: Circle = this.openCircles.findOne(
                    '.' + line.id()
                ) as Circle;
                if (open.data('clicked')) {
                    open.data('clicked', false, true);
                    open.stroke({ color: 'black', opacity: 0.5, width: 2 });
                }
                //check if the mute X is clicked
                let x: Path = this.mute.findOne('.' + line.id()) as Path;
                if (x.data('clicked')) {
                    x.data('clicked', false, true);
                    x.stroke({ color: 'black', opacity: 0.5 });
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
                this.searchWithTimeout();
            });
            //drawing XO to the left of the stave lines
            let open = this.openCircles.circle(rad);
            open.fill({ color: 'black', opacity: 0 });
            open.stroke({ color: 'black', opacity: 1, width: 2 });
            open.x(45).y(40 + i * rad);
            open.addClass(line.id());
            open.data('clicked', true, true);
            open.on('click', (event: Event) => {
                if (open.data('clicked')) {
                    return;
                } else {
                    //remove existing circle on string if exists
                    let c: Circle = this.circlesNested.findOne(
                        '.' + open.classes()[0]
                    ) as Circle;
                    if (c) {
                        c.remove();
                    }
                    open.data('clicked', true, true);
                    open.stroke({ color: 'black', opacity: 1, width: 2 });
                    //change the mute to off
                    let x: Path = this.mute.findOne('.' + line.id()) as Path;
                    if (x.data('clicked')) {
                        x.data('clicked', false, true);
                        x.stroke({ color: 'black', opacity: 0.5 });
                    }
                    //change search array position to zero
                    this.searchArray[notes.indexOf(open.classes()[0])] = 0;
                    this.searchWithTimeout();
                }
            });
            //mute X drawn in middle of circle to indicate muted string
            let closed = this.mute.path('M16 16 36 36 M36 16 16 36');
            closed.stroke({ color: 'black', opacity: 0.5, width: 5 });
            closed.addClass(line.id());
            closed.data('clicked', false, true);
            closed.x(25).y(50 + i * rad);
            closed.data('clicked', false, true);
            closed.on('click', (event: Event) => {
                if (closed.data('clicked')) {
                    return;
                } else {
                    //remove existing circle on string if exists
                    let c: Path = this.circlesNested.findOne(
                        '.' + closed.classes()[0]
                    ) as Path;
                    if (c) {
                        c.remove();
                    }
                    closed.data('clicked', true, true);
                    closed.stroke({ color: 'black', opacity: 1 });
                    //change the openstring to off
                    let cir: Path = this.openCircles.findOne(
                        '.' + line.id()
                    ) as Path;
                    if (cir.data('clicked')) {
                        cir.data('clicked', false, true);
                        cir.stroke({ color: 'black', opacity: 0.5, width: 2 });
                    }
                    //change search array position to zero
                    this.searchArray[notes.indexOf(closed.classes()[0])] = -1;
                    this.searchWithTimeout();
                }
            });
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

            let bbox = this.boundingBoxes
                .rect(90, 250)
                .x(90 + i * spacing)
                .y(35);
            bbox.fill({ color: 'tan', opacity: 1 });
            bbox.stroke({ color: 'black', width: 1 });
            bbox.attr({ fret: i + 1 });
        }
        //need to put the strings before the bboxes so user can click on them
        this.strings.front();
        this.circlesNested.before(this.boundingBoxes);
    }
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
    searchWithTimeout(): void {
        // if timer is already rolling and the user inputs a new circle
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        this.timer = setTimeout(() => this.search(), 1);
        this.searching = true;
    }
    isPointerEvent(event: Event): event is PointerEvent {
        // type guarding
        return 'detail' in event;
    }
    resetCircles(): void {
        this.circlesNested.clear();
        this.openCircles.each((i, children) => {
            children[i].stroke({ color: 'black', opacity: 1, width: 2 });
            children[i].data('clicked', true, true);
        });
        this.mute.each((i, children) => {
            children[i].stroke({ color: 'black', opacity: 0.5 });
            children[i].data('clicked', false, true);
        });
        this.searchArray = [0, 0, 0, 0, 0, 0];
        this.searchResult = undefined;
    }
    ngOnInit(): void {
        super.ngOnInit();
        this.fingerMap = new Map<string, string>();
        this.strings = this.canvas.nested();
        this.frets = this.canvas.nested();
        this.boundingBoxes = this.canvas.nested();
        this.openCircles = this.canvas.nested();
        this.mute = this.canvas.nested();
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
