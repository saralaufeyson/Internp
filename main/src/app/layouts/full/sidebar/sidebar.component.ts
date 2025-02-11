import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { NavItem } from './nav-item/nav-item';
import { navItems } from './sidebar-data';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [TablerIconsModule, MaterialModule, RouterModule],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {

  @Input() showToggle = true;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();

  isLoggedIn = false;
  userRole: string | null = null;
  filteredNavItems: NavItem[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.userRole = this.authService.getRole();
    this.filterNavItems();
  }

  filterNavItems() {
    this.filteredNavItems = navItems.filter((item) =>
      item.roles?.includes(this.userRole as string) || item.roles?.includes('guest')
    );
  }

  logout(): void {
    this.authService.logout();
    window.location.reload(); // Refresh to apply role-based UI updates
  }
}
