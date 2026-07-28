import type { CategoryModel } from "@/model/CategoryModel";
import { ServiceModel } from "@/model/ServiceModel";

import { API_AGENDA } from "@/service/AgendaApi";

import type {
  GetFuncionariosResponseDto,
  GetServicoResponseDto,
  GetServicoResponseDto__Result
} from "@/service/AgendaApi/types";

/**
 * =========================================================
 * LOAD SERVICES USE CASE
 * =========================================================
 * @description
 * Caso de uso responsável por:
 *
 * - Buscar funcionários disponíveis
 * - Buscar serviços do primeiro funcionário encontrado
 * - Agrupar serviços por categoria
 * - Converter DTOs da API em Models de domínio
 *
 * Fluxo:
 * 1. Recupera funcionários
 * 2. Seleciona primeiro funcionário
 * 3. Busca serviços vinculados ao funcionário
 * 4. Agrupa serviços por código da categoria
 * 5. Converte dados para CategoryModel + ServiceModel
 *
 * Retorno:
 * - Lista de categorias contendo serviços agrupados.
 */
const loadServiceUseCase = async (): Promise<CategoryModel[]> => {

  /**
   * =====================================================
   * FUNCIONÁRIOS
   * =====================================================
   */
  const funcionarios: GetFuncionariosResponseDto | null =
    await API_AGENDA.getFuncionarios();

  /**
   * =====================================================
   * VALIDAÇÃO FUNCIONÁRIOS
   * =====================================================
   */
  if (!funcionarios?.result?.length) {
    return [];
  }

  /**
   * =====================================================
   * FUNCIONÁRIO SELECIONADO
   * =====================================================
   */
  const funcionarioSelecionado = funcionarios.result[0];

  /**
   * =====================================================
   * SERVIÇOS
   * =====================================================
   */
  const servicosResponse: GetServicoResponseDto | null =
    await API_AGENDA.getServicos(
      funcionarioSelecionado.id
    );

  /**
   * =====================================================
   * VALIDAÇÃO SERVIÇOS
   * =====================================================
   */
  if (!servicosResponse?.result?.length) {
    return [];
  }

  /**
   * =====================================================
   * AGRUPAMENTO POR CATEGORIA
   * =====================================================
   * @description
   * Organiza os serviços utilizando o código da categoria
   * como chave principal.
   *
   * Estrutura:
   * {
   *   [categoriaCodigo]: {
   *     id: string
   *     title: string
   *     services: ServicoDto[]
   *   }
   * }
   */
  const servicesByCategory = servicosResponse.result.reduce(
    (
      accumulator: Record<
        string,
        {
          id: string;
          title: string;
          services: GetServicoResponseDto__Result[];
        }
      >,
      service: GetServicoResponseDto__Result
    ) => {

      const categoryCode = String(service.codigoCategoria);

      if (!accumulator[categoryCode]) {

        accumulator[categoryCode] = {
          id: categoryCode,
          title: service.nomeCategoria,
          services: []
        };

      }

      accumulator[categoryCode].services.push(service);

      return accumulator;

    },
    {}
  );

  /**
   * =====================================================
   * DTO -> DOMAIN MODEL
   * =====================================================
   */
  const categories: CategoryModel[] = Object.values(
    servicesByCategory
  ).map((category) => {

    return {

      id: category.id,

      title: category.title,

      services: category.services.map((service) => {

        return new ServiceModel({

          id: service.id.toString(),

          image:
            "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=400&h=400&fit=crop",

          name: service.nome,

          description: service.descricao ?? "...",

          price: service.valor

        });

      })

    };

  });

  /**
   * =====================================================
   * RETURN
   * =====================================================
   */
  return categories;

};

export default loadServiceUseCase;