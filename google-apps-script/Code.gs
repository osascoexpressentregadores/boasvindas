/**
 * OSASCO EXPRESS — GIBI DE INTEGRAÇÃO
 * Salva confirmação de leitura na planilha.
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
    "Telefone",
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

function doPost(e) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      setup();
      sheet = ss.getSheetByName(SHEET_NAME);
    }

    const data = JSON.parse(e.postData.contents || "{}");

    sheet.appendRow([
      new Date(),
      data.protocolo || "",
      data.nome || "",
      data.sobrenome || "",
      data.telefone || "",
      data.leu || "SIM",
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

function testeManual() {
  doPost({
    postData: {
      contents: JSON.stringify({
        protocolo: "OE-TESTE",
        nome: "Teste",
        sobrenome: "Parceiro",
        telefone: "11999999999",
        leu: "SIM",
        paginas_vistas: "1,2,3,4,5,6,7,8,9,10",
        total_paginas: 10,
        tipo: "confirmacao_leitura_gibi_oe",
        url: "teste",
        user_agent: "Apps Script"
      })
    }
  });
}
