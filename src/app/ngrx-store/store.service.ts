import { Injectable } from '@angular/core';
import { map, mergeMap, of, toArray } from 'rxjs';
import { HttpClient } from '@angular/common/http';

// TODO change to IRecords
export interface RecordsInterface {
  records:{
    name: string;
    streetAddress: string;
    city: string;
    state: string;
    geocode: {
      Longitude: string;
      Latitude: string;
    };
    photo: string;
  }[]
}

@Injectable({
  providedIn: 'root'
})

export class StoreService {

  private url = 'https://app.smartapartmentdata.com/List/json/listItems.aspx?listID=7892472&token=AD6110320424834934DE62FD2935A49264B6D947'

  constructor(private http: HttpClient){}
  
    getLocations(){
      return this.http.get<RecordsInterface>(this.url).pipe(
        map(i => i.records),
        mergeMap(location => of(...location)),
        map(location => {
          return {
            name: location.name,
            streetAddress: location.streetAddress,
            city: location.city,
            state: location.state,
            geocode: {
              longitude: location.geocode.Longitude,
              latitude: location.geocode.Latitude
            },
            photo: location.photo
          }
        }),
        toArray()
      )
    }
}


