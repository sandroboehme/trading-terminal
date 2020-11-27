The main feature of this server is to overcome the candle limits 
of the exchanges. TradingView might request more than 1000 candles
in it's datafeed `getBars()` method that calls this endpoint 
but Binance limits it's response to 1000 candles. 
`test_main.py` contains tests to cover that case.

## Requirements
Python 3

## Installation
```
virtualenv --python python3 env
source env/bin/activate
pip3 install -r requirements.txt
```

## Run the server
`uvicorn main:app --reload`

## Exit virtualenv
``` 
deactivate
```
