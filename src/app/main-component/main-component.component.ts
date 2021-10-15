import { Component, OnInit } from '@angular/core';
import { ChordServiceService } from '../chord-service.service';
import { used, muted } from '../../assets/chartdata';
import { Color, ScaleType } from '@swimlane/ngx-charts';
@Component({
    selector: 'app-main-component',
    templateUrl: './main-component.component.html',
    styleUrls: ['./main-component.component.scss'],
})
export class MainComponentComponent implements OnInit {
    chords: any;
    selectedKey!: string;
    selectedSuffix!: string;
    used: any[];
    muted: any[];

    view: [number, number] = [500, 200];

    // options
    showXAxis = true;
    showYAxis = true;
    gradient = false;
    showLegend = false;
    showXAxisLabel = true;
    xAxisLabel = 'String';
    showYAxisLabel = true;
    yAxisLabel = 'Occurences';

    colorScheme: Color = {
        name: 'myScheme',
        group: ScaleType.Linear,
        selectable: true,
        domain: [
            '#5AA454',
            '#5AA454',
            '#5AA454',
            '#5AA454',
            '#5AA454',
            '#5AA454',
        ],
    };

    constructor(private chordService: ChordServiceService) {
        this.muted = muted;
        this.used = used;
    }

    onSelectKey(key: string): void {
        this.selectedKey = key;
    }
    onSelectSuffix(s: string): void {
        this.selectedSuffix = s;
    }
    ngOnInit(): void {
        this.chords = this.chordService.getChordsJson();
    }
}
