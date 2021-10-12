import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ClickListenerService {
    private clickSubject = new Subject<string>();
    clickedNoteObservable = this.clickSubject.asObservable();
    broadcastClick(x: any) {
        this.clickSubject.next(x);
    }
    constructor() {}
}
