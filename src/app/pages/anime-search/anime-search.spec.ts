import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimeSearch } from './anime-search';

describe('AnimeSearch', () => {
  let component: AnimeSearch;
  let fixture: ComponentFixture<AnimeSearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnimeSearch],
    }).compileComponents();

    fixture = TestBed.createComponent(AnimeSearch);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
