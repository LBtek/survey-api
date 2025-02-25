# Responder enquete

> ## Caso de sucesso

1. ✅ Recebe uma requisição do tipo **PUT** na rota **/api/user/surveys/{survey_id}**
2. ✅ A rota não deve ter autenticação
3. ✅ Valida o parâmetro **survey_id**
4. ✅ Valida se o campo **answer** é uma resposta válida
5. ✅ **Cria** um convidado com os dados fornecidos caso não tenha um registro
6. ✅ **Atualiza** um convidado com os dados fornecidos caso já tenha um registro
7. ✅ **Cria** um resultado de enquete com os dados fornecidos caso não tenha um registro
8. ✅ **Atualiza** um resultado de enquete com os dados fornecidos caso já tenha um registro
9. ✅ Retorna **200** com os dados do resultado da enquete, ids e status do convidado

> ## Exceções

1. ✅ Retorna erro **404** se a API não existir
2. ✅ Retorna erro **403** se for colocado qualquer nível de autorização na rota
3. ✅ Retorna erro **403** se o survey_id passado na URL for inválido
4. ✅ Retorna erro **403** se a resposta de enquete enviada pelo client for uma resposta inválida
5. ✅ Retorna erro **403** se, ao tentar criar o convidado, o email fornecido já estiver em uso por um usuário
6. ✅ Retorna erro **500** se der erro ao tentar criar o convidado
7. ✅ Retorna erro **500** se der erro ao tentar atualizar o convidado
8. ✅ Retorna erro **500** se der erro ao tentar criar o resultado da enquete
9. ✅ Retorna erro **500** se der erro ao tentar atualizar o resultado da enquete
10. ✅ Retorna erro **500** se der erro ao tentar carregar a enquete