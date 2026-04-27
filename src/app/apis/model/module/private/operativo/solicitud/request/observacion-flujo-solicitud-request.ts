import {FlujoSolicitudRequest} from './flujo-solicitud-request';

export interface ObservacionFlujoSolicitudRequest extends FlujoSolicitudRequest {
  descripcionObservacion?: string;
  eventoObservacion?: string;
  usuarioObservacion?: string;
}
