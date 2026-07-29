/**
 * =========================================================
 * API ROUTES
 * =========================================================
 * @description Centralização dos endpoints utilizados pelo módulo de serviços.
 *
 * Benefícios:
 * - Redução de strings duplicadas no código
 * - Menor acoplamento entre camadas
 * - Facilidade de manutenção e versionamento de rotas
 * - Padronização de acesso à API
 */
const ROUTES = {
    CATEGORIES: "/categories",
    APPOINTMENTS: "/appointments"
} as const;

/**
 * =========================================================
 * AXIOS INSTANCE
 * =========================================================
 * @description Instância única do Axios responsável pela comunicação HTTP.
 *
 * Centraliza configurações como:
 * - baseURL
 * - timeout
 * - interceptors
 * - headers padrão
 */
import axios, { type AxiosInstance } from "axios";
import { authUtils } from "../../utils/auth";
import type {
    GetAppointmentResponseDto,
    GetCategoryResponseDto,
    PostToScheduleDto,
} from "./types";

const api: AxiosInstance = axios.create({
    baseURL: "http://localhost:3000/",
    timeout: 10000,
});

/**
 * =========================================================
 * REQUEST INTERCEPTOR
 * =========================================================
 * @description Injeta automaticamente o token de autenticação (Bearer Token)
 * em todas as requisições HTTP quando disponível.
 *
 * Responsável por garantir autenticação transparente entre chamadas.
 */
api.interceptors.request.use(
    (config) => {
        try {
            const token = authUtils.getToken();

            if (token) {
                config.headers = config.headers || {};
                config.headers.Authorization = `Bearer ${token}`;
            }

            return config;
        } catch {
            return config;
        }
    },
    (error) => Promise.reject(error)
);

/**
 * =========================================================
 * DEFAULT HEADERS
 * =========================================================
 * @description Cabeçalhos padrão aplicados em todas as requisições HTTP.
 *
 * Observação:
 * Valores sensíveis ou dinâmicos devem ser injetados via interceptors
 * ou variáveis de ambiente.
 */
const DEFAULT_HEADERS = {
    "Content-Type": "application/json",
} as const;

/**
 * =========================================================
 * SERVICE LAYER - FAKE API CONNECTOR
 * =========================================================
 * @description Camada responsável por encapsular todas as chamadas HTTP
 * relacionadas ao domínio de serviços.
 *
 * Responsabilidades:
 * - Abstrair comunicação com a API
 * - Padronizar requisições e respostas
 * - Facilitar manutenção e testes
 * - Evitar uso direto do Axios fora desta camada
 */
export const FAKE_API_CONNECTOR = {

    /**
     * =====================================================
     * GET SERVICES
     * =====================================================
     * @description Busca a lista de categorias e seus respectivos 
     * serviços agrupados na API..
     *
     * @returns Promise contendo um array de categorias (GetCategoryResponseDto[])
     * @throws Error quando a requisição falhar
     */
    getServices: async (): Promise<GetCategoryResponseDto[]> => {
        try {
            const response = await api.get<GetCategoryResponseDto[]>(
                ROUTES.CATEGORIES,
                {
                    headers: DEFAULT_HEADERS,
                }
            );

            return response.data;
        } catch (error) {
            console.error("Erro ao buscar serviços:", error);
            throw error;
        }
    },

    getAppointments: async (): Promise<GetAppointmentResponseDto[]> => {
        try {
            const response = await api.get<GetAppointmentResponseDto[]>(
                ROUTES.APPOINTMENTS,
                {
                    headers: DEFAULT_HEADERS,
                }
            );

            return response.data;
        } catch (error) {
            console.error("Erro ao buscar agendamentos:", error);
            throw error;
        }
    },

    /**
     * =====================================================
     * POST APPOINTMENT
     * =====================================================
     * @description Envia um agendamento para a API.
     *
     * Responsável por criar um novo agendamento no backend
     * com base nos dados informados pelo usuário.
     *
     * @param dto Dados do agendamento (PostToScheduleDto)
     * @returns Promise<void> ou resposta do backend caso necessário
     *
     * @throws Error quando a requisição falhar
     */
    postAppointment: async (dto: PostToScheduleDto): Promise<void> => {
        try {
            await api.post(
                ROUTES.APPOINTMENTS,
                dto,
                {
                    headers: DEFAULT_HEADERS,
                }
            );
        } catch (error) {
            console.error("Erro ao criar agendamento:", error);
            throw error;
        }
    }
};
