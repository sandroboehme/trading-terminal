This is a POC for loading the candles with CCXT from Binance and providing them to an Angular 11 client via the Python FastAPI library.
The timeframe is currently hardcoded to 1 min. Within that minute
the price will be updated using the CryptoCompare Websocket API directly in the client.

This implementation is based on this tutorial: https://github.com/tradingview/charting-library-tutorial/blob/master/documentation/datafeed-implementation.md

Just follow the instructions in `server/README.md` and `client/README.md` to install and start the server and client.
