/* describe('loadByToken()', () => {
  test('Should return an user account on loadByToken without role', async () => {
    const sut = makeSut()
    const { accountId } = await sut.add(mockAddAccountParams())
    await sut.updateAccessToken({ accountId, accessToken })
    const account = await sut.loadByToken({ accessToken })
    expect(account).toBeTruthy()
    expect(account.accountId).toBeTruthy()
    expect(account.userId).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email@mail.com')
  })

  test('Should return an account on loadByToken with publisher role', async () => {
    const sut = makeSut()
    const { accountId } = await sut.add(mockAddAccountParams())
    await sut.updateAccessToken({ accountId, accessToken })
    await accountCollection.updateOne(
      { _id: new ObjectId(accountId) },
      { $set: { role: 'publisher' } }
    )
    const account = await sut.loadByToken({ accessToken, role: 'publisher' })
    expect(account).toBeTruthy()
    expect(account.accountId).toBeTruthy()
    expect(account.userId).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email@mail.com')
  })

  test('Should return null on loadByToken with invalid role', async () => {
    const sut = makeSut()
    const { accountId } = await sut.add(mockAddAccountParams())
    await sut.updateAccessToken({ accountId, accessToken })
    const account = await sut.loadByToken({ accessToken, role: 'publisher' })
    expect(account).toBeFalsy()
  })

  test('Should return an account on loadByToken if user is admin', async () => {
    const sut = makeSut()
    const { accountId } = await sut.add(mockAddAccountParams())
    await sut.updateAccessToken({ accountId, accessToken })
    await accountCollection.updateOne(
      { _id: new ObjectId(accountId) },
      { $set: { role: 'admin' } }
    )
    const account = await sut.loadByToken({ accessToken })
    expect(account).toBeTruthy()
    expect(account.accountId).toBeTruthy()
    expect(account.userId).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email@mail.com')
  })

  test('Should return null if loadByToken returns null', async () => {
    const sut = makeSut()
    const account = await sut.loadByToken({ accessToken })
    expect(account).toBeFalsy()
  })
}) */
