import { LastOwnerRemovalError } from "@/identity/domain/team/errors/LastOwnerRemovalError";
import type { TeamMemberRepository } from "../../ports/TeamMemberRepository";
import type { UpdateMemberRolesCommand } from "./UpdateMemberRolesCommand";
import type { UpdateMemberRolesResult } from "./UpdateMemberRolesResult";

/**
 * @description Replaces roles while preserving the company-owner invariant through a repository port.
 */
export class UpdateMemberRolesUseCase {
  /**
   * @description Cria o caso de uso com o repositório de membros da equipe.
   *
   * @param members - Valor de members utilizado pela operação.
   */
  public constructor(private readonly members: TeamMemberRepository) { }
  /**
   * @description Atualiza os papéis de um membro e preserva a regra que exige ao menos um proprietário.
   *
   * @param input - Dados necessários para executar a operação.
   * @returns Promessa resolvida com o resultado da operação.
   * @throws Repassa a falha quando a regra ou dependência necessária não puder concluir a operação.
   */
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
