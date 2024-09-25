async function errorHandler(err, req, res, next) {
  // Gather details from the request
  const errorDetails = {
    method: req.method,         // HTTP method (GET, POST, etc.)
    url: req.originalUrl,       // Requested URL
    headers: req.headers,       // Request headers
    body: req.body,             // Request body (if available)
    ip: req.ip,                 // Client IP address
    errorName: err.name,        // Error name
    errorMessage: err.message,  // Error message
    stack: err.stack            // Stack trace (useful for debugging)
  };

  // Format the message for Telegram
  const message = `
⚠️ *Error occurred*:
- *Method*: ${errorDetails.method}
- *URL*: ${errorDetails.url}
- *Client IP*: ${errorDetails.ip}
- *Error Name*: ${errorDetails.errorName}
- *Error Message*: ${errorDetails.errorMessage}
- *Headers*: ${JSON.stringify(errorDetails.headers)}
- *Body*: ${JSON.stringify(errorDetails.body)}

*Stack Trace*:
\`${errorDetails.stack}\`
  `;

  // Send the message to your Telegram bot
  await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: process.env.CHAT_ID,
      text: message,
      parse_mode: 'Markdown'  // To format the message with markdown for better readability
    })
  });

  // Handle specific error types (e.g., unauthorized error)
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ success: false, message: 'Invalid or revoked token' });
  }

  // Pass the error to the next middleware
  next(err);
}

module.exports = errorHandler;
