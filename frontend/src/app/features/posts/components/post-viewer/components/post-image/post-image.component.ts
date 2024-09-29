import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BaseNodeComponent } from '../base-node.component';
import { EditableDirective } from '../../directives/editable.directive';
import { PostContentAsImagePipe } from "../../pipes/post-content-as-image.pipe";

@Component({
  selector: 'app-post-image',
  standalone: true,
  imports: [CommonModule, EditableDirective, PostContentAsImagePipe],
  templateUrl: './post-image.component.html',
  styleUrl: './post-image.component.scss'
})
export class PostImageComponent extends BaseNodeComponent {
}
