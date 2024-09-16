import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appDropdown]',
  standalone: true
})
export class DropdownDirective {
  @HostBinding('class.open') isOpen = false;

  @HostListener('click') toggleOpen() {
    this.isOpen = !this.isOpen;
  }

  // Optional: close the dropdown when clicked outside
  @HostListener('document:click', ['$event']) closeDropdown(event: Event) {
    const targetElement = event.target as HTMLElement;  // Cast to HTMLElement
    if (!targetElement.closest('.dropdown')) {
      this.isOpen = false;
    }
  }
}
