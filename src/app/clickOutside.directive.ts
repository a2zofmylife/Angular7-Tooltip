import { Directive, Input, ElementRef, HostListener, Renderer2, Output } from '@angular/core';
import { EventEmitter } from 'events';

@Directive({
  selector: '[clickOutside]'
})
export class ClickOutsideDirective  {


  constructor(private el: ElementRef, private renderer: Renderer2) { }

  @Output()
  public clickOutside = new EventEmitter();

  @HostListener('document:click', ['$event.target'])
    public onClick(targetElement) {
      const clickedInside = this.el.nativeElement.contains(targetElement);
      if (!clickedInside) {
          this.clickOutside.emit(null);
          alert('clicked outside listener');
    }
}
}
