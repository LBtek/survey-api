# Listar enquetes

> ## Caso de sucesso

1. ✅ Recebe uma requisição do tipo **GET** na rota **/api/guest/surveys**
2. ✅ A rota não deve ter autenticação
3. ✅ Retorna **204** se não tiver nenhuma enquete
4. ✅ Retorna **200** com os dados das enquetes

> ## Exceções

1. ✅ Retorna erro **404** se a API não existir
2. ✅ Retorna erro **403** se for colocado qualquer nível de autorização na rota
3. ✅ Retorna erro **500** se der erro ao tentar listar as enquetes