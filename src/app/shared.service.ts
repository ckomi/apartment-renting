import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private allPinsSub = new Subject();
  reqAllPins(){
    this.allPinsSub.next(void 0);
  }
  respAllPins():Observable<any>{
    return this.allPinsSub.asObservable();
  }

  private fitPinsSub = new Subject();
  reqFitPins(){
    this.fitPinsSub.next(void 0);
  }
  respFitPins():Observable<any>{
    return this.fitPinsSub.asObservable();
  }

  // SELECTED MARKER COORDS 
  private oneMarker$ = new Subject();
  selectedMarker$ = this.oneMarker$.asObservable();
  
  setMarker(oneMarker:any){
    this.oneMarker$.next(oneMarker)
  }

}
