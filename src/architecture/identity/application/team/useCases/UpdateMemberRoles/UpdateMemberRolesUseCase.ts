import { LastOwnerRemovalError } from "@/identity/domain/team/errors/LastOwnerRemovalError";
import type { TeamMemberRepository } from "../../ports/TeamMemberRepository";
import type { UpdateMemberRolesCommand } from "./UpdateMemberRolesCommand";
import type { UpdateMemberRolesResult } from "./UpdateMemberRolesResult";

/** Replaces roles while preserving the company-owner invariant through a repository port. */
export class UpdateMemberRolesUseCase {
  public constructor(private readonly members: TeamMemberRepository) {}
  public async execute(input: UpdateMemberRolesCommand): Promise<UpdateMemberRolesResult> {
    const member = await this.members.findById(input.companyId, input.memberId);
    if (!member) throw new Error("Membro não encontrado.");
    const removesOwner = member.hasRole("Owner") && !input.requestedRoles.includes("Owner");
    if (removesOwner) {
      const owners = (await this.members.list(input.companyId)).filter((item) => item.hasRole("Owner"));
      if (owners.length <= 1) throw new LastOwnerRemovalError();
    }
    member.replaceRoles(input.requestedRoles);
    await this.members.save(input.companyId, member);
  }
}
