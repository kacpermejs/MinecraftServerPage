import { Component, inject, Input } from '@angular/core';
import { PostEditorService } from '../../services/post-editor.service';

@Component({
  selector: 'app-node-editor-dropdown',
  standalone: true,
  imports: [],
  templateUrl: './node-editor-dropdown.component.html',
  styleUrl: './node-editor-dropdown.component.scss'
})
export class NodeEditorDropdownComponent {
  @Input('index') index: number = -1;

  editor = inject(PostEditorService);
}
