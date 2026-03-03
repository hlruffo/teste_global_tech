from rest_framework import serializers

from ..dtos import PessoaDTO
from ..models import Pessoa


class PessoaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pessoa
        fields = ['id', 'nome', 'data_nasc', 'cpf', 'sexo', 'altura', 'peso']

    def validate_sexo(self, value: str) -> str:
        if value not in ('M', 'F'):
            raise serializers.ValidationError("Sexo deve ser 'M' ou 'F'")
        return value

    def validate_altura(self, value: float) -> float:
        if value <= 0:
            raise serializers.ValidationError('Altura deve ser maior que zero.')
        return value

    def validate_peso(self, value: float) -> float:
        if value <= 0:
            raise serializers.ValidationError('Peso deve ser maior que zero.')
        return value

    def to_dto(self) -> PessoaDTO:
        data = self.validated_data
        return PessoaDTO(
            id=self.instance.id if self.instance else None,
            nome=data['nome'],
            data_nasc=data['data_nasc'],
            cpf=data['cpf'],
            sexo=data['sexo'],
            altura=data['altura'],
            peso=data['peso'],
        )
