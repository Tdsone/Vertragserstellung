// Graph API
const GRAPH_BASE_URL = 'https://graph.microsoft.com';
const API_VERSION = 'v1.0';
const SP_ACD_SITE_ID =
  'academyconsult.sharepoint.com,b57543b9-c8fa-48ae-9e02-0082785f1c94,f96372d3-b7a1-4d7e-9889-7dfe12692b10';
const SP_VERTRAGSVORLAGEN_LIST_ID = 'ce80cab7-bfb7-4e59-87fe-551853cef734';
const SP_VERTRAEGE_LIST_ID = '7e4f7ec7-4a66-41e3-9fc5-71791cf385a5';
const SP_PROJEKTE_LIST_ID = '1504d52f-cf5e-4f38-9d36-0f8df9b7bae1';
const SP_PROJEKTE_BEWERBUNGEN_LIST_ID = 'd264572b-52bc-4119-a42d-027ddf805509';
const SP_MITGLIEDER_LIST_ID = 'a7e20107-c4ad-426e-a428-ce561f3e5dc6';
const SP_KUNDEN_LIST_ID = '6745dc7c-2d69-4e80-aff9-35220750bc5d';
const SP_KONTAKTE_LIST_ID = '7ef211c2-77b4-403b-841d-ae8f4a8818b6';

// Auth
const TENANT = 'academyconsult.onmicrosoft.com';

// Contract types
const GBR_VERTRAG = 'GbR Vertrag';
const BERATUNGS_VERTRAG = 'Beratungsvertrag';
const TREUH_PROVIS_VERTRAG = 'Treuhand- und Provisionsvertrag';
const CONTR_VERTRAG = 'Controllervertrag';

// Contract templates
const CONTRACT_TEMPLATE_ID_MAP: Map<string, string> = new Map([
  [BERATUNGS_VERTRAG, '1'],
  [CONTR_VERTRAG, '2'],
  [TREUH_PROVIS_VERTRAG, '3'],
  [GBR_VERTRAG, '4']
]);

export {
  GRAPH_BASE_URL,
  API_VERSION,
  SP_ACD_SITE_ID,
  SP_VERTRAGSVORLAGEN_LIST_ID,
  SP_VERTRAEGE_LIST_ID,
  SP_PROJEKTE_LIST_ID,
  SP_PROJEKTE_BEWERBUNGEN_LIST_ID,
  SP_MITGLIEDER_LIST_ID,
  SP_KUNDEN_LIST_ID,
  SP_KONTAKTE_LIST_ID,
  TENANT,
  GBR_VERTRAG,
  BERATUNGS_VERTRAG,
  TREUH_PROVIS_VERTRAG,
  CONTR_VERTRAG,
  CONTRACT_TEMPLATE_ID_MAP
};
