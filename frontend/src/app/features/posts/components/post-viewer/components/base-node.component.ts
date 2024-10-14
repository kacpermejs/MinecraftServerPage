import { Input, Output, EventEmitter, OnChanges, SimpleChanges, Directive } from '@angular/core';
import { cloneDeep } from 'lodash';

import { PostContent } from '../../../models/PostContent';

@Directive()
export abstract class BaseNodeComponent<T extends PostContent> implements OnChanges {
  @Input() node!: T;
  @Input() isEditing = false;
  @Input() parentPostId!: string;
  @Output() updateNode = new EventEmitter<T>();  // Event to emit updates to the parent

  originalNode!: T;  // To hold the original data for canceling changes

  // Lifecycle hook to store the original node when inputs change
  ngOnChanges(changes: SimpleChanges) {
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