import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { HealthCheckService } from './core/health-check.service/health-check.service';
import { ConfigService } from './core/config.service/config.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'MinecraftServerFrontend';
  menuOpen = false;
  private routerSubscription?: Subscription ;

  configService = inject(ConfigService);

  apiUrl = this.configService.readConfig().API_URL;

  constructor(private router: Router, private healthCheck: HealthCheckService) {}

  ngOnInit() {
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.menuOpen = false; // Close the menu after navigation
      }
    });

    console.log(this.configService.readConfig().API_URL);
    this.healthCheck.getData().subscribe(console.log);
  }

  toggleMenu() {
    console.log("toggle");
    this.menuOpen = !this.menuOpen;
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
}
