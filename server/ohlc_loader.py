from datetime import datetime, timedelta

import ccxt
import math
from pytz import UTC

TIME_FRAMES = {
    '5s': timedelta(seconds=5),
    '30s': timedelta(seconds=30),
    '1m': timedelta(minutes=1),
    '3m': timedelta(minutes=3),
    '5m': timedelta(minutes=5),
    '15m': timedelta(minutes=15),
    '30m': timedelta(minutes=30),
    '90m': timedelta(minutes=90),
    '1h': timedelta(hours=1),
    '2h': timedelta(hours=2),
    '3h': timedelta(hours=3),
    '4h': timedelta(hours=4),
    '6h': timedelta(hours=6),
    '8h': timedelta(hours=8),
    '12h': timedelta(hours=12),
    '1d': timedelta(days=1),
    '1w': timedelta(weeks=1),
    '2w': timedelta(weeks=2)
}


class OHLCLoader:

    def __init__(self, exchange = ccxt.binance()):
        self.exchange = exchange
        self.limit = 1000

    def get_limit(self):
        return self.limit

    def get_ohlc(self, from_ts, to_ts, tf, symbol):
        iteration_count = self.get_iteration_count(from_ts * 1000, to_ts * 1000)
        print(iteration_count)
        ohlcv_from_limit_iterations = [] if iteration_count == 0 else self.get_ohlcv_from_limit_iterations(from_ts, iteration_count, tf, symbol)
        one_minute = 1000 * 60
        from_ts = from_ts * 1000 if iteration_count == 0 else ohlcv_from_limit_iterations[-1][0] + one_minute
        ohlcv_remaining = self.get_remaining_ohlc(from_ts, to_ts * 1000, tf, symbol)
        return ohlcv_from_limit_iterations + ohlcv_remaining

    def get_iteration_count(self, from_ts, to_ts):
        return math.floor(self.get_delta_in_decimal_minutes(from_ts, to_ts) / self.limit)

    def get_ohlcv_from_limit_iterations(self, from_ts, iteration_count, tf, symbol):
        '''

        :param from_ts: Timestamp in seconds inclusive
        :param to_ts: Timestamp in seconds exclusive
        :return:
        '''
        ohlc_list = [item
                     for sublist in self.ohlcv_limit_iteration_generator(self.exchange, from_ts, iteration_count, tf, symbol)
                     for item in sublist]
        return ohlc_list

    def get_remaining_ohlc(self, from_ts, to_ts, tf, symbol):
        minute_delta = math.ceil(self.get_delta_in_decimal_minutes(from_ts, to_ts))
        print('minute_delta: ', minute_delta)
        remaining_ohlc = self.exchange.fetch_ohlcv(symbol, tf, since=math.floor(from_ts), limit=minute_delta)
        return remaining_ohlc

    def ohlcv_limit_iteration_generator(self, binance, from_ts, iteration_count, tf, symbol):
        loop_from_ts = from_ts * 1000
        for iteration in range(iteration_count):
            ohlcv = binance.fetch_ohlcv(symbol, tf, since=loop_from_ts, limit=self.limit)
            yield ohlcv
            last_ts = ohlcv[-1][0]
            one_tf_in_millis = TIME_FRAMES.get(tf).total_seconds() * 1000
            loop_from_ts = math.floor(last_ts + one_tf_in_millis)

    def get_delta_in_decimal_minutes(self, from_ts, to_ts):
        '''

        :param from_ts: timestamp in seconds
        :param to_ts: timestamp in seconds
        :return: ohlcv array
        '''
        from_date = datetime.fromtimestamp(from_ts / 1000, tz=UTC)
        to_date = datetime.fromtimestamp(to_ts / 1000, tz=UTC)
        tdelta = to_date - from_date
        tdelta_in_minutes = tdelta.total_seconds() / 60
        return tdelta_in_minutes
