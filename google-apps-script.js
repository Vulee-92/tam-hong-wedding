// Google Apps Script code to handle form submissions to Google Sheets
function doPost(e) {
  try {
    // Get the spreadsheet and sheet
    const spreadsheetId = '1XrUlxjPcmldOpaV6gY1tuNNGASa83f5RBzfKIPObiLw';
    const sheet = SpreadsheetApp.openById(spreadsheetId).getActiveSheet();
    
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    
    // Format the timestamp
    const timestamp = new Date(data.timestamp);
    const formattedDate = Utilities.formatDate(timestamp, 'GMT+7', 'dd/MM/yyyy HH:mm:ss');
    
    // Append the data to the sheet
    sheet.appendRow([
      formattedDate,
      data.name,
      data.email,
      data.content
    ]);

    // Send thank you email if email is provided
    if (data.email) {
      sendThankYouEmail(data.name, data.email, data.content);
    }
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Lời chúc đã được ghi nhận'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Return error response
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Có lỗi xảy ra: ' + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Function to send thank you email
function sendThankYouEmail(name, email, wishContent) {
  const subject = '💝 Cảm ơn những lời chúc tốt đẹp của bạn - Vũ & Hân Wedding';
  
  const htmlBody = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital@0;1&family=Montserrat:wght@400;500&display=swap');
        </style>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Montserrat', sans-serif; line-height: 1.6;">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px; background: linear-gradient(to bottom right, #fff9f9, #fff);">
        

          <!-- Main Content -->
          <div style="background: white; border-radius: 16px; padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); border: 1px solid #f5f5f5;">
            <h1 style="font-family: 'Playfair Display', serif; color: #9E8A78; text-align: center; font-size: 28px; margin-bottom: 30px;">
              Cảm Ơn ${name} 💝
            </h1>

            <p style="color: #000; font-size: 16px; margin-bottom: 20px;">
              Thân gửi ${name} thương mến,
            </p>

            <p style="color: #000; font-size: 16px; margin-bottom: 20px;">
              Vũ & Hân xin gửi lời cảm ơn chân thành và sâu sắc nhất đến bạn vì những lời chúc tuyệt vời. Mỗi lời chúc của bạn là một món quà tinh thần vô giá đối với chúng mình.
            </p>

            <div style="background: #faf7f5; border-radius: 12px; padding: 20px; margin: 30px 0; border-left: 4px solid #9E8A78;">
              <p style="color: #666; font-style: italic; margin: 0;">
                "${wishContent}"
              </p>
            </div>

            <p style="color: #000; font-size: 16px; margin-bottom: 20px;">
              Những lời chúc của bạn sẽ là nguồn động viên quý giá, tiếp thêm năng lượng tích cực cho chúng mình trong hành trình hạnh phúc sắp tới. Chúng mình rất mong được gặp bạn trong ngày trọng đại của mình.
            </p>

            <p style="color: #000; font-size: 16px; margin-bottom: 20px;">
              Một lần nữa, cảm ơn bạn rất nhiều! ❤️
            </p>

            <!-- Signature -->
            <div style="text-align: center; margin-top: 40px; padding-top: 30px; border-top: 1px solid #eee;">
              <p style="font-family: 'Playfair Display', serif; color: #9E8A78; font-style: italic; font-size: 18px;">
                Trân trọng,<br>
                <span style="font-size: 24px;">Vũ & Hân</span>
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #999; font-size: 14px;">
              💌 Email được gửi tự động từ Vũ & Hân Wedding
            </p>
          
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    MailApp.sendEmail({
      to: email,
      subject: subject,
      htmlBody: htmlBody,
      name: "Vũ & Hân Wedding",
    });
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

// Add CORS headers to allow requests from your website
function doOptions(e) {
  var headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400'
  };
  
  return ContentService.createTextOutput()
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders(headers);
} 