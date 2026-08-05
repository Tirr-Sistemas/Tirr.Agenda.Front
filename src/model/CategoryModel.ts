/* eslint-disable @typescript-eslint/no-namespace */
import { ServiceModel } from "./ServiceModel"

export class CategoryModel {
  public title: string
  public services: ServiceModel[]

  constructor(data: CategoryModel.Input) {
    this.title = data.title
    this.services = data.services.map(s => new ServiceModel(s))
  }
}

export namespace CategoryModel {
  export type Input = {
    title: string
    services: ServiceModel.Input[]
  }
}
