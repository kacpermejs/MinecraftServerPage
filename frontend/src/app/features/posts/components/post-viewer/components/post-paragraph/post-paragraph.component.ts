import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BaseNodeComponent } from '../base-node.component';
import { EditableDirective } from '../../directives/editable.directive';
import { PostContentAsParagraphPipe } from "../../pipes/post-content-as-paragraph.pipe";

@Component({
  selector: 'app-post-paragraph',
  standalone: true,
  imports: [CommonModule, EditableDirective, PostContentAsParagraphPipe],
  templateUrl: './post-paragraph.component.html',
  styleUrl: './post-paragraph.component.scss'
})
export class PostParagraphComponent extends BaseNodeComponent{
}
