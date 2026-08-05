import { UpdateMemberRolesUseCase } from "@/identity/application/team/useCases/UpdateMemberRoles/UpdateMemberRolesUseCase";
import { CreatePublicBookingUseCase } from "@/scheduling/application/useCases/CreatePublicBooking/CreatePublicBookingUseCase";
import { ResolvePublicBusinessUseCase } from "@/scheduling/application/useCases/ResolvePublicBusiness/ResolvePublicBusinessUseCase";
import { ListBookableServicesUseCase } from "@/scheduling/application/useCases/ListBookableServices/ListBookableServicesUseCase";
import { ListServiceProfessionalsUseCase } from "@/scheduling/application/useCases/ListServiceProfessionals/ListServiceProfessionalsUseCase";
import { ListAvailableDatesUseCase } from "@/scheduling/application/useCases/ListAvailableDates/ListAvailableDatesUseCase";
import { ListAvailableTimeSlotsUseCase } from "@/scheduling/application/useCases/ListAvailableTimeSlots/ListAvailableTimeSlotsUseCase";
import { ValidateAvailabilityExceptionUseCase } from "@/administration/application/areas/availability/useCases/ValidateAvailabilityException/ValidateAvailabilityExceptionUseCase";
import { AuthenticationUseCase } from "@/identity/application/useCases/Authentication/AuthenticationUseCase";
import { AdministrationUseCase } from "@/administration/application/useCases/Administration/AdministrationUseCase";
import { HttpTeamMemberRepository } from "@/identity/infrastructure/team/HttpTeamMemberRepository";
import { HttpPublicBookingGateway } from "@/scheduling/infrastructure/api/HttpPublicBookingGateway";
import { BrowserSessionRepository } from "@/identity/infrastructure/auth/BrowserSessionRepository";
import { HttpAuthenticationGateway } from "@/identity/infrastructure/auth/HttpAuthenticationGateway";
import { HttpAdministrationGateway } from "@/administration/infrastructure/api/HttpAdministrationGateway";
import { ManageIdentityUseCase } from "@/identity/application/useCases/ManageIdentity/ManageIdentityUseCase";
import { HttpIdentityManagementGateway } from "@/identity/infrastructure/HttpIdentityManagementGateway";
import { apiHttp, publicHttp } from "@/shared-architecture/http/ApiHttpClient";
import type { ApplicationDependencies } from "./applicationDependencies";

/**
 * @description Monta o grafo de dependências da aplicação.
 *
 * Instancia adaptadores uma única vez e expõe apenas casos de uso para React.
 *
 * @returns Dependências prontas para o provider da aplicação.
 */
export function createApplication(): ApplicationDependencies {
  const members = new HttpTeamMemberRepository(apiHttp);
  const publicBookings = new HttpPublicBookingGateway(publicHttp);
  const authentication = new AuthenticationUseCase(new HttpAuthenticationGateway(), new BrowserSessionRepository());
  return {
    team: { updateMemberRoles: new UpdateMemberRolesUseCase(members) },
    booking: {
      createPublicBooking: new CreatePublicBookingUseCase(publicBookings),
      resolveBusiness: new ResolvePublicBusinessUseCase(publicBookings),
      listServices: new ListBookableServicesUseCase(publicBookings),
      listProfessionals: new ListServiceProfessionalsUseCase(publicBookings),
      listAvailableDates: new ListAvailableDatesUseCase(publicBookings),
      listAvailableTimeSlots: new ListAvailableTimeSlotsUseCase(publicBookings),
    },
    availability: { validateException: new ValidateAvailabilityExceptionUseCase() },
    authentication,
    administration: new AdministrationUseCase(new HttpAdministrationGateway(apiHttp)),
    identity: new ManageIdentityUseCase(new HttpIdentityManagementGateway()),
  };
}
