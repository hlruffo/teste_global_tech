from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
 
from ..serializers import PessoaSerializer
from ..services import PessoaService


class PessoaListCreateView(APIView):
    """
    GET  /api/pessoas/          → listar todas
    GET  /api/pessoas/?q=termo  → pesquisar
    POST /api/pessoas/          → criar
    """

    def get(self, request):
        query = request.query_params.get("q", "").strip()
        pessoas = (
            PessoaService.pesquisar(query) if query else PessoaService.listar_todos()
        )
        serializer = PessoaSerializer(pessoas, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = PessoaSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        dto = serializer.to_dto()
        pessoa = PessoaService.criar_pessoa(dto)
        return Response(
            PessoaSerializer(pessoa).data,
            status=status.HTTP_201_CREATED,
        )


class PessoaDetailView(APIView):
    """
    GET    /api/pessoas/<id>/  → buscar por id
    PUT    /api/pessoas/<id>/  → atualizar
    DELETE /api/pessoas/<id>/  → excluir
    """

    def get(self, request, pk):
        pessoa = PessoaService.buscar_pessoa(pk)
        return Response(PessoaSerializer(pessoa).data)

    def put(self, request, pk):
        serializer = PessoaSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        dto = serializer.to_dto()
        updated = PessoaService.atualizar_pessoa(pk, dto)
        return Response(PessoaSerializer(updated).data)

    def delete(self, request, pk):
        PessoaService.excluir_pessoa(pk)
        return Response(status=status.HTTP_204_NO_CONTENT)


class PesoIdealView(APIView):
    """GET /api/pessoas/<id>/peso-ideal/"""

    def get(self, request, pk):
        result = PessoaService.calcular_peso_ideal(pk)
        return Response(result)