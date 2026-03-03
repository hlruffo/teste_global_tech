export interface Pessoa {
    id?: number;
    nome: string;
    data_nasc: string;
    cpf: string;
    sexo: 'M' | 'F';
    altura: number;
    peso: number;
}

export interface PesoIdealResponse {
    pessoa_id: number;
    nome: string;
    sexo: string;
    altura: number;
    peso_atual: number;
    peso_ideal: number;
}