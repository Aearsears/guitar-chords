import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ClickListenerService {
    //change type later when clearly define the message to be broadcasted
    private clickSubject = new Subject<any>();
    clickedNoteObservable = this.clickSubject.asObservable();
    broadcastClick(x: any) {
        this.clickSubject.next(x);
    }
    constructor() {}
}
