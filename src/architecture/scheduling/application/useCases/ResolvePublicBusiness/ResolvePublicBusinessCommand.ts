/** Permite localizar uma empresa pelo identificador interno ou pelo slug público. */
export type ResolvePublicBusinessCommand = { readonly type: "businessId"; readonly businessId: string } | { readonly type: "slug"; readonly slug: string };
