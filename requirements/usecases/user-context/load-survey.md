# Resultado da enquete

> ## Caso de sucesso

1. ✅ Recebe uma requisição do tipo **GET** na rota **/api/user/surveys/{survey_id}**
2. ✅ Valida se a requisição foi feita por um **usuário**
4. ✅ Retorna **200** com os dados do resultado da enquete

> ## Exceções

1. ✅ Retorna erro **404** se a API não existir
2. ✅ Retorna erro **403** se não for um usuário
2. ✅ Retorna erro **403** se não existir a enquete
3. ✅ Retorna erro **500** se der erro ao tentar listar o resultado da enquete