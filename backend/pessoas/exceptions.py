import logging

from django.db import IntegrityError
from rest_framework.response import Response
from rest_framework.views import exception_handler

logger = logging.getLogger(__name__)


class PessoaNaoEncontradaError(Exception):
    pass


class CPFDuplicadoError(Exception):
    pass


def custom_exception_handler(exc, context):
    # Primeiro, tenta o handler padrão do DRF (ValidationError, AuthError, etc)
    response = exception_handler(exc, context)

    if response is not None:
        # Normalizar erros de validação do DRF para o formato padronizado
        if isinstance(response.data, dict) and 'detail' not in response.data:
            response.data = {
                'detail': 'Erro de validação.',
                'errors': response.data,
            }
        return response

    # Erros não tratados pelo DRF
    if isinstance(exc, PessoaNaoEncontradaError):
        return Response(
            {'detail': str(exc)},
            status=404,
        )

    if isinstance(exc, CPFDuplicadoError):
        return Response(
            {'detail': str(exc), 'errors': {'cpf': [str(exc)]}},
            status=409,
        )

    if isinstance(exc, IntegrityError):
        logger.warning('IntegrityError: %s', str(exc))
        return Response(
            {'detail': 'Registro duplicado ou violação de integridade.'},
            status=409,
        )

    # Erro inesperado — logar, mas não expor stack trace
    logger.error(
        'Erro inesperado em %s: %s',
        context.get('view', ''),
        str(exc),
        exc_info=True,
    )
    return Response(
        {'detail': 'Erro interno do servidor.'},
        status=500,
    )
