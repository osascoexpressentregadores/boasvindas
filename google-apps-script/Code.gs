/**
 * OSASCO EXPRESS — GIBI DE INTEGRAÇÃO
 * Confirmação de leitura enviada pelo index.html para Google Sheets.
 *
 * Planilha destino:
 * https://docs.google.com/spreadsheets/d/1Pw9APJuBv0hVlFKrSqjqtDgGJaknXb1_Gms-I12O2j4/edit
 */

const SPREADSHEET_ID = "1Pw9APJuBv0hVlFKrSqjqtDgGJaknXb1_Gms-I12O2j4";
const SHEET_NAME = "Confirmacoes";

/**
 * Rode esta função uma vez no Apps Script para criar/organizar o cabeçalho.
 */
function setup() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  const headers = [
    "Data/Hora",
    "Protocolo",
    "Nome do parceiro",
    "WhatsApp",
    "Placa ou identificação",
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

/**
 * Recebe a confirmação enviada pelo gibi online.
 */
function doPost(e) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);

    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      setup();
      sheet = ss.getSheetByName(SHEET_NAME);
    }

    const data = JSON.parse(e.postData.contents || "{}");

    sheet.appendRow([
      new Date(),
      data.protocolo || "",
      data.nome || "",
      data.whatsapp || "",
      data.identificacao || "",
      data.paginas_vistas || "",
      data.total_paginas || "",
      data.tipo || "confirmacao_leitura_gibi_oe",
      data.url || "",
      data.user_agent || ""
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Teste rápido dentro do Apps Script.
 */
function testeManual() {
  const fakeEvent = {
    postData: {
      contents: JSON.stringify({
        tipo: "confirmacao_leitura_gibi_oe",
        protocolo: "OE-TESTE",
        nome: "Teste Osasco Express",
        whatsapp: "11999999999",
        identificacao: "TESTE123",
        paginas_vistas: "1,2,3,4,5,6,7,8,9,10",
        total_paginas: 10,
        url: "teste-local",
        user_agent: "Apps Script teste manual"
      })
    }
  };

  doPost(fakeEvent);
}
