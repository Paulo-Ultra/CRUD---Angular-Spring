import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { Course } from '../model/course';
import { CoursesService } from '../services/courses.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent {

  //$ indica que é um Observable
  courses$: Observable<Course[]>;

  displayedColumns = ['name', 'category'];

  //A variável pode ser inicializada no construtor
  constructor(private coursesService: CoursesService) {
    //this.courses = [];

    this.courses$ = this.coursesService.list();
  }
}
