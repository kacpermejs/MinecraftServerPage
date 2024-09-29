import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostParagraphHeaderComponent } from './post-paragraph-header.component';

describe('PostParagraphHeaderComponent', () => {
  let component: PostParagraphHeaderComponent;
  let fixture: ComponentFixture<PostParagraphHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostParagraphHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostParagraphHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
