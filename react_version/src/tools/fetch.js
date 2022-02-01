export const processFetchRequest = async (url, method, body) => {
  const headers = {
    'Accept': 'application/json',
    // 'Content-Type': 'application/json'
  };

  const options = {
    method,
    headers,
  };


  if (method !== 'GET' && body && body !== '') {
    options.body = JSON.stringify(body);
  }

  return new Promise((resolve, reject) => {
    try {
      fetch(url, options)
        .then(response => {
          if (response.status === 200) {
            return response.json();
          }
          else {
            console.log(`${response.statusText}: ${response.status} to ${response.url}`)
          }
        })
        .then(response => {
          if (response?.error) {
            reject(response?.error);
          }

          resolve(response);
        })
        .catch(err => {
          console.log(`JSON parse error: ${err}`);
        })
    }
    catch (err) {
      console.log(`Fetch err: ${err}`);
    }

  });
};