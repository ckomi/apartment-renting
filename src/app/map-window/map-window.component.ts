import { map, Subscription } from 'rxjs';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import maplibregl, { Map, NavigationControl, Marker, LngLatBounds, LngLat, GeolocateControl } from 'maplibre-gl';
import { StoreService } from '../ngrx-store/store.service';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-map-window',
  templateUrl: './map-window.component.html',
  styleUrls: ['./map-window.component.css']
})

export class MapWindowComponent implements OnInit, AfterViewInit, OnDestroy {

  showAllPinsSubscription: Subscription;
  fitAllPinsSubscription: Subscription;
  map!: Map;

  @ViewChild('map')
  private mapContainer!: ElementRef<HTMLElement>;

  constructor(private storeData: StoreService, private sharedService: SharedService, private cdRef:ChangeDetectorRef) { 

    // ON CLICK BUTTON SHOW ALL PINS
    this.showAllPinsSubscription = this.sharedService.respAllPins().subscribe(()=>{
      this.showPinsOnMap()      
    });

    // ON CLICK BUTTON FIT TO ALL PINS
    this.fitAllPinsSubscription = this.sharedService.respFitPins().subscribe(()=>{
      this.fitPinsOnMap()
    });

    // ON CLICK RECORD SHOW ITS PIN
    this.sharedService.selectedMarker$.subscribe((value)=>{
      this.currentMarker = value;
      this.locations = [this.currentMarker.geocode.longitude, this.currentMarker.geocode.latitude];
      this.addOnePin();
    });

    // DATA FOR MARKERS
    storeData.getLocations().subscribe((records) => {
      this.geoLocation = records;
    });
  }

  oneMarker = new Marker ({color: "#FF0000"})
  currentMarker:any = [];

  addOnePin(){
      this.removePins();
      const popupContent = this.markerPopup(this.currentMarker)
      this.oneMarker.setLngLat(this.locations)
      .setPopup(new maplibregl.Popup({closeButton: false, closeOnMove: true}).setDOMContent(popupContent))
      .setDraggable(true)
      .addTo(this.map)
      const sw = new LngLat(this.currentMarker.geocode.longitude, this.currentMarker.geocode.latitude);
      const ne = new LngLat(this.currentMarker.geocode.longitude, this.currentMarker.geocode.latitude);
      const bounds = new LngLatBounds(sw, ne);

      this.map.fitBounds(bounds, { maxZoom: 17 });
  }

  locations:any = [];
  allMarkers:any = [];
  
  showPinsOnMap(){
    this.removePins();
    this.geoLocation.forEach((location:any) => {  
      this.locations = [location.geocode.longitude, location.geocode.latitude];
      // POPUP with click event
      const popupContent = this.markerPopup(location)
      const atag = document.createElement('button');
      atag.innerHTML = `ZOOM TO`;
      popupContent.appendChild(atag); 
      atag.addEventListener('click', (e)=>{
        const sw = new LngLat(location.geocode.longitude, location.geocode.latitude);
        const ne = new LngLat(location.geocode.longitude, location.geocode.latitude);
        const oneBound = new LngLatBounds(sw, ne);
        this.map.fitBounds(oneBound, { maxZoom: 17 });
      })
      // MARKER
      var marker = new Marker ({color: "#FF0000"})
      marker.setLngLat(this.locations)
      .setPopup(new maplibregl.Popup({closeButton: false, closeOnMove: true}).setDOMContent(popupContent))
      .addTo(this.map)
      this.allMarkers.push(marker)
    });
  }

  geoLocation:any = [];

  fitPinsOnMap(){  
    this.showPinsOnMap();
    const sw = new LngLat(this.geoLocation[0].geocode.longitude, this.geoLocation[0].geocode.latitude);
    const ne = new LngLat(this.geoLocation[0].geocode.longitude, this.geoLocation[0].geocode.latitude);
    const bounds = new LngLatBounds(sw, ne);
    for (const location of this.geoLocation) {
      bounds.extend(new LngLat(location.geocode.longitude, location.geocode.latitude));
    }
    this.map.fitBounds(bounds, { maxZoom: 17 });
  }

  markerPopup(location:any){
    const popupContent = document.createElement('div');
    popupContent.innerHTML = 
    `<img src="${location.photo}"  width="100%">
    <h3>${location.name}</h3>
    <p>${location.streetAddress}, ${location.state}</p>`;
    return popupContent;
  }

  removePins(){
    if(this.allMarkers.length){
      for (var i = this.allMarkers.length - 1; i >= 0; i--) {
        this.allMarkers[i].remove();
      }
      this.allMarkers = [];
    }
  }

  ngOnInit() {  }
  
  initialState = { lng: -96.80069, lat: 32.781439, zoom: 14 };

  ngAfterViewInit() {
    this.map = new maplibregl.Map({
      container: this.mapContainer.nativeElement,
      style: `https://api.maptiler.com/maps/eef16200-c4cc-4285-9370-c71ca24bb42d/style.json?key=SoL71Zyf7SmLrVYWC7fQ`,
      center: [this.initialState.lng, this.initialState.lat],
      zoom: this.initialState.zoom
    });
    const userLocation = new GeolocateControl({ positionOptions: { enableHighAccuracy: true }, trackUserLocation: true });
    const navControl = new NavigationControl({ showCompass: true, showZoom: true, visualizePitch: true });
    this.map.addControl(navControl);
    this.map.addControl(userLocation);
  }

  ngOnDestroy() {
    this.map?.remove();
  }

}

