import { Component, computed, input, output } from '@angular/core';
import { LucideChevronLeft, LucideChevronRight} from '@lucide/angular'

@Component({
  selector: 'app-pagination',
  imports: [LucideChevronRight,LucideChevronLeft],
  templateUrl: './pagination.html',
  styleUrl: './pagination.css',
})
export class Pagination {
  currentPage=input<number>(1);
  pages=input<number>(1);
  pageChange=output<number>();

  visiblePages=computed(()=>{
    const total=this.pages();
    const current=this.currentPage();
    const delta=2;

    const start=Math.max(1,current-delta);
    const end=Math.min(total, current+delta);

    return Array.from({length:end-start+1},(_,i)=>start+i);
  });

  prevPage(){
    this.pageChange.emit(this.currentPage()-1);
  }
  
  nextPage(){
    this.pageChange.emit(this.currentPage()+1);
  }
  
  goToPage(page: number){
    this.pageChange.emit(page);
  }

  firstPage(page:number){
    this.pageChange.emit(1);
  }
}
