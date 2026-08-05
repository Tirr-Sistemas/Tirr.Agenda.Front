import { TeamMember } from "@/identity/domain/team/entities/TeamMember";
import { LastOwnerRemovalError } from "@/identity/domain/team/errors/LastOwnerRemovalError";
import type { TeamMemberRepository } from "../../ports/TeamMemberRepository";
import { UpdateMemberRolesUseCase } from "./UpdateMemberRolesUseCase";

function createRepository(members: TeamMember[]): TeamMemberRepository & { saved: TeamMember[] } {
  return {
    saved: [],
    findById: async (_companyId, memberId) => members.find((member) => member.id === memberId) ?? null,
    list: async () => members,
    save: async (_companyId, member) => { members.splice(members.findIndex((item) => item.id === member.id), 1, member); },
  };
}

describe("UpdateMemberRolesUseCase", () => {
  it("preserves multiple roles when replacing a member's complete role set", async () => {
    const repository = createRepository([new TeamMember({ id: "one", roles: ["Owner"] }), new TeamMember({ id: "two", roles: ["Professional"] })]);
    await new UpdateMemberRolesUseCase(repository).execute({ companyId: "company", memberId: "two", requestedRoles: ["Administrator", "Professional"] });
    expect((await repository.findById("company", "two"))?.roles).toEqual(["Administrator", "Professional"]);
  });

  it("does not allow removal of the last owner", async () => {
    const repository = createRepository([new TeamMember({ id: "one", roles: ["Owner", "Professional"] })]);
    await expect(new UpdateMemberRolesUseCase(repository).execute({ companyId: "company", memberId: "one", requestedRoles: ["Professional"] })).rejects.toBeInstanceOf(LastOwnerRemovalError);
  });
});
