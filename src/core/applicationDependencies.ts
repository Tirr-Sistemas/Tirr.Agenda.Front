import type { UpdateMemberRolesUseCase } from "@/identity/application/team/useCases/UpdateMemberRoles/UpdateMemberRolesUseCase";
import type { CreatePublicBookingUseCase } from "@/scheduling/application/useCases/CreatePublicBooking/CreatePublicBookingUseCase";
import type { ResolvePublicBusinessUseCase } from "@/scheduling/application/useCases/ResolvePublicBusiness/ResolvePublicBusinessUseCase";
import type { ListBookableServicesUseCase } from "@/scheduling/application/useCases/ListBookableServices/ListBookableServicesUseCase";
import type { ListServiceProfessionalsUseCase } from "@/scheduling/application/useCases/ListServiceProfessionals/ListServiceProfessionalsUseCase";
import type { ListAvailableDatesUseCase } from "@/scheduling/application/useCases/ListAvailableDates/ListAvailableDatesUseCase";
import type { ListAvailableTimeSlotsUseCase } from "@/scheduling/application/useCases/ListAvailableTimeSlots/ListAvailableTimeSlotsUseCase";
import type { ValidateAvailabilityExceptionUseCase } from "@/administration/application/areas/availability/useCases/ValidateAvailabilityException/ValidateAvailabilityExceptionUseCase";
import type { AuthenticationUseCase } from "@/identity/application/useCases/Authentication/AuthenticationUseCase";
import type { AdministrationUseCase } from "@/administration/application/useCases/Administration/AdministrationUseCase";
import type { ManageIdentityUseCase } from "@/identity/application/useCases/ManageIdentity/ManageIdentityUseCase";

/**
 * @description Catálogo dos casos de uso disponibilizados à camada de apresentação.
 */
export interface ApplicationDependencies {
  readonly team: { readonly updateMemberRoles: UpdateMemberRolesUseCase; };
  readonly booking: {
    readonly createPublicBooking: CreatePublicBookingUseCase;
    readonly resolveBusiness: ResolvePublicBusinessUseCase;
    readonly listServices: ListBookableServicesUseCase;
    readonly listProfessionals: ListServiceProfessionalsUseCase;
    readonly listAvailableDates: ListAvailableDatesUseCase;
    readonly listAvailableTimeSlots: ListAvailableTimeSlotsUseCase;
  };
  readonly availability: { readonly validateException: ValidateAvailabilityExceptionUseCase; };
  readonly authentication: AuthenticationUseCase;
  readonly administration: AdministrationUseCase;
  readonly identity: ManageIdentityUseCase;
}
