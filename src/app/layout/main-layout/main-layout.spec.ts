import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainLayout } from './main-layout';
import { RouterTestingModule } from '@angular/router/testing';
import { provideRouter } from '@angular/router';

describe('MainLayout', () => {
  let component: MainLayout;
  let fixture: ComponentFixture<MainLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainLayout],
      providers:[provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(MainLayout);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should show 3 links', () => {
    fixture.detectChanges();
    const compiled=fixture.nativeElement as HTMLElement;
    const links=compiled.querySelectorAll('nav a');

    expect(links.length).toBe(3);
  });

  it('should show the correct text for each link',()=>{
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const links = compiled.querySelectorAll('nav a');

    expect(links[0].textContent?.trim()).toBe('Menús');
    expect(links[1].textContent?.trim()).toBe('Recetas');
    expect(links[2].textContent?.trim()).toBe('Ingredientes');
  });

  it('should have a router-outlet', () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('router-outlet')).not.toBeNull();
  });

});
