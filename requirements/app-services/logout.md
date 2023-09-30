# Login

> ## Caso de sucesso

1. ✅ Recebe uma requisição do tipo **GET** na rota **/api/logout**
1. ✅ Recebe uma requisição do tipo **POST** na rota **/api/logout**
4. ✅ **Busca** o usuário autenticado pelo ip e token de acesso
6. ✅ **Remove** a autenticação pelo ip e token de acesso
7. ✅ Retorna **204**

> ## Exceções

5. ✅ Retorna erro **500** se der erro ao tentar desautenticar pelo token de acesso