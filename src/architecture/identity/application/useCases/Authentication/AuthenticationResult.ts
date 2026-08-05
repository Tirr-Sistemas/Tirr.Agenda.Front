import type { IdentityProfile, SessionSnapshot } from "../../dtos/AuthDtos";

export type AuthenticationResult = void | SessionSnapshot | null | IdentityProfile;
