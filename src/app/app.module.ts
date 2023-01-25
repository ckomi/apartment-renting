import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';


import { AppComponent } from './app.component';
import { MapWindowComponent } from './map-window/map-window.component';
import { NgrxStoreComponent } from './ngrx-store/ngrx-store.component';
import { StoreModule } from './ngrx-store/store.module';

@NgModule({
    declarations: [
        AppComponent,
        MapWindowComponent,
        NgrxStoreComponent
    ],
    providers: [],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        StoreModule,
        HttpClientModule
    ]
})
export class AppModule { }
