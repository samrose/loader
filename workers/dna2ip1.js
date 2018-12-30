addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
  })
  
  /**
   * Find in KV store an IP of a host serving queried DNA
   * Request needs to be POST in Content-Type: application/json
   * Returns application/json in a format {"IP": ip} or standard http error status code (https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html)
   * @param {Request} request
   */
  async function handleRequest(request) {
    let responseStatus = 500;
    let responseBody = "";
  
    // Let's fake some KV store access here
    const KVstore = {
      "QmImagexchangeDNAhash": "35.173.196.129"
    };
  
    // Wrap code in try/catch block to return error stack in the response body
    try {
      // Extract hApp's url from the request body
      if (request.headers.get("Content-Type") === 'application/x-www-form-urlencoded' && request.method.toLowerCase() === 'post') {
        const postData = await request.formData();
        const dna = postData.get('dna');
        if (dna === undefined || KVstore[dna] === undefined) {
          responseStatus = 404;
        } else {
          responseStatus = 200;
          responseBody = JSON.stringify({ip: KVstore[dna]});
        }
      } else {
        responseStatus = 400;
      }
  
      const init = {
        status: responseStatus,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        }
      }
      return new Response(responseBody, init);
    } catch (err) {
      // Display the error stack.
      return new Response(err.stack || err)
    }
  }