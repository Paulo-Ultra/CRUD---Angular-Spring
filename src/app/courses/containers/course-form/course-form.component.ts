import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, UntypedFormArray, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';

import { CoursesService } from '../../services/courses.service';
import { Course } from '../../model/course';
import { Lesson } from '../../model/lesson';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.scss']
})
export class CourseFormComponent implements OnInit {

  //Inicializa a variavel sem precisar declará-la
  form!: FormGroup;

/*form = this.formBuilder.group({
  // Sem uso do NonNullableFormBuilder name: new FormControl<string>('', {nonNullable: true}),
  _id: [''],
  name: [
    '',
    [Validators.required,
    Validators.minLength(5),
    Validators.maxLength(100)]],
  category: ['', Validators.required],
});*/

  constructor(
    private formBuilder: NonNullableFormBuilder,
    private service: CoursesService,
    private snackBar: MatSnackBar,
    private location: Location,
    private activatedRoute: ActivatedRoute) {

  }

  ngOnInit(): void {
    //Caso venha vazio o course.resolver já faz esse serviço
    const course: Course = this.activatedRoute.snapshot.data['course'];
    this.form = this.formBuilder.group({
      _id: [course._id],
      name: [course.name, [Validators.required,
        Validators.minLength(5),
        Validators.maxLength(100)]],
      category: [course.category, [Validators.required]],
      lessons: this.formBuilder.array(this.retrieveLessons(course))
    });
    console.log(this.form);
    console.log(this.form.value);

    /*this.form.setValue({
      _id: course._id,
      name: course.name,
      category: course.category,
    });
    console.log(course);*/
  }

  private retrieveLessons(course: Course) {
    const lessons = [];
    if(course?.lessons) {
      course.lessons.forEach(lesson =>
        lessons.push(this.createLesson(lesson)));
    } else {
      lessons.push(this.createLesson());
    }
    return lessons;
  }

  private createLesson(lesson: Lesson = {id: '', name: '', youtubeUrl: ''}) {
    return this.formBuilder.group({
      id: [lesson.id],
      name: [lesson.name],
      youtubeUrl: [lesson.youtubeUrl]
    });
  }

  getLessonsFormArray() {
    return (<UntypedFormArray>this.form.get('lessons')).controls;
  }

  onSubmit() {
    this.service.save(this.form.value)
    .subscribe(result => this.onSucess(), error =>{
      this.onError();
    });
  }

  onCancel() {
    this.location.back();
  }

  getErrorMessage(fieldName: string) {
    const field = this.form.get(fieldName);
    // A interrogação faz a verificação se o campo não é nulo
    if(field?.hasError('required')) {
      return 'Campo obrigatório';
    }

    if(field?.hasError('minlength')) {
      const requiredLength = field.errors ? field.errors['minlength']['requiredLength'] : 5;
      return `Tamanho mínimo precisa ser de ${requiredLength} caracteres`;
    }

    if(field?.hasError('maxlength')) {
      const requiredLength = field.errors ? field.errors['maxlength']['requiredLength'] : 100;
      return `Tamanho máximo excedido de ${requiredLength} caracteres`;
    }

    return 'Campo Inválido';
  }

  private onSucess() {
    this.snackBar.open('Curso salvo com sucesso', '', {
      duration: 5000,
    });
    this.onCancel();
  }

  private onError() {
    this.snackBar.open('Erro ao salvar curso', '', {
      duration: 5000,
    });
  }
}
