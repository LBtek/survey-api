export class MongoAggregateQueryBuilder {
  private readonly query = []

  lookup (data: object): MongoAggregateQueryBuilder {
    this.query.push({
      $lookup: data
    })
    return this
  }

  project (data: object): MongoAggregateQueryBuilder {
    this.query.push({
      $project: data
    })
    return this
  }

  build (): object[] {
    return this.query
  }
}
