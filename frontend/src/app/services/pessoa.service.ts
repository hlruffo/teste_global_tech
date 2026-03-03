import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pessoa, PesoIdealResponse } from '../models/pessoa.model';

@Injectable({ providedIn: 'root' })
export class PessoaService {
    private readonly apiUrl = '/api/pessoas';

    constructor(private http: HttpClient) {}

    listar(): Observable<Pessoa[]> {
        return this.http.get<Pessoa[]>(`${this.apiUrl}/`);
    }

    pesquisar(query: string): Observable<Pessoa[]> {
        const params = new HttpParams().set('q', query);
        return this.http.get<Pessoa[]>(`${this.apiUrl}/`, { params });
    }

    criar(pessoa: Pessoa): Observable<Pessoa> {
        return this.http.post<Pessoa>(`${this.apiUrl}/`, pessoa);
    }

    atualizar(id: number, pessoa: Pessoa): Observable<Pessoa> {
        return this.http.put<Pessoa>(`${this.apiUrl}/${id}/`, pessoa);
    }

    excluir(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}/`);
    }

    calcularPesoIdeal(id: number): Observable<PesoIdealResponse> {
        return this.http.get<PesoIdealResponse>(`${this.apiUrl}/${id}/peso-ideal/`);
    }
}


