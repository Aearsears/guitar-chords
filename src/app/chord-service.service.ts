import { Injectable } from '@angular/core';
import chordsJson from '../assets/guitarChords.json';

@Injectable({
    providedIn: 'root',
})
export class ChordServiceService {
    constructor() {}
    getChordsJson(): any {
        return chordsJson;
    }
}
