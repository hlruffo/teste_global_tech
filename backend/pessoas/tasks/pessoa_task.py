from ..models import Pessoa


class PessoaTask:
    @staticmethod
    def criar(
        nome: str, data_nasc, cpf: str, sexo: str, altura: float, peso: float
    ) -> Pessoa:
        return Pessoa.objects.create(
            nome=nome,
            data_nasc=data_nasc,
            cpf=cpf,
            sexo=sexo,
            altura=altura,
            peso=peso,
        )

    @staticmethod
    def buscar_por_id(pessoa_id: int) -> Pessoa | None:
        return Pessoa.objects.filter(pk=pessoa_id).first()

    @staticmethod
    def buscar_por_cpf(cpf: str) -> Pessoa | None:
        return Pessoa.objects.filter(cpf=cpf).first()

    @staticmethod
    def buscar_por_nome(nome: str) -> list[Pessoa]:
        return list(Pessoa.objects.filter(nome__icontains=nome))

    @staticmethod
    def atualizar(
        pessoa: Pessoa,
        nome: str,
        data_nasc,
        cpf: str,
        sexo: str,
        altura: float,
        peso: float,
    ) -> Pessoa:
        pessoa.nome = nome
        pessoa.data_nasc = data_nasc
        pessoa.cpf = cpf
        pessoa.sexo = sexo
        pessoa.altura = altura
        pessoa.peso = peso
        pessoa.save()
        return pessoa

    @staticmethod
    def excluir(pessoa: Pessoa) -> None:
        pessoa.delete()

    @staticmethod
    def listar_todos() -> list[Pessoa]:
        return list(Pessoa.objects.all())
