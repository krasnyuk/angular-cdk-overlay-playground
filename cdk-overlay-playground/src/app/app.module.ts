import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {ReactiveFormsModule} from "@angular/forms";
import {OverlayModule} from "@angular/cdk/overlay";
import { TooltipComponent } from './tooltip/tooltip.component';
import {PortalModule} from "@angular/cdk/portal";

@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        OverlayModule,
        PortalModule
    ],
    declarations: [
        AppComponent,
        TooltipComponent
    ],
    entryComponents: [TooltipComponent],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
