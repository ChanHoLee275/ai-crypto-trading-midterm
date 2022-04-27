/* eslint-disable no-undef */
import process, { exit } from 'process';
import dotenv from 'dotenv';
import readline from 'readline';
import crypto from 'crypto';

import getBalances from './getBalances.js';
import getOpenOrders from './getOpenOrders.js';

dotenv.config();

function info() {
  console.log('get-balances API를 호출하려면 A를 입력해주세요.');
  console.log(
    'get-open-orders API를 호출하려면 B와 market 이름을 입력해주세요. 없다면 XRP-PERP을 기준으로 호출합니다.',
  );
  console.log('프로그램을 종료하려면 exit를 입력해주세요.');
}

function createTime() {
  return Math.floor(new Date().getTime());
}

function createSignature(time, method) {
  return (path) =>
    crypto
      .createHmac('sha256', process.env.SECRET_KEY)
      .update(`${time}${method}${path}`)
      .digest('hex');
}

// set read stream
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
rl.setPrompt('사용자 입력 : ');

// show detail program
info();
rl.prompt();

rl.on('line', async (input) => {
  const time = createTime();
  const signature = createSignature(time, 'GET');
  const [command, market] = input.split(' ');
  switch (command) {
    case 'A':
      await getBalances(signature(process.env.BALANCES_API), time);
      break;
    case 'B':
      await getOpenOrders(
        signature(process.env.ORDERS_API + `?market=${market ?? 'XRP-PERP'}`),
        time,
        market ?? 'XRP-PERP',
      );
      break;
    case 'exit':
      exit();
      break;
    default:
      console.log('입력이 잘못되었습니다. 다시 입력해주세요.');
      console.log('평가한 사용자 입력 : ' + input);
      info();
      break;
  }
  rl.prompt();
});
