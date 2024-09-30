import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BaseNodeComponent } from '../base-node.component';
import { EditableDirective } from '../../directives/editable.directive';
import { PostImage } from '../../../../models/PostImage';

@Component({
  selector: 'app-post-image',
  standalone: true,
  imports: [CommonModule, EditableDirective],
  templateUrl: './post-image.component.html',
  styleUrl: './post-image.component.scss'
})
export class PostImageComponent extends BaseNodeComponent<PostImage> {
}
