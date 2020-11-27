import math
import unittest

import pytest
from fastapi.testclient import TestClient

from main import app
from ohlc_loader import OHLCLoader


class TestServer(unittest.TestCase):

    def __init__(self, *args, **kwargs):
        super(TestServer, self).__init__(*args, **kwargs)
        self.client = TestClient(app)
        self.ohlc_loader = OHLCLoader()
        self.from_ts = 1603622100  # Sunday, 25. October 2020 10:35:00
        self.from_ts_in_millis = self.from_ts * 1000
        # Binance' maximum of 1000 bars would end at 1603682040000 => Monday, 26. October 2020 03:14:00
        self.to_ts = 1603708513  # Monday, 26. October 2020 10:35:13
        self.symbol = "BTC/USDT"
        self.tf = '1m'

    def test_read_main(self):
        response = self.client.get("/")
        assert response.status_code == 200
        assert response.json() == {"message": "Hello World"}

    def test_calc_minutes(self):
        from_ts = 1603622100  # Sunday, 25. October 2020 10:35:00
        # +1000 min = 1603682040000 last candle
        # Binance' maximum of 1000 bars would end at 1603682040000 => Monday, 26. October 2020 03:14:00
        to_ts = 1603708513  # Monday, 26. October 2020 10:35:13

        tdelta_in_minutes = self.ohlc_loader.get_delta_in_decimal_minutes(from_ts * 1000, to_ts * 1000)
        assert tdelta_in_minutes == pytest.approx(1440.21666, abs=0.001)
        print(tdelta_in_minutes)

    def test_get_ohlc_iteration_count(self):

        iteration_count = self.ohlc_loader.get_iteration_count(self.from_ts * 1000, self.to_ts * 1000)

        assert iteration_count == 1

    def test_get_ohlcv_from_limit_iterations(self):
        iteration_count = 1
        ohlc_list = self.ohlc_loader.get_ohlcv_from_limit_iterations(self.from_ts, iteration_count, '1m', self.symbol)
        remaining_ohlc = self.ohlc_loader.get_remaining_ohlc(ohlc_list[-1][0] + (1000 * 60), self.to_ts * 1000, self.tf, self.symbol)
        ohlc_last_ts = remaining_ohlc[-1][0]

        assert ohlc_last_ts == 1603708500000, \
            "The timestamp of the last candle is Monday, 26. October 2020 10:35:00." \
            "It is the the same minute as the to_ts."

        ohlc_list = self.ohlc_loader.get_ohlcv_from_limit_iterations(self.from_ts, 2, self.tf, self.symbol)

        assert ohlc_list[0][0] == self.from_ts_in_millis, "The from_ts is inclusive"

        assert ohlc_list[self.ohlc_loader.get_limit() - 1][0] == 1603682040000  # Monday, 26. October 2020 03:14:00

        assert ohlc_list[self.ohlc_loader.get_limit()][0] == (1603682040000 + (60 * 1000)), \
            "The start of the second iteration is a minute after the end of the first iteration"

        assert ohlc_list[(self.ohlc_loader.get_limit() * 2) - 1][0] == (
                    1603682040000 + (60 * 1000) * self.ohlc_loader.get_limit()), \
            "The end of the second iteration is the start of the second iteration plus 60 seconds * the limit"

        assert len(ohlc_list) == (2 * self.ohlc_loader.get_limit())

    def test_get_ohlc_over_candle_limit(self):
        ohlc_list = self.ohlc_loader.get_ohlc(self.from_ts, self.to_ts, self.tf, self.symbol)
        minute_delta = math.ceil(self.ohlc_loader.get_delta_in_decimal_minutes(self.from_ts * 1000, self.to_ts * 1000))

        assert len(ohlc_list) == minute_delta

    def test_get_ohlc_sub_candle_limit(self):
        from_ts=1605883816
        to_ts  =1605889815
        ohlc_list = self.ohlc_loader.get_ohlc(from_ts, to_ts, self.tf, self.symbol)
        minute_delta = math.ceil(self.ohlc_loader.get_delta_in_decimal_minutes(from_ts * 1000, to_ts * 1000))
        assert len(ohlc_list) == minute_delta

