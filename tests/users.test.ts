
describe('GET /v1/user', () => {
  it('deve retornar os dados do usuário com status 200', async () => {
    const response = await request.get('/v1/user');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: 1,
      name: 'Teste',
      email: 'teste@teste.com',
    });
  });
});
