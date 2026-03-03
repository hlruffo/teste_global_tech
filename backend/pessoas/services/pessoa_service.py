import logging

from ..dtos import PessoaDTO
from ..exceptions import CPFDuplicadoError, PessoaNaoEncontradaError
from ..models import Pessoa
from ..tasks import PessoaTask

logger = logging.getLogger(__name__)


class PessoaService:
    @staticmethod
    def criar_pessoa(dto: PessoaDTO) -> Pessoa:
        if PessoaTask.buscar_por_cpf(dto.cpf):
            raise CPFDuplicadoError(f"CPF '{dto.cpf}' já cadastrado")

        pessoa = PessoaTask.criar(
            nome=dto.nome,
            data_nasc=dto.data_nasc,
            cpf=dto.cpf,
            sexo=dto.sexo,
            altura=dto.altura,
            peso=dto.peso,
        )
        logger.info("Pessoa criada: id= %d, nome=%s", pessoa.pk, pessoa.nome)
        return pessoa


    @staticmethod
    def atualizar_pessoa(pessoa_id: int, dto: PessoaDTO) -> Pessoa:
        pessoa = PessoaTask.buscar_por_id(pessoa_id)
        if not pessoa:
            raise PessoaNaoEncontradaError(
                f"Pessoa com id={pessoa_id} não encontrada."
            )

        existente = PessoaTask.buscar_por_cpf(dto.cpf)
        if existente and existente.pk != pessoa_id:
            raise CPFDuplicadoError(
                f"CPF '{dto.cpf}' já cadastrado para outra pessoa."
            )

        pessoa = PessoaTask.atualizar(
            pessoa=pessoa,
            nome=dto.nome,
            data_nasc=dto.data_nasc,
            cpf=dto.cpf,
            sexo=dto.sexo,
            altura=dto.altura,
            peso=dto.peso,
        )
        logger.info("Pessoa atualizada: id=%d", pessoa.pk)
        return pessoa

    @staticmethod
    def excluir_pessoa(pessoa_id: int) -> None:
        pessoa = PessoaTask.buscar_por_id(pessoa_id)
        if not pessoa:
            raise PessoaNaoEncontradaError(
                f"Pessoa com id={pessoa_id} não encontrada."
            )
        PessoaTask.excluir(pessoa)
        logger.info("Pessoa excluída: id=%d", pessoa_id)

    @staticmethod
    def pesquisar(query: str) -> list[Pessoa]:
        by_cpf = PessoaTask.buscar_por_cpf(query)
        if by_cpf:
            return [by_cpf]
        return PessoaTask.buscar_por_nome(query)

    @staticmethod
    def calcular_peso_ideal(pessoa_id: int) -> dict:
        pessoa = PessoaTask.buscar_por_id(pessoa_id)
        if not pessoa:
            raise PessoaNaoEncontradaError(
                f"Pessoa com id={pessoa_id} não encontrada."
            )
        return {
            'pessoa_id': pessoa.pk,
            'nome': pessoa.nome,
            'sexo': pessoa.sexo,
            'altura': pessoa.altura,
            'peso_atual': pessoa.peso,
            'peso_ideal': pessoa.calcular_peso_ideal(),
        }

    @staticmethod                                                                                                                                                                                      
    def buscar_pessoa(pessoa_id: int) -> Pessoa:      
        pessoa = PessoaTask.buscar_por_id(pessoa_id)
        if not pessoa:
            raise PessoaNaoEncontradaError(
                f"Pessoa com id={pessoa_id} não encontrada."
            )
        return pessoa

    @staticmethod
    def listar_todos() -> list[Pessoa]:
        return PessoaTask.listar_todos()