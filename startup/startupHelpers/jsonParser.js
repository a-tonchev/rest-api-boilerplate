/* Helper function for reading a posted JSON body */
const jsonParser = res => new Promise(resolve => {
  let buffer;
  /* Register data cb */
  res.onData((ab, isLast) => {
    const chunk = Buffer.from(ab);
    if (isLast) {
      let jsonBody;
      let rawBody = '';
      if (buffer) {
        try {
          const rawBodyBuffer = Buffer.concat([buffer, chunk]);
          try {
            rawBody = rawBodyBuffer.toString();
          } catch (e) {
            console.error(e);
            rawBody = '';
          }

          jsonBody = JSON.parse(rawBody);
          resolve([jsonBody, rawBody]);
        } catch (e) {
          resolve([{}, rawBody]);
        }
      } else {
        try {
          rawBody = chunk ? chunk.toString() : '';
          jsonBody = rawBody ? JSON.parse(chunk) : {};
          resolve([jsonBody, rawBody]);
        } catch (e) {
          resolve([{}, rawBody]);
        }
      }
    } else if (buffer) {
      buffer = Buffer.concat([buffer, chunk]);
    } else {
      buffer = Buffer.concat([chunk]);
    }
  });
});

export default jsonParser;
