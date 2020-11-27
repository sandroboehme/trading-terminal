// Make requests to CryptoCompare API
import { ServerService } from './server.service';

export async function makeApiRequest(path) {
  try {
    const response = await fetch(`https://min-api.cryptocompare.com/${path}`);
    return response.json();
  } catch (error) {
    throw new Error(`CryptoCompare request error: ${error.status}`);
  }
}
export function getCandlesFromServer(server: ServerService, from: any, to: any, parsedSymbol: { fromSymbol: any; toSymbol: any; exchange: any }) {
  let response;
  try {
    response = server.getBars(from, to, parsedSymbol.exchange, parsedSymbol.fromSymbol, parsedSymbol.toSymbol );
    return response.json();
  } catch (error) {
    console.log(JSON.stringify(response));
    throw new Error(`Server request error: ${error.status}`);
  }
}

/*
export async function callBinanceFetch() {

  const ohlcv = await new ccxt.binance ().fetchOHLCV ('BTC/USDT', '1h');
  console.log('binance ohlc: ', ohlcv);
  return ohlcv;
}
*/

// Generate a symbol ID from a pair of the coins
export function generateSymbol(exchange, fromSymbol, toSymbol) {
  const short = `${fromSymbol}/${toSymbol}`;
  return {
    short,
    full: `${exchange}:${short}`,
  };
}

export function parseFullSymbol(fullSymbol) {
  const match = fullSymbol.match(/^(\w+):(\w+)\/(\w+)$/);
  if (!match) {
    return null;
  }

  return {
    exchange: match[1],
    fromSymbol: match[2],
    toSymbol: match[3],
  };
}
