export enum EstadoRegistroEnum {
    VIGENTE = "S",
    NO_VIGENTE = "N",
}

export const EstadoRegistroLabels = {
    [EstadoRegistroEnum.VIGENTE]: "Vigente",
    [EstadoRegistroEnum.NO_VIGENTE]: "No vigente"
};

export const EstadoRegistroValue = {
    [EstadoRegistroEnum.VIGENTE]: "S",
    [EstadoRegistroEnum.NO_VIGENTE]: "N"
};
