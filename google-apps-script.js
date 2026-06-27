/**
 * Google Apps Script RSVP Backend
 * 
 * Instructions:
 * 1. Open your Google Sheet.
 * 2. Click Extensions > Apps Script.
 * 3. Delete any code in the editor and paste this code.
 * 4. Click the Save icon.
 * 5. Click "Deploy" > "New deployment".
 * 6. Select Type: "Web app".
 * 7. Set Description: "Graduation RSVP API".
 * 8. Set Execute as: "Me" (your email).
 * 9. Set Who has access: "Anyone".
 * 10. Click "Deploy", authorize permissions, and copy the "Web app URL".
 */

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Graduation RSVP API is online." }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Check if sheet is empty and add header row if needed
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Timestamp", "Guest Name", "Attendance Status", "Number of Guests", "Wishes / Message", "Contact Info"]);
    }
    
    // Parse incoming data
    var data = {};
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        // Fallback parsing for text/plain url-encoded data
        data = parseQueryString(e.postData.contents);
      }
    } else {
      data = e.parameter;
    }
    
    // Extract fields
    var timestamp = new Date();
    var name = data.name || "Anonymous";
    var status = data.status || "Unknown";
    var guests = data.guests || 0;
    var message = data.message || "";
    var contact = data.contact || "";
    
    // Append the row
    sheet.appendRow([
      timestamp,
      name,
      status,
      guests,
      message,
      contact
    ]);
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "RSVP recorded successfully!",
      received: { name: name, status: status, guests: guests }
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders({
      "Access-Control-Allow-Origin": "*"
    });
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: "Failed to record RSVP: " + error.toString()
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders({
      "Access-Control-Allow-Origin": "*"
    });
  }
}

/**
 * Helper to parse raw query string if data is sent as form-urlencoded
 */
function parseQueryString(queryString) {
  var params = {};
  var queries = queryString.split("&");
  for (var i = 0; i < queries.length; i++) {
    var temp = queries[i].split("=");
    if (temp.length === 2) {
      params[decodeURIComponent(temp[0])] = decodeURIComponent(temp[1]);
    }
  }
  return params;
}

/**
 * Handle CORS preflight requests
 */
function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    });
}
