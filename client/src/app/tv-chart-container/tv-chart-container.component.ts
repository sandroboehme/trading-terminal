import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import {
    widget,
    IChartingLibraryWidget,
    ChartingLibraryWidgetOptions,
    LanguageCode,
    ResolutionString,
} from '../../assets/charting_library/charting_library.min';
import { Datafeed } from './datafeed';
import { ServerService } from './server.service';

@Component({
    selector: 'tt-tv-chart-container',
    templateUrl: './tv-chart-container.component.html',
    styleUrls: ['./tv-chart-container.component.css']
})
export class TvChartContainerComponent implements OnInit, OnDestroy {
    private thisSymbol: ChartingLibraryWidgetOptions['symbol'] = 'Binance:BTC/USDT'; // 'AAPL';
    private thisInterval: ChartingLibraryWidgetOptions['interval'] = '1' as ResolutionString;
    // BEWARE: no trailing slash is expected in feed URL
    private thisDatafeedUrl = 'https://demo_feed.tradingview.com';
    private thisLibraryPath: ChartingLibraryWidgetOptions['library_path'] = '/assets/charting_library/';
    private thisChartsStorageUrl: ChartingLibraryWidgetOptions['charts_storage_url'] = 'https://saveload.tradingview.com';
    private thisChartsStorageApiVersion: ChartingLibraryWidgetOptions['charts_storage_api_version'] = '1.1';
    private thisClientId: ChartingLibraryWidgetOptions['client_id'] = 'tradingview.com';
    private thisUserId: ChartingLibraryWidgetOptions['user_id'] = 'public_user_id';
    private thisFullscreen: ChartingLibraryWidgetOptions['fullscreen'] = false;
    private thisAutosize: ChartingLibraryWidgetOptions['autosize'] = true;
    private thisContainerId: ChartingLibraryWidgetOptions['container_id'] = 'tv_chart_container';
    private thisTvWidget: IChartingLibraryWidget | null = null;

    constructor(private server: ServerService) {
    }

    @Input()
    set symbol(symbol: ChartingLibraryWidgetOptions['symbol']) {
        this.thisSymbol = symbol || this.thisSymbol;
    }

    @Input()
    set interval(interval: ChartingLibraryWidgetOptions['interval']) {
        this.thisInterval = interval || this.thisInterval;
    }

    @Input()
    set datafeedUrl(datafeedUrl: string) {
        this.thisDatafeedUrl = datafeedUrl || this.thisDatafeedUrl;
    }

    @Input()
    set libraryPath(libraryPath: ChartingLibraryWidgetOptions['library_path']) {
        this.thisLibraryPath = libraryPath || this.thisLibraryPath;
    }

    @Input()
    set chartsStorageUrl(chartsStorageUrl: ChartingLibraryWidgetOptions['charts_storage_url']) {
        this.thisChartsStorageUrl = chartsStorageUrl || this.thisChartsStorageUrl;
    }

    @Input()
    set chartsStorageApiVersion(chartsStorageApiVersion: ChartingLibraryWidgetOptions['charts_storage_api_version']) {
        this.thisChartsStorageApiVersion = chartsStorageApiVersion || this.thisChartsStorageApiVersion;
    }

    @Input()
    set clientId(clientId: ChartingLibraryWidgetOptions['client_id']) {
        this.thisClientId = clientId || this.thisClientId;
    }

    @Input()
    set userId(userId: ChartingLibraryWidgetOptions['user_id']) {
        this.thisUserId = userId || this.thisUserId;
    }

    @Input()
    set fullscreen(fullscreen: ChartingLibraryWidgetOptions['fullscreen']) {
        this.thisFullscreen = fullscreen || this.thisFullscreen;
    }

    @Input()
    set autosize(autosize: ChartingLibraryWidgetOptions['autosize']) {
        this.thisAutosize = autosize || this.thisAutosize;
    }

    @Input()
    set containerId(containerId: ChartingLibraryWidgetOptions['container_id']) {
        this.thisContainerId = containerId || this.thisContainerId;
    }

    ngOnInit(): void {
        function getLanguageFromURL(): LanguageCode | null {
            const regex = new RegExp('[\\?&]lang=([^&#]*)');
            const results = regex.exec(location.search);

            return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' ')) as LanguageCode;
        }

        const widgetOptions: ChartingLibraryWidgetOptions = {
            symbol: this.thisSymbol,
            // datafeed: new (window as any).Datafeeds.UDFCompatibleDatafeed(this._datafeedUrl),
            datafeed: new Datafeed(this.server),
            interval: this.thisInterval,
            container_id: this.thisContainerId,
            library_path: this.thisLibraryPath,
            locale: getLanguageFromURL() || 'en',
            disabled_features: ['use_localstorage_for_settings'],
            enabled_features: ['study_templates', 'header_chart_type'],
            charts_storage_url: this.thisChartsStorageUrl,
            charts_storage_api_version: this.thisChartsStorageApiVersion,
            client_id: this.thisClientId,
            user_id: this.thisUserId,
            fullscreen: this.thisFullscreen,
            autosize: this.thisAutosize,
        };

        const tvWidget = new widget(widgetOptions);
        this.thisTvWidget = tvWidget;

        tvWidget.onChartReady(() => {
            tvWidget.headerReady().then(() => {
                const button = tvWidget.createButton();
                button.setAttribute('title', 'Click to show a notification popup');
                button.classList.add('apply-common-tooltip');
                button.addEventListener('click', () => tvWidget.showNoticeDialog({
                        title: 'Notification',
                        body: 'TradingView Charting Library API works correctly',
                        callback: () => {
                            console.log('Noticed!');
                        },
                    }));
                button.innerHTML = 'Check API';
            });
        });
    }

    ngOnDestroy(): void {
        if (this.thisTvWidget !== null) {
            this.thisTvWidget.remove();
            this.thisTvWidget = null;
        }
    }
}
