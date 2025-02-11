import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { NavItem } from './nav-item/nav-item';
import { AuthService } from 'src/app/services/auth.service';
import { navItems } from './sidebar-data';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports:[CommonModule]
})
export class SidebarComponent implements OnInit {
  @Input() showToggle = true;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();

  navItems: NavItem[] = [];
  filteredNavItems: NavItem[] = [];
  userRole: string | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.userRole = this.authService.getRole();
    // console.log('User Role:', this.userRole);
    this.loadNavItems();
  }
  isNavItemVisible(item: NavItem): boolean {
    return (item.roles?.includes(this.userRole as string) ?? false) || (item.roles?.includes('guest') ?? false);
  }
  // loadNavItems(): void {
  //   this.navItems = navItems;
  //   this.filteredNavItems = this.navItems.filter(item => this.isNavItemVisible(item));
  // }

loadNavItems(): void {
  this.navItems = navItems;
  if (this.userRole === 'intern') {
    this.filteredNavItems = this.navItems.filter(item => item.roles?.includes('intern'));
    console.log('Intern Nav Items:', this.filteredNavItems);
  } else if (this.userRole === 'admin') {
    this.filteredNavItems = this.navItems.filter(item => item.roles?.includes('admin'));
    console.log('Admin Nav Items:', this.filteredNavItems);
  } else {
    this.filteredNavItems = this.navItems.filter(item => this.isNavItemVisible(item));
  }
}
}