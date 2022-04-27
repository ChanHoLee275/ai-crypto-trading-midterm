/* eslint-disable no-undef */
import fetch from 'node-fetch';
import process from 'process';

import { streamToString } from './util.js';

async function getBalances(signature, time) {
  const response = await fetch(process.env.API_URL + process.env.BALANCES_API, {
    method: 'GET',
    headers: {
      'FTX-KEY': process.env.ACCESS_KEY,
      'FTX-SIGN': signature,
      'FTX-TS': time,
    },
  });
  const res = await streamToString(response.body);
  console.log('API 성공 여부 : ' + res.success);
  console.log('API 결과 : ' + (res.success ? res.result : res.error));
  console.log('API 응답 (JSON 형식) : ', res);
}

export default getBalances;
