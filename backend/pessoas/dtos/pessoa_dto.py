from dataclasses import dataclass
from datetime import date 
from typing import Optional


@dataclass
class PessoaDTO:
    nome: str
    data_nasc: date
    cpf: str
    sexo: str
    altura: float
    peso: float 
    id: Optional[int] = None