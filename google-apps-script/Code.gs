/**
 * OSASCO EXPRESS — GIBI DE INTEGRAÇÃO
 * Versão robusta: aceita GET e POST.
 * O site usa GET via iframe para evitar bloqueio de CORS/redirect do Apps Script.
 */

const SPREADSHEET_ID = "1Pw9APJuBv0hVlFKrSqjqtDgGJaknXb1_Gms-I12O2j4";
const SHEET_NAME = "Confirmacoes";

function setup() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);

  const headers = [
    "Data/Hora",
    "Protocolo",
    "Nome",
    "Sobrenome",
    "Leu",
    "Páginas vistas",
    "Total de páginas",
    "Tipo",
    "URL de origem",
    "User Agent"
  ];

  sheet.clear();
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, headers.length);
}

function salvarLinha_(data) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    setup();
    sheet = ss.getSheetByName(SHEET_NAME);
  }

  sheet.appendRow([
    new Date(),
    data.protocolo || "",
    data.nome || "",
    data.sobrenome || "",
    data.leu || "SIM",
    data.paginas_vistas || "",
    data.total_paginas || "",
    data.tipo || "confirmacao_leitura_gibi_oe",
    data.url || "",
    data.user_agent || ""
  ]);

  return { ok: true };
}

function doGet(e) {
  try {
    const data = e && e.parameter ? e.parameter : {};
    const result = salvarLinha_(data);

    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    let data = {};

    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (jsonErr) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    const result = salvarLinha_(data);

    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function testeManual() {
  salvarLinha_({
    protocolo: "OE-TESTE",
    nome: "Teste",
    sobrenome: "Parceiro",
    leu: "SIM",
    paginas_vistas: "1,2,3,4,5,6,7,8,9,10",
    total_paginas: "10",
    tipo: "confirmacao_leitura_gibi_oe",
    url: "teste-manual",
    user_agent: "Apps Script"
  });
}
