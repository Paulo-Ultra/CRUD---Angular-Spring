import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  { path: '',   redirectTo: '/courses', pathMatch: 'full' },
  { path: 'courses', loadChildren: () => import('./courses/courses.routes').then(m => m.COURSES_ROUTES) },
  { path: 'students', loadComponent: () => import('./courses/containers/course-form/course-form.component')
    .then(c => c.CourseFormComponent)}
];
