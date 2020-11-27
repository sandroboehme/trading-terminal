from fastapi import FastAPI

from ohlc_loader import OHLCLoader

app = FastAPI()
ohlc_loader = OHLCLoader()


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/get-bars")
async def get_bars(from_ts: int = 0, to_ts: int = 10):
    return ohlc_loader.get_ohlc(from_ts, to_ts, '1m', 'BTC/USDT')
