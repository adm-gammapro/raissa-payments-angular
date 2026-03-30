export enum EstadoSolicitudEnum {
  REGISTRADO = "REGISTRADO",
  VALIDADO = "VALIDADO",
  PENDIENTE_AUTORIZACION = "PENDIENTE_AUTORIZACION",
  AUTORIZADO_PARCIAL = "AUTORIZADO_PARCIAL",
  OBSERVADO = "OBSERVADO",
  ANULADO = "ANULADO",
  AUTORIZADO = "AUTORIZADO",
  PROCESADO_PARCIAL = "PROCESADO_PARCIAL",
  PROCESADO_TOTAL = "PROCESADO_TOTAL",
}

export const EstadoSolicitudLabels = {
  [EstadoSolicitudEnum.REGISTRADO]: "Registrado",
  [EstadoSolicitudEnum.VALIDADO]: "Validado",
  [EstadoSolicitudEnum.PENDIENTE_AUTORIZACION]: "Pendiente de autorización",
  [EstadoSolicitudEnum.AUTORIZADO_PARCIAL]: "Autorizado parcial",
  [EstadoSolicitudEnum.OBSERVADO]: "Observado",
  [EstadoSolicitudEnum.ANULADO]: "Anulado",
  [EstadoSolicitudEnum.AUTORIZADO]: "Autorizado",
  [EstadoSolicitudEnum.PROCESADO_PARCIAL]: "Procesado parcial",
  [EstadoSolicitudEnum.PROCESADO_TOTAL]: "Procesado total"
};

export const EstadoSolicitudValue = {
  [EstadoSolicitudEnum.REGISTRADO]: "REGISTRADO",
  [EstadoSolicitudEnum.VALIDADO]: "VALIDADO",
  [EstadoSolicitudEnum.PENDIENTE_AUTORIZACION]: "PENDIENTE_AUTORIZACION",
  [EstadoSolicitudEnum.AUTORIZADO_PARCIAL]: "AUTORIZADO_PARCIAL",
  [EstadoSolicitudEnum.OBSERVADO]: "OBSERVADO",
  [EstadoSolicitudEnum.ANULADO]: "ANULADO",
  [EstadoSolicitudEnum.AUTORIZADO]: "AUTORIZADO",
  [EstadoSolicitudEnum.PROCESADO_PARCIAL]: "PROCESADO_PARCIAL",
  [EstadoSolicitudEnum.PROCESADO_TOTAL]: "PROCESADO_TOTAL"
};
