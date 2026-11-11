import { Component, input } from '@angular/core';
import { ImportJob } from '../../interfaces/import-job';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-import-list',
  imports: [DatePipe],
  templateUrl: './import-list.html',
  styleUrl: './import-list.css',
})
export class ImportList {
  imports = input<ImportJob[]>();
}
