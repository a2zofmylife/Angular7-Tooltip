import { Directive, Input, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[tooltip]'
})
export class TooltipDirective {

  @Input('tooltip') tooltipTitle: string;
  @Input() placement: string;
  @Input() delay: string;
  tooltip: HTMLElement;
  
  private wasInside: boolean = false;

  
  offset : number = 10;

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  @HostListener('click',['$event.target']) onButtonClick() {
    if (!this.tooltip ) {
    this.wasInside = true;
      this.show();
     }
     
  }

  @HostListener('document:keydown.escape',['$event.target']) onEscape(event) {
    if (this.tooltip)  { 

      this.hide(); 
      
    }
  }
  @HostListener('document:click',['$event.target']) outsideClick(targetElement) {

    const clickedInside = this.el.nativeElement.contains(targetElement);
   
    if (!this.wasInside == true && !clickedInside) { 

      this.hide(); 
      
    }
    this.wasInside = false;
  }

  @HostListener('document:scroll',['$event.target']) documentScroll(targetElement) {
    
    const scrollYPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const scrollXPos = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0;
    if(this.placement ==="top"&& scrollYPos == document.documentElement.scrollTop )
    {
      this.placement="bottom";
    }
    else
    {
      this.placement="top";
    }

  this.setPosition();
   
    
  }


  show() {
    this.create();
    this.setPosition();
    this.renderer.addClass(this.tooltip, 'ng-tooltip-show');
  }

  hide() {
    this.renderer.removeClass(this.tooltip, 'ng-tooltip-show');
  
    window.setTimeout(() => {
      this.renderer.removeChild(document.body, this.tooltip);
      this.tooltip = null;
    });
  }

  create() {
    this.tooltip = this.renderer.createElement('span');

    this.renderer.appendChild(
      this.tooltip,
      this.renderer.createText(this.tooltipTitle) // textNode
    );

    this.renderer.appendChild(document.body, this.tooltip);
   

    this.renderer.addClass(this.tooltip, 'ng-tooltip');
    this.renderer.addClass(this.tooltip, `ng-tooltip-${this.placement}`);

   
    this.renderer.setStyle(this.tooltip, '-webkit-transition', `opacity ${this.delay}ms`);
    this.renderer.setStyle(this.tooltip, '-moz-transition', `opacity ${this.delay}ms`);
    this.renderer.setStyle(this.tooltip, '-o-transition', `opacity ${this.delay}ms`);
    this.renderer.setStyle(this.tooltip, 'transition', `opacity ${this.delay}ms`);
  }

  setPosition() {
    
    const hostPos = this.el.nativeElement.getBoundingClientRect();

    
    const tooltipPosition = this.tooltip.getBoundingClientRect();

    
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

    let top, left;

    if (this.placement === 'top') {
      top = hostPos.top - tooltipPosition.height - this.offset;
      left = hostPos.left + (hostPos.width - tooltipPosition.width) / 2;
    }

    if (this.placement === 'bottom') {
      top = hostPos.bottom + this.offset;
      left = hostPos.left + (hostPos.width - tooltipPosition.width) / 2;
    }

    if (this.placement === 'left') {
      top = hostPos.top + (hostPos.height - tooltipPosition.height) / 2;
      left = hostPos.left - tooltipPosition.width - this.offset;
    }

    if (this.placement === 'right') {
      top = hostPos.top + (hostPos.height - tooltipPosition.height) / 2;
      left = hostPos.right + this.offset;
    }

    
    this.renderer.setStyle(this.tooltip, 'top', `${top + scrollPosition}px`);
    this.renderer.setStyle(this.tooltip, 'left', `${left}px`);
  }
}
