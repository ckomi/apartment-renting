import { Component, OnInit } from '@angular/core';
import { StoreService } from './store.service';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-ngrx-store',
  templateUrl: './ngrx-store.component.html',
  styleUrls: ['./ngrx-store.component.css']
})

export class NgrxStoreComponent implements OnInit{

  records:any = []

  constructor(private storeData: StoreService, private sharedService: SharedService){
    storeData.getLocations().subscribe((records) => {
      this.records = records;
    });    
  }

  showAllPins() {
    this.sharedService.reqAllPins();
  }


  showFitPins() {
    this.sharedService.reqFitPins();
  }

  singleMarker: any = []
  
  onMarkerChoose(singleMarker: any){
    singleMarker = singleMarker    
    this.sharedService.setMarker(singleMarker);
  }

  ngOnInit() {}
}


