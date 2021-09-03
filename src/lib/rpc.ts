import axios from 'axios';
import config from '../config';

const call = async <Type>(
  method: string,
  params: (number | string)[] = [],
): Promise<Type> => {
  const result = await axios.post(
    `${config.rpc.host}:${config.rpc.port}`,
    {method, params},
    {
      headers: {'Content-Type': 'application/json'},
      auth: {username: config.rpc.user, password: config.rpc.pass},
    },
  );

  return result.data.result;
};

export const getBalance = async (uid: string) => {
  return call<number>('getbalance', [uid]);
};

export const getDepositAddress = async (uid: string) => {
  const addresses = await call<string[]>('getaddressesbyaccount', [uid]);

  const address = addresses[0];
  if (!address) throw new Error('No address found');
  return address;
};

export const sendFrom = async (
  fromAccount: string,
  toAddress: string,
  amount: number,
  confirmations: number = 1,
  comment: string = '',
  commentTo: string = '',
) => {
  return call<string>('sendfrom', [
    fromAccount,
    toAddress,
    amount,
    confirmations,
    comment,
    commentTo,
  ]);
};

export default call;
