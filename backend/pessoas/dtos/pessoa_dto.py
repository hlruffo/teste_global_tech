from dataclasses import dataclass
from datetime import date


@dataclass
class PessoaDTO:
    nome: str
    data_nasc: date
    cpf: str
    sexo: str
    altura: float
    peso: float
    id: int | None = None
