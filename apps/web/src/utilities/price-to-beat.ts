type Placement = {
  readonly listPrice: number;
  readonly holderPrice: number | null;
};

export const priceToBeat = (placement: Placement, minimumRaise: number): number =>
  placement.holderPrice === null ? placement.listPrice : placement.holderPrice + minimumRaise;
