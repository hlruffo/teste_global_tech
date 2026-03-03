# Sistema de Cadastro de Pessoas

Aplicação full-stack para gerenciamento de pessoas com cálculo de peso ideal.

---

## Tecnologias

| Camada     | Tecnologia                          |
|------------|-------------------------------------|
| Frontend   | Angular 17 (Standalone Components)  |
| Backend    | Django 5 + Django REST Framework    |
| Banco      | PostgreSQL                          |
| Estilização| CSS (componentes isolados)          |

---

## Arquitetura Geral

```
┌─────────────────────────────────────────────────────────────────┐
│                        NAVEGADOR                                │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                  Angular (Frontend)                       │  │
│  │                                                           │  │
│  │   ┌─────────────────────────────────────────────────┐    │  │
│  │   │             PessoaPageComponent                 │    │  │
│  │   │            (orquestrador principal)             │    │  │
│  │   │                                                 │    │  │
│  │   │  ┌──────────────┐   ┌──────────────────────┐   │    │  │
│  │   │  │  PessoaSearch│   │    PessoaForm         │   │    │  │
│  │   │  │  Component   │   │    Component          │   │    │  │
│  │   │  │              │   │                       │   │    │  │
│  │   │  │ [Pesquisar]  │   │ nome / data_nasc      │   │    │  │
│  │   │  │ [Resultados] │   │ cpf / sexo            │   │    │  │
│  │   │  └──────────────┘   │ altura / peso         │   │    │  │
│  │   │                     │                       │   │    │  │
│  │   │                     │ [Incluir] [Alterar]   │   │    │  │
│  │   │                     │ [Excluir] [Peso Ideal]│   │    │  │
│  │   │                     └──────────────────────┘   │    │  │
│  │   │                                                 │    │  │
│  │   │              ┌──────────────────────┐           │    │  │
│  │   │              │  PesoIdealModal       │           │    │  │
│  │   │              │  Component           │           │    │  │
│  │   │              │  (peso atual x ideal) │           │    │  │
│  │   │              └──────────────────────┘           │    │  │
│  │   └─────────────────────────────────────────────────┘    │  │
│  │                         │                                 │  │
│  │               ┌─────────▼──────────┐                     │  │
│  │               │   PessoaService    │                     │  │
│  │               │  (HTTP Client)     │                     │  │
│  │               └─────────┬──────────┘                     │  │
│  └─────────────────────────┼─────────────────────────────────┘  │
│                             │  HTTP / JSON                       │
└─────────────────────────────┼───────────────────────────────────┘
                              │
              ┌───────────────▼───────────────────┐
              │         Django (Backend)           │
              │                                   │
              │  ┌────────────────────────────┐   │
              │  │       urls.py              │   │
              │  │  /api/pessoas/             │   │
              │  │  /api/pessoas/<id>/        │   │
              │  │  /api/pessoas/<id>/peso-   │   │
              │  │              ideal/        │   │
              │  └──────────────┬─────────────┘   │
              │                 │                 │
              │  ┌──────────────▼─────────────┐   │
              │  │    PessoaController        │   │
              │  │ (ListCreate / Detail /     │   │
              │  │  PesoIdeal Views)          │   │
              │  └──────────────┬─────────────┘   │
              │                 │                 │
              │  ┌──────────────▼─────────────┐   │
              │  │    PessoaSerializer        │   │
              │  │ (validação + to_dto())     │   │
              │  └──────────────┬─────────────┘   │
              │                 │                 │
              │  ┌──────────────▼─────────────┐   │
              │  │    PessoaService           │   │
              │  │ (regras de negócio)        │   │
              │  └──────────────┬─────────────┘   │
              │                 │                 │
              │  ┌──────────────▼─────────────┐   │
              │  │    PessoaTask              │   │
              │  │ (operações no banco)       │   │
              │  └──────────────┬─────────────┘   │
              │                 │                 │
              └─────────────────┼─────────────────┘
                                │
                  ┌─────────────▼─────────────┐
                  │        PostgreSQL          │
                  │      tabela: pessoa        │
                  │                           │
                  │  id | nome | cpf | sexo   │
                  │  data_nasc | altura | peso │
                  └───────────────────────────┘
```

---

## Fluxo de Dados

```
Usuário
  │
  ├─► Pesquisar pessoa
  │     Frontend → GET /api/pessoas/?q=<termo>
  │     Backend busca por CPF (exato) ou nome (parcial)
  │     ◄─ Lista de resultados
  │
  ├─► Selecionar pessoa
  │     Preenche o formulário (CPF desabilitado)
  │     Habilita botões Alterar / Excluir / Peso Ideal
  │
  ├─► Incluir
  │     Frontend → POST /api/pessoas/
  │     Backend valida campos + unicidade do CPF
  │     ◄─ 201 Created | 400/409 com erros no formulário
  │
  ├─► Alterar
  │     Frontend → PUT /api/pessoas/<id>/
  │     Backend valida campos (CPF não pode ser alterado)
  │     ◄─ 200 OK | 400 com erros
  │
  ├─► Excluir
  │     Confirmação no frontend
  │     Frontend → DELETE /api/pessoas/<id>/
  │     ◄─ 204 No Content | 404 Not Found
  │
  └─► Calcular Peso Ideal
        Frontend → GET /api/pessoas/<id>/peso-ideal/
        Backend aplica fórmula por sexo
        ◄─ Modal com peso atual vs peso ideal
```

---

## API — Endpoints

| Método   | Rota                          | Descrição                       |
|----------|-------------------------------|---------------------------------|
| `GET`    | `/api/pessoas/`               | Lista todas as pessoas          |
| `GET`    | `/api/pessoas/?q=<termo>`     | Busca por nome ou CPF           |
| `POST`   | `/api/pessoas/`               | Cria nova pessoa                |
| `GET`    | `/api/pessoas/<id>/`          | Retorna uma pessoa              |
| `PUT`    | `/api/pessoas/<id>/`          | Atualiza uma pessoa             |
| `DELETE` | `/api/pessoas/<id>/`          | Exclui uma pessoa               |
| `GET`    | `/api/pessoas/<id>/peso-ideal/` | Calcula peso ideal            |

---

## Cálculo de Peso Ideal

```
Masculino:  peso_ideal = (72.7 × altura) − 58
Feminino:   peso_ideal = (62.1 × altura) − 44.7
```

---

## Estrutura de Pastas

```
projeto/
├── docker-compose.yml               # Orquestração dos containers
├── frontend/                        # Angular
│   ├── Dockerfile                   # Imagem Node 20 + Angular CLI
│   ├── .dockerignore
│   ├── proxy.conf.docker.json       # Proxy /api → backend (Docker)
│   └── src/app/
│       ├── components/
│       │   ├── pessoa-page/         # Orquestrador principal
│       │   ├── pessoa-form/         # Formulário CRUD
│       │   ├── pessoa-search/       # Busca de pessoas
│       │   └── peso-ideal-modal/    # Modal de resultado
│       ├── models/
│       │   ├── pessoa.model.ts      # Interfaces Pessoa e PesoIdealResponse
│       │   └── api-error.model.ts   # Interface ApiError
│       ├── services/
│       │   └── pessoa.service.ts    # Cliente HTTP
│       ├── app.routes.ts            # Rotas Angular
│       └── app.config.ts            # Configuração DI
│
└── backend/                         # Django
    ├── Dockerfile                   # Imagem Python 3.12 + migrations automáticas
    ├── .dockerignore
    ├── .env.docker                  # Variáveis de ambiente para Docker
    ├── core/
    │   ├── settings.py              # Configurações (DB, CORS, logging)
    │   └── urls.py                  # Rota raiz → /api/pessoas/
    └── pessoas/
        ├── models/pessoa.py         # Model Pessoa (ORM)
        ├── controllers/             # Views DRF (ListCreate, Detail, PesoIdeal)
        ├── serializers/             # Validação + conversão para DTO
        ├── services/                # Regras de negócio
        ├── tasks/                   # Operações no banco de dados
        ├── dtos/                    # PessoaDTO (dataclass)
        ├── exceptions.py            # Erros customizados + handler
        ├── admin.py                 # Interface admin Django
        └── urls.py                  # Rotas da app
```

---

## Como Executar

### Com Docker (recomendado)

Pré-requisitos: [Docker](https://docs.docker.com/get-docker/) e [Docker Compose](https://docs.docker.com/compose/install/) instalados.

```bash
docker compose up --build
```

Isso sobe os três serviços:

| Serviço    | Imagem base          | Porta  |
|------------|----------------------|--------|
| `db`       | postgres:16-alpine   | 5432   |
| `backend`  | python:3.12-slim     | 8000   |
| `frontend` | node:20-alpine       | 4200   |

- O banco PostgreSQL inicia com healthcheck — o backend só sobe após o banco estar pronto.
- As migrations rodam automaticamente na inicialização do container backend.
- O frontend usa um proxy (`proxy.conf.docker.json`) que encaminha `/api` para o container `backend:8000`.
- Os diretórios `./backend` e `./frontend` são montados como volumes, permitindo hot-reload em desenvolvimento.

Acesse: [http://localhost:4200](http://localhost:4200)
Admin Django: [http://localhost:8000/admin](http://localhost:8000/admin)

Para parar os serviços:

```bash
docker compose down
```

Para parar e remover os dados do banco:

```bash
docker compose down -v
```

---

### Sem Docker (manual)

#### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env       # configurar variáveis de ambiente
python manage.py migrate
python manage.py runserver
```

#### Frontend

```bash
cd frontend
npm install
ng serve
```

Acesse: [http://localhost:4200](http://localhost:4200)
Admin Django: [http://localhost:8000/admin](http://localhost:8000/admin)
