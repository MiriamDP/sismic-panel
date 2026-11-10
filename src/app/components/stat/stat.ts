import { Component, input } from '@angular/core';
import { LucideDynamicIcon, LucideIconInput, LucideX } from '@lucide/angular';

@Component({
  selector: 'app-stat',
  imports: [LucideDynamicIcon],
  templateUrl: './stat.html',
  styleUrl: './stat.css',
})
export class Stat {
  title=input<string>();
  value=input();
  subtitle=input();
  icon=input<LucideIconInput>(LucideX);
}
