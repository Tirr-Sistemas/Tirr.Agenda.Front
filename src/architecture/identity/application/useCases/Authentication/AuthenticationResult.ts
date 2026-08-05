import type { IdentityProfile, SessionSnapshot } from "../../dtos/AuthDtos";

/** Respostas possíveis para os comandos de autenticação. */
export type AuthenticationResult = void | SessionSnapshot | null | IdentityProfile;
