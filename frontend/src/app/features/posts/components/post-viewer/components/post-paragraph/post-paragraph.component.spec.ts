import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostParagraphComponent } from './post-paragraph.component';

describe('PostParagraphComponent', () => {
  let component: PostParagraphComponent;
  let fixture: ComponentFixture<PostParagraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostParagraphComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostParagraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
