import {
  Directive,
  ElementRef,
  Renderer2,
  OnInit,
  AfterViewInit,
  OnDestroy,
  Inject,
  Input,
} from '@angular/core';
import * as signature_pad from 'signature_pad';
import { DOCUMENT } from '@angular/platform-browser';

const SignaturePad = signature_pad.default;

@Directive({ selector: '[appSignaturePad]' })
export class SignaturePadDirective implements OnInit, AfterViewInit, OnDestroy {
  canvas: HTMLCanvasElement;
  signaturePad: signature_pad.default;
  _option = { backgroundColor: '#fff' };

  @Input()
  set option(o: signature_pad.IOptions) {
    Object.assign(this._option, o);
  }

  @Input() afterInit: (s: signature_pad.default) => void;

  constructor(
    private el: ElementRef,
    private render: Renderer2,
    @Inject(DOCUMENT) private doc: Document,
  ) {}

  get isEmpty() {
    return !!(this.signaturePad && this.signaturePad.isEmpty());
  }

  ngOnInit() {
    const cav = this.doc.createElement('canvas');
    cav.style.cssText = 'width:100%;height:100%';
    const el: HTMLElement = this.el.nativeElement;
    el.appendChild(cav);
    this.canvas = cav;
  }

  ngAfterViewInit() {
    // When zoomed out to less than 100%, for some very strange reason,
    // some browsers report devicePixelRatio as less than 1
    // and only part of the canvas is cleared then.
    const cav = this.canvas;
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    cav.width = cav.offsetWidth * ratio;
    cav.height = cav.offsetHeight * ratio;
    cav.getContext('2d').scale(ratio, ratio);
    const s = new SignaturePad(cav, this._option);
    this.signaturePad = s;
    if (typeof this.afterInit === 'function') {
      this.afterInit(s);
    }
  }

  saveAsPng() {
    return this.signaturePad.toDataURL('image/png');
  }

  saveAsJpg() {
    return this.signaturePad.toDataURL('image/jpeg');
  }

  saveAsSvg() {
    return this.signaturePad.toDataURL('image/svg+xml');
  }

  switchToDraw() {
    const cav = this.canvas.getContext('2d');
    cav.globalCompositeOperation = 'source-over';
  }

  switchToErase() {
    const cav = this.canvas.getContext('2d');
    cav.globalCompositeOperation = 'destination-out';
  }

  clear() {
    this.signaturePad.clear();
  }

  ngOnDestroy() {}
}
