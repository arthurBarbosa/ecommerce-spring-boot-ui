import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdutcListComponent } from './produtc-list.component';

describe('ProdutcListComponent', () => {
  let component: ProdutcListComponent;
  let fixture: ComponentFixture<ProdutcListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProdutcListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProdutcListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
