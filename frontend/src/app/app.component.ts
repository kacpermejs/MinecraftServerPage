import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { map, Observable, Subscription, tap } from 'rxjs';
import { HealthCheckService } from './core/services/health-check/health-check.service';
import { ConfigService } from './core/services/config/config.service';
import { AuthService } from './core/services/auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'MinecraftServerFrontend';
  menuOpen = false;
  private routerSubscription?: Subscription;

  configService = inject(ConfigService);

  apiUrl = this.configService.readConfig().API_URL;

  isLoggedIn$: Observable<boolean>;

  constructor(
    private router: Router,
    private healthCheck: HealthCheckService,
    private authService: AuthService
  ) {
    this.isLoggedIn$ = authService.getAuthState().pipe(
      tap(s => console.log(s)),
      map(s => s ? true : false)
    );
  }

  ngOnInit() {
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.menuOpen = false; // Close the menu after navigation
      }
    });
    this.configService.setConfig().then(console.log);
    this.healthCheck.getData().subscribe(console.log);
  }

  toggleMenu() {
    console.log('toggle');
    this.menuOpen = !this.menuOpen;
  }

  onLogout() {
    this.authService.signOut();
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
}
