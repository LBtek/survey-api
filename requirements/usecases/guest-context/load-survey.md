# Resultado da enquete

> ## Caso de sucesso

1. ✅ Recebe uma requisição do tipo **GET** na rota **/api/guest/surveys/{survey_id}**
2. ✅ A rota não deve ter autenticação
3. ✅ Retorna **200** com os dados do resultado da enquete

> ## Exceções

1. ✅ Retorna erro **404** se a API não existir
2. ✅ Retorna erro **403** se for colocado qualquer nível de autorização na rota
3. ✅ Retorna erro **400** se não for válido o surveyId
4. ✅ Retorna erro **403** se não existir a enquete
5. ✅ Retorna erro **500** se der erro ao tentar listar o resultado da enquete