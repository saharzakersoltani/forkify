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

//================ get json from the URL ===============
export const getJSON = async function (url) {
  try {
    const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`some thing happened! (${res.status})`);

    return data;
  } catch (err) {
    throw err;
  }
};
