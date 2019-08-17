import {
    ChangeDetectionStrategy,
    Component, ComponentRef,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {ComponentPortal} from "@angular/cdk/portal";
import {TooltipComponent} from "./tooltip/tooltip.component";
import {ConnectedPosition, Overlay, OverlayConfig, OverlayRef, PositionStrategy} from "@angular/cdk/overlay";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, OnDestroy {
    form: FormGroup;
    xCoordinatesValues: Array<string> = ['start', 'center', 'end'];
    yCoordinatesValues: Array<string> = ['top', 'center', 'bottom'];
    private overlayRef: OverlayRef;
    private tooltipComponentRef: ComponentRef<TooltipComponent>;
    private destroy$ = new Subject();

    @ViewChild('tooltipHostElement', {read: ElementRef, static: true}) tooltipHostElement: ElementRef<HTMLElement>;

    constructor(private viewContainerRef: ViewContainerRef, private overlay: Overlay) {
    }

    ngOnInit(): void {
        this.initForm();
        this.onFormChange();
        this.setInitialValue();
    }

    private initForm() {
        this.form = new FormGroup({
            originX: new FormControl(''),
            originY: new FormControl(''),
            overlayX: new FormControl(''),
            overlayY: new FormControl(''),
        });
    }

    private setInitialValue() {
        this.form.setValue({
            originX: 'start',
            originY: 'bottom',
            overlayX: 'start',
            overlayY: 'top',
        });
    }

    private onFormChange() {
        this.form.valueChanges.pipe(
            takeUntil(this.destroy$)
        ).subscribe((formValue: { [control: string]: any }) => {
            const {originX, originY, overlayX, overlayY} = formValue;
            if (this.overlayRef) {
                this.overlayRef.dispose();
            }
            const componentPortal: ComponentPortal<TooltipComponent> = new ComponentPortal(TooltipComponent, this.viewContainerRef);
            const positions: ConnectedPosition[] = [{originX, originY, overlayX, overlayY}];
            const positionStrategy: PositionStrategy = this.overlay.position()
                .flexibleConnectedTo(this.tooltipHostElement.nativeElement)
                .withLockedPosition(true)
                .withPositions(positions);
            const overlayConfig: OverlayConfig = new OverlayConfig({
                positionStrategy,
                maxWidth: '20vw',
                hasBackdrop: false,
                disposeOnNavigation: true,
                scrollStrategy: this.overlay.scrollStrategies.reposition({
                    scrollThrottle: 0,
                    autoClose: false
                })
            });
            this.overlayRef = this.overlay.create(overlayConfig);
            this.tooltipComponentRef = this.overlayRef.attach(componentPortal);
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
