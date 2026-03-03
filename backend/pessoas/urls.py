from django.urls import path

from .controllers import (
    PesoIdealView,
    PessoaDetailView,
    PessoaListCreateView,
)

urlpatterns = [
    path('', PessoaListCreateView.as_view(), name='pessoa-list-create'),
    path('<int:pk>/', PessoaDetailView.as_view(), name='pessoa-detail'),
    path('<int:pk>/peso-ideal/', PesoIdealView.as_view(), name='pessoa-peso-ideal'),
]
