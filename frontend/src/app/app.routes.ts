import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { GalleryComponent } from './features/gallery/gallery.component';
import { MapViewerComponent } from './features/map-viewer/map-viewer.component';
import { RulesComponent } from './features/rules/rules.component';
import { PageNotFoundComponent } from './features/page-not-found/page-not-found.component';
import { EventsComponent } from './features/events/events.component';
import { LoginComponent } from './core/components/login/login.component';
import { RegisterComponent } from './core/components/register/register.component';

export const routes: Routes = [
    { path: '', redirectTo: "/home", pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'gallery', component: GalleryComponent },
    { path: 'map', component: MapViewerComponent },
    { path: 'events', component: EventsComponent },
    { path: 'rules', component: RulesComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: '**', component: PageNotFoundComponent },
];
