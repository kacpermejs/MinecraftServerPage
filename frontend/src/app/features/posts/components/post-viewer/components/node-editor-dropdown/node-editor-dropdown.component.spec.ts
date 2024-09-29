import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeEditorDropdownComponent } from './node-editor-dropdown.component';

describe('NodeEditorDropdownComponent', () => {
  let component: NodeEditorDropdownComponent;
  let fixture: ComponentFixture<NodeEditorDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NodeEditorDropdownComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NodeEditorDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
