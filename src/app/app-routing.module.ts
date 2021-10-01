import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponentComponent } from './main-component/main-component.component';
import { PosToChordComponent } from './pos-to-chord/pos-to-chord.component';

const routes: Routes = [
    { path: '', component: MainComponentComponent },
    { path: 'fingerpos', component: PosToChordComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
