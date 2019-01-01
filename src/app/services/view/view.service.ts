import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ViewService {

  private subject = new Subject<any>();
  showTree: boolean = true;

  constructor() { }

  toggleTree(): void {
    this.showTree = !this.showTree;
    this.subject.next(this.showTree);
  };

  treeVisibilityListener(): Observable<any> {
    return this.subject.asObservable();
  }

}
