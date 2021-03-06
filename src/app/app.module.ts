import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MainComponentComponent } from './main-component/main-component.component';
import { FingerDiagramComponent } from './finger-diagram/finger-diagram.component';
import { NoteDiagramComponent } from './note-diagram/note-diagram.component';
import { DiagramComponent } from './diagram/diagram.component';
import { PosToChordComponent } from './pos-to-chord/pos-to-chord.component';

import { NgxChartsModule } from '@swimlane/ngx-charts';

@NgModule({
    declarations: [
        AppComponent,
        MainComponentComponent,
        FingerDiagramComponent,
        NoteDiagramComponent,
        DiagramComponent,
        PosToChordComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatToolbarModule,
        MatChipsModule,
        MatTooltipModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        NgxChartsModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
