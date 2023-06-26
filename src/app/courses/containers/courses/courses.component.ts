import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, Observable, of } from 'rxjs';
import { ErrorDialogComponent } from 'src/app/shared/components/error-dialog/error-dialog.component';

import { Course } from '../../model/course';
import { CoursesService } from '../../services/courses.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent {

  //$ indica que é um Observable
  courses$: Observable<Course[]>;

    pageIndex = 0;
  pageSize = 10;

  displayedColumns = ['name', 'category', 'actions'];

  //A variável pode ser inicializada no construtor
  constructor(
    private coursesService: CoursesService,
    private dialog: MatDialog,
    private router: Router,
    private activedRoute: ActivatedRoute,
    private snackBar: MatSnackBar) {
    //this.courses = [];

    this.courses$ = this.coursesService.list()
      .pipe(
        catchError(error => {
          this.onError('Erro ao carregar cursos.');
          return of([]);
        })
    );
  }

  refresh() {
    this.courses$ = this.coursesService.list()
      .pipe(
        catchError(error => {
          this.onError('Erro ao carregar cursos.');
          return of([]);
        })
    );
  }

  onError(errorMsg: string) {
    this.dialog.open(ErrorDialogComponent, {
      data: errorMsg
    });
  }

  onAdd() {
    this.router.navigate(['new'], {relativeTo: this.activedRoute});
  }

  onEdit(course: Course) {
    this.router.navigate(['edit', course._id], {relativeTo: this.activedRoute});
  }

  onRemove(course: Course) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: 'Tem certeza que deseja remover esse curso?'
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.coursesService.remove(course._id).subscribe({
          next: () => {
            this.refresh();
            this.snackBar.open('Curso removido com sucesso!', 'X', {
              duration: 5000,
              verticalPosition: 'top',
              horizontalPosition: 'center'
            });
          },
          error: () => this.onError('Erro ao tentar remover curso.')
        });
      }
    });
  }
}
