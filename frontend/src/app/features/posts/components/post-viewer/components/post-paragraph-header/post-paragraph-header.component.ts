import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditableDirective } from '../../directives/editable.directive';
import { BaseNodeComponent } from '../base-node.component';
import { PostParagraphHeader } from '../../../../models/PostParagraphHeader';

@Component({
  selector: 'app-post-paragraph-header',
  standalone: true,
  imports: [CommonModule, EditableDirective],
  templateUrl: './post-paragraph-header.component.html',
  styleUrl: './post-paragraph-header.component.scss'
})
export class PostParagraphHeaderComponent extends BaseNodeComponent<PostParagraphHeader> {
}
