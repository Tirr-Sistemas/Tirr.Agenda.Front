// import { formatToBRL } from "@/utils/formatToBRL"

export class ServiceModel {
  public id: string
  public image: string
  public name: string
  public description: string
  public price: number

  // /**
  //  * Preço formatado em moeda (BRL).
  //  *
  //  * Campo derivado do price.
  //  * Ex: "R$ 45,00"
  //  */
  // public priceFormatted: string

  constructor(data: ServiceModel.Input) {
    this.id = data.id
    this.image = data.image
    this.name = data.name
    this.description = data.description
    this.price = data.price

    // /**
    //  * Campo derivado calculado no momento da criação.
    //  */
    // this.priceFormatted = formatToBRL(data.price)

    this.assertValid()
  }

  public isValid(): boolean {
    return (
      this.hasValidId() &&
      this.hasValidName() &&
      this.hasValidDescription() &&
      this.hasValidImage() &&
      this.hasValidPrice()
    )
  }

  public assertValid(): void {
    if (!this.isValid()) {
      throw new Error("ServiceModel inválido")
    }
  }

  private hasValidId(): boolean {
    return typeof this.id === "string" && this.id.trim().length > 0
  }

  private hasValidName(): boolean {
    return typeof this.name === "string" && this.name.trim().length > 0
  }

  private hasValidDescription(): boolean {
    return typeof this.description === "string" && this.description.trim().length > 0
  }

  private hasValidImage(): boolean {
    return typeof this.image === "string" && this.image.trim().length > 0
  }

  private hasValidPrice(): boolean {
    return typeof this.price === "number" && this.price > 0
  }
}

export namespace ServiceModel {
  /**
   * Estrutura de entrada para criação do ServiceModel.
   */
  export type Input = {
    /**
     * Identificador único do serviço.
     */
    id: string

    /**
     * URL ou caminho da imagem do serviço.
     */
    image: string

    /**
     * Nome do serviço.
     */
    name: string

    /**
     * Descrição detalhada do serviço.
     */
    description: string

    /**
     * Preço do serviço.
     * Deve ser maior que zero.
     */
    price: number
  }
}