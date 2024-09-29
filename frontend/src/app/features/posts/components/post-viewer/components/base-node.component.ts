import { Input, Output, EventEmitter, OnChanges, SimpleChanges, Directive } from '@angular/core';
import { PostContent } from '../../../models/post';

import { cloneDeep } from 'lodash';

@Directive()
export abstract class BaseNodeComponent implements OnChanges {
  @Input() node!: PostContent;
  @Input() isEditing = false;
  @Output() updateNode = new EventEmitter<PostContent>();  // Event to emit updates to the parent

  originalNode!: PostContent;  // To hold the original data for canceling changes

  // Lifecycle hook to store the original node when inputs change
  ngOnChanges(changes: SimpleChanges) {
    console.log('Node:');
    console.log(this.node);

    if (changes['node'] && changes['node'].currentValue) {
      this.originalNode = cloneDeep(this.node)
    }
  }

  emitChanges() {
    this.updateNode.emit(this.node);
  }

  resetNode() {
    this.node = { ...this.originalNode };
  }

  onModelChange(data: any): void {
    this.node.data = {...this.node.data, ...data}
    this.emitChanges();
  }
}