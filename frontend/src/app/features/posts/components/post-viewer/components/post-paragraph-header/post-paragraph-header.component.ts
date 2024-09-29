import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditableDirective } from '../../directives/editable.directive';
import { BaseNodeComponent } from '../base-node.component';
import { PostContentAsParagraphHeaderPipe } from "../../pipes/post-content-as-paragraph-header.pipe";

@Component({
  selector: 'app-post-paragraph-header',
  standalone: true,
  imports: [CommonModule, EditableDirective, PostContentAsParagraphHeaderPipe],
  templateUrl: './post-paragraph-header.component.html',
  styleUrl: './post-paragraph-header.component.scss'
})
export class PostParagraphHeaderComponent extends BaseNodeComponent {
}
