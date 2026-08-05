/* eslint-disable @typescript-eslint/no-namespace */
import { ServiceModel } from "./ServiceModel";

export class ScheduleModel {

  /**
   * Serviço selecionado pelo usuário.
   */
  chosenService: ServiceModel;

  /**
   * Dia selecionado para o agendamento.
   */
  chosenDay: number;

  /**
   * Ano selecionado para o agendamento.
   */
  chosenYear: number;

  /**
   * Mês selecionado para o agendamento.
   *
   * FORMATO:
   * 0 = Janeiro
   * 11 = Dezembro
   */
  chosenMonth: number;

  /**
   * Hora selecionada para o agendamento.
   *
   * FORMATO:
   * HH:mm
   *
   * Exemplo:
   * 09:30
   * 14:00
   */
  chosenHour: string;

  /**
   * Nome completo do cliente.
   */
  name: string;

  /**
   * Email do cliente.
   */
  email: string;

  /**
   * Telefone do cliente.
   */
  phone: string;

  constructor(data: ScheduleModel.Input) {
    this.chosenService = data.chosenService
    this.chosenDay = data.chosenDay
    this.chosenHour = data.chosenHour
    this.chosenMonth = data.chosenMonth
    this.chosenYear = data.chosenYear
    this.name = data.name
    this.email = data.email
    this.phone = data.phone

    this.assertValid()
  }

  /**
   * Retorna a data completa do agendamento.
   */
  public getDate(): Date {
    const [hours, minutes] = this.chosenHour.split(":").map(Number)

    return new Date(
      this.chosenYear,
      this.chosenMonth,
      this.chosenDay,
      hours,
      minutes
    )
  }

  /**
   * Verifica se o model está válido.
   */
  public isValid(): boolean {
    return (
      this.hasValidService() &&
      this.hasValidName() &&
      this.hasValidEmail() &&
      this.hasValidPhone() &&
      this.hasValidDay() &&
      this.hasValidMonth() &&
      this.hasValidYear() &&
      this.hasValidHour() &&
      this.hasFutureDate()
    )
  }

  /**
   * Garante que o model esteja válido.
   */
  public assertValid(): void {

    if (!this.hasValidService()) {
      throw new Error("Serviço inválido")
    }

    if (!this.hasValidName()) {
      throw new Error("Nome inválido")
    }

    if (!this.hasValidEmail()) {
      throw new Error("Email inválido")
    }

    if (!this.hasValidPhone()) {
      throw new Error("Telefone inválido")
    }

    if (!this.hasValidDay()) {
      throw new Error("Dia inválido")
    }

    if (!this.hasValidMonth()) {
      throw new Error("Mês inválido")
    }

    if (!this.hasValidYear()) {
      throw new Error("Ano inválido")
    }

    if (!this.hasValidHour()) {
      throw new Error("Horário inválido")
    }

    if (!this.hasFutureDate()) {
      throw new Error("A data do agendamento deve ser futura")
    }
  }

  // ---------------------------------------------------
  // VALIDADORES
  // ---------------------------------------------------

  /**
   * Valida o serviço.
   */
  private hasValidService(): boolean {
    return (
      this.chosenService instanceof ServiceModel &&
      this.chosenService.isValid()
    )
  }

  /**
   * Nome:
   * - obrigatório
   * - mínimo 3 caracteres
   */
  private hasValidName(): boolean {
    return (
      typeof this.name === "string" &&
      this.name.trim().length >= 3
    )
  }

  /**
   * Email válido.
   */
  private hasValidEmail(): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)
  }

  /**
   * Telefone:
   * - mínimo 10 dígitos
   * - máximo 11 dígitos
   */
  private hasValidPhone(): boolean {

    const digits = this.phone.replace(/\D/g, "")

    return digits.length >= 10 && digits.length <= 11
  }

  /**
   * Dia válido.
   */
  private hasValidDay(): boolean {
    return (
      Number.isInteger(this.chosenDay) &&
      this.chosenDay >= 1 &&
      this.chosenDay <= 31
    )
  }

  /**
   * Mês válido.
   */
  private hasValidMonth(): boolean {
    return (
      Number.isInteger(this.chosenMonth) &&
      this.chosenMonth >= 0 &&
      this.chosenMonth <= 11
    )
  }

  /**
   * Ano válido.
   */
  private hasValidYear(): boolean {

    const currentYear = new Date().getFullYear()

    return (
      Number.isInteger(this.chosenYear) &&
      this.chosenYear >= currentYear
    )
  }

  /**
   * Hora válida no formato HH:mm.
   */
  private hasValidHour(): boolean {

    if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(this.chosenHour)) {
      return false
    }

    const [hours, minutes] = this.chosenHour
      .split(":")
      .map(Number)

    return (
      hours >= 0 &&
      hours <= 23 &&
      minutes >= 0 &&
      minutes <= 59
    )
  }

  /**
   * A data do agendamento
   * precisa ser futura.
   */
  private hasFutureDate(): boolean {

    const date = this.getDate()

    return date.getTime() > Date.now()
  }
}

export namespace ScheduleModel {

  /**
   * Estrutura de entrada
   * para criação do agendamento.
   */
  export type Input = {
    chosenService: ServiceModel
    chosenDay: number
    chosenMonth: number
    chosenHour: string
    chosenYear: number
    name: string
    email: string
    phone: string
  }
}
