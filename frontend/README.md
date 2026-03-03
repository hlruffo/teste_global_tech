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
├── frontend/                        # Angular
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

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env       # configurar variáveis de ambiente
python manage.py migrate
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
ng serve
```

Acesse: [http://localhost:4200](http://localhost:4200)
Admin Django: [http://localhost:8000/admin](http://localhost:8000/admin)
