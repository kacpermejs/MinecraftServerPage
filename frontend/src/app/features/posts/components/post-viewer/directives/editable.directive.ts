import { Directive, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appEditable]',
  standalone: true
})
export class EditableDirective {

  @Input() editedClass: string = 'edited';
  @Input() emptyClass: string = 'editable-empty';
  @Output() contentChanged: EventEmitter<string> = new EventEmitter();

  private originalContent: string = '';

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngAfterViewInit() {
    this.checkIfEmpty();
  }

  @HostListener('click') onClick() {
    if (!this.el.nativeElement.isContentEditable) {
      this.enableEdit();
    }
  }

  @HostListener('blur') onBlur() {
    if (this.el.nativeElement.isContentEditable) {
      this.disableEdit();
    }
  }

  private enableEdit() {
    this.originalContent = this.el.nativeElement.innerText;
    this.el.nativeElement.contentEditable = true;
    this.el.nativeElement.focus();
    this.renderer.addClass(this.el.nativeElement, 'editing');
  }

  private disableEdit() {
    const currentContent = this.el.nativeElement.innerText;

    if (currentContent !== this.originalContent) {
      this.renderer.addClass(this.el.nativeElement, this.editedClass);
      this.contentChanged.emit(currentContent);  // Emit the changed content
    }

    this.checkIfEmpty();

    this.el.nativeElement.contentEditable = false;
    this.renderer.removeClass(this.el.nativeElement, 'editing');
  }

  private checkIfEmpty() {
    const currentContent = this.el.nativeElement.innerText.trim(); // Trim spaces

    if (currentContent === '') {
      this.renderer.addClass(this.el.nativeElement, this.emptyClass); // Add empty class
    } else {
      this.renderer.removeClass(this.el.nativeElement, this.emptyClass); // Remove empty class if not empty
    }
  }
}
