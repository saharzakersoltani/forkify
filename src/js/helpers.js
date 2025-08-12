// helper.js file contain a couple of functions that we reuse over and over in our projects.
import { TIMEOUT_SEC } from './config.js';

//============== declare a time out ===============
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

//================ REFACTORE get json and send data parts ===============
export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);

    const data = await res.json();

    if (!res.ok) throw new Error(`some thing happened! (${res.status})`);

    return data;
  } catch (err) {
    throw err;
  }
};

/*
//================ get json from the URL ===============
export const getJSON = async function (url) {
  try {
    const fetchPro = fetch(url);
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`some thing happened! (${res.status})`);

    return data;
  } catch (err) {
    throw err;
  }
};

//================ send data ===============
export const SendJSON = async function (url, uploadData) {
  try {
    const fetchPro = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadData),
    });

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);

    const data = await res.json();

    if (!res.ok) throw new Error(`some thing happened! (${res.status})`);

    return data;
  } catch (err) {
    throw err;
  }
};
*/
