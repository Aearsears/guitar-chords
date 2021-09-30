import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatChipsModule } from '@angular/material/chips';
import { MainComponentComponent } from './main-component/main-component.component';
import { FingerDiagramComponent } from './finger-diagram/finger-diagram.component';
import { NoteDiagramComponent } from './note-diagram/note-diagram.component';
import { GuitarDiagramComponent } from './guitar-diagram/guitar-diagram.component';

@NgModule({
    declarations: [AppComponent, MainComponentComponent, FingerDiagramComponent, NoteDiagramComponent, GuitarDiagramComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatToolbarModule,
        MatChipsModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}