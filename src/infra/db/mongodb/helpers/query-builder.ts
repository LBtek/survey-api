export class MongoAggregateQueryBuilder {
  private readonly query = []

  match (data: object): MongoAggregateQueryBuilder {
    this.query.push({
      $match: data
    })
    return this
  }

  set (data: object): MongoAggregateQueryBuilder {
    this.query.push({
      $set: data
    })
    return this
  }

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
