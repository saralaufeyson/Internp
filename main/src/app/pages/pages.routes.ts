import { Routes } from '@angular/router';
import { AllGoalsComponent } from '../components/all-goals/all-goals.component';
import { StarterComponent } from './starter/starter.component';
import { ProfileComponent } from '../components/profile/profile.component';
import { LearningPathComponent } from '../components/learning-path/learning-path.component';
import { GoalsComponent } from '../components/goals/goals.component';
import { PocProjectsComponent } from '../components/poc-projects/poc-projects.component';
import { InternListComponent } from '../intern-list/intern-list.component';
import { InternGuard } from '../guards/intern.guard'; // Import InternGuard
import { AdminGuard } from '../guards/admin.guard'; // Import AdminGuard
import { MentorListComponent } from '../mentor-list/mentor-list.component'; // Import MentorListComponent
import { MentorsWithInternsComponent } from '../components/mentors-with-interns/mentors-with-interns.component'; // Import the new component
import { MylearnComponent } from '../components/mylearn/mylearn.component'; // Import MyLearnComponent
import { AdmindashComponent } from '../components/admindash/admindash.component';
import { InternPlansComponent } from '../components/intern-plans/intern-plans.component';
import { MentorGuard } from '../guards/mentor.guard'; // Import MentorGuard
import { InternDashboardComponent } from '../components/intern-dashboard/intern-dashboard.component';
import { MentorDashComponent } from '../components/mentor-dash/mentor-dash.component';
import { internNavItems } from '../layouts/full/sidebar/sidebar-data';
import { InternFeedbackComponent } from '../components/intern-feedback/intern-feedback.component';

export const PagesRoutes: Routes = [
  {
    path: '',
    component: StarterComponent,
    data: {
      title: 'Dashboard',
      urls: [{ title: 'Dashboard', url: '/dashboard' }],
    },
  },
  {
    path: 'profile',
    component: ProfileComponent,
    //canActivate: [InternGuard], // Apply InternGuard
    data: {
      title: 'Profile',
      urls: [
        { title: 'Dashboard', url: '/dashboard' },
        { title: 'Profile' },
      ],
    },
  },
  {
    path: 'learningPath',
    component: LearningPathComponent,
    canActivate: [InternGuard], // Apply InternGuard
    data: {
      title: 'My Learning Path',
      urls: [
        { title: 'Dashboard', url: '/dashboard' },
        { title: 'My Learning Path' },
      ],
    },
  },
  {
    path: 'goals',
    component: GoalsComponent,
    canActivate: [InternGuard], // Apply InternGuard
    data: {
      title: 'My Goals',
      urls: [
        { title: 'Dashboard', url: '/dashboard' },
        { title: 'My Goals' },
      ],
    },
  },
  {
    path: 'pocProjects',
    component: PocProjectsComponent,
    canActivate: [InternGuard], // Apply InternGuard
    data: {
      title: 'My PoC Projects',
      urls: [
        { title: 'Dashboard', url: '/dashboard' },
        { title: 'My PoC Projects' },
      ],
    },
  },
  {
    path: 'admin',
    component: AdmindashComponent,
    canActivate: [AdminGuard], // Apply InternGuard
    data: {
      title: 'Admin Dashboard',
      urls: [
        { title: 'Dashboard', url: '/dashboard' },
        { title: 'Admin Dashboard' },
      ],
    },
  },
  {
    path: 'intern-list',
    component: InternListComponent,
    canActivate: [AdminGuard], // Apply AdminGuard
    data: {
      title: 'All Interns',
      urls: [
        { title: 'Dashboard', url: '/dashboard' },
        { title: 'All Interns' },
      ],
    },
  },
  {
    path: 'all-goals',
    component: AllGoalsComponent,
    canActivate: [AdminGuard], // Apply AdminGuard
    data: {
      title: 'All goals',
      urls: [
        { title: 'Dashboard', url: '/dashboard' },
        { title: 'All Interns' },
      ],
    },
  },
  {
    path: 'mentor-list',
    component: MentorListComponent,
    canActivate: [AdminGuard], // Apply AdminGuard
    data: {
      title: 'All Mentors',
      urls: [
        { title: 'Dashboard', url: '/dashboard' },
        { title: 'All Mentors' },
      ],
    },
  },
  {
    path: 'mentors-with-interns',
    component: MentorsWithInternsComponent,
    canActivate: [AdminGuard], // Apply AdminGuard
    data: {
      title: 'Mentors with Interns',
      urls: [
        { title: 'Dashboard', url: '/dashboard' },
        { title: 'Mentors with Interns' },
      ],
    },
  },
  {
    path: 'intern-feedback',
    component: InternFeedbackComponent,
    canActivate: [AdminGuard], // Apply AdminGuard
    data: {
      title: 'Intern Feedback',
      urls: [
        { title: 'Dashboard', url: '/dashboard' },
        { title: 'Intern Feedback' },
      ],
    },
  },
  {
    path: 'my-learning-status',
    component: MylearnComponent,
    canActivate: [InternGuard], // Apply InternGuard
    data: {
      title: 'My Learning Status',
      urls: [
        { title: 'Dashboard', url: '/dashboard' },
        { title: 'My Learning Status' },
      ],
    },
  },
  {
    path: 'intern-plans',
    component: InternPlansComponent,
    canActivate: [InternGuard], // Apply InternGuard
    data: {
      title: 'My Plans',
      urls: [
        { title: 'Dashboard', url: '/dashboard' },
        { title: 'My Learning Status' },
      ],
    },
  },
  {
    path: 'intern-dashboard',
    component: InternDashboardComponent,
    canActivate: [InternGuard], // Apply InternGuard
    data: {
      title: 'Intern Dashboard',
      urls: [
        { title: 'Dashboard', url: '/dashboard' },
        { title: 'Intern Dashboard' },
      ],
    },
  },
  {
    path: 'mentor',
    component: MentorDashComponent,
    canActivate: [MentorGuard], // Apply MentorGuard
   
    data: {
      title: 'MENTOR Dashboard',
      urls: [
        { title: 'Dashboard', url: '/dashboard' },
        { title: 'Intern Dashboard' },
      ],
    },
  },
  
];