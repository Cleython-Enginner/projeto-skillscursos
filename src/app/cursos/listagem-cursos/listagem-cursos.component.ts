import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
import { CursosService } from 'src/app/core/cursos.service';
import { Curso } from 'src/app/shared/models/curso';
import { ConfigPrams } from 'src/app/shared/models/config-prams';




@Component({
  selector: 'dio-listagem-cursos',
  templateUrl: './listagem-cursos.component.html',
  styleUrls: ['./listagem-cursos.component.scss']
})
export class ListagemCursosComponent implements OnInit {
  readonly semFoto = 'https://www.termoparts.com.br/wp-content/uploads/2017/10/no-image.jpg';

  config: ConfigPrams = {
    pagina: 0,
    limite: 4
  };
  cursos: Curso[] = [];
  filtrosListagem: FormGroup;
  areas: Array<string>;

  constructor(private cursosService: CursosService,
              private fb: FormBuilder,
              private router: Router) { }

  ngOnInit(): void {
    this.filtrosListagem = this.fb.group({
      texto: [''],
      area: ['']
    });

    this.filtrosListagem.get('texto').valueChanges
    .pipe(debounceTime(400))
    .subscribe((val: string) => {
      this.config.pesquisa = val;
      this.resetarConsulta();
    });

    this.filtrosListagem.get('area').valueChanges.subscribe((val: string) => {
      this.config.campo = {tipo: 'area', valor: val};
      this.resetarConsulta();
    });

    this.areas = ['Front-end', 'Back-end', 'Mobile', 'Frameworks', 'Ciências de Dados', 'Engenharia de Software', 'Aquitetura de Software', 'Cybersecurity'];

    this.listarCursos();
  }

  onScroll(): void {
    this.listarCursos();
  }

  abrir(id: number): void {
    this.router.navigateByUrl('/cursos/' + id);
  }

  private listarCursos(): void {
    this.config.pagina++;
    this.cursosService.listar(this.config)
   .subscribe((cursos: Curso []) => this.cursos.push(...cursos));
  }

  private resetarConsulta(): void {
    this.config.pagina = 0;
    this.cursos = [];
    this.listarCursos();
  }
}
