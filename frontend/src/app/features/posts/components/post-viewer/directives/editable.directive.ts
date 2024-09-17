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

  @HostListener('paste', ['$event']) onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const text = event.clipboardData?.getData('text/plain'); // Get plain text only

    if (text) {
      this.insertTextAtCaret(text);
    }
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

  private insertTextAtCaret(text: string) {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents(); // Remove selected content, if any
      const textNode = document.createTextNode(text);
      range.insertNode(textNode);

      // Move the caret position after the inserted text
      range.setStartAfter(textNode);
      range.setEndAfter(textNode);
      selection.removeAllRanges();
      selection.addRange(range);
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
