import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BaseNodeComponent } from '../base-node.component';
import { EditableDirective } from '../../directives/editable.directive';
import { PostParagraph } from '../../../../models/PostParagraph';

@Component({
  selector: 'app-post-paragraph',
  standalone: true,
  imports: [CommonModule, EditableDirective],
  templateUrl: './post-paragraph.component.html',
  styleUrl: './post-paragraph.component.scss'
})
export class PostParagraphComponent extends BaseNodeComponent<PostParagraph> {
}
