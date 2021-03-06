<div class="new-page" w-class="new-page" ev-back-click="backPrePage" ev-next-click="chooseAddrClick" ev-refresh-click="refreshClick">
    <div w-class="top-head">
        {{: topBarTitle = {"zh_Hans":it.currencyName,"zh_Hant":it.currencyName,"en":""} }}
        <app-components1-topBar-topBar>{"title":{{topBarTitle}},background:"transparent",nextImg:"../../res/image/location.png",refreshImg:"../../res/image1/refresh_white.png",text:{{it1.address}}}</app-components1-topBar-topBar>
        <div w-class="head">
            <img src="../../../res/image/currency/{{it.currencyName}}.png" w-class="currency-icon"/>
            <div w-class="asset-container">
                <div w-class="balance">{{it1.balance%1===0?it1.balance.toFixed(2):it1.balance}}</div>
                <div w-class="balance-value">{{it1.currencyUnitSymbol}}{{it1.balanceValue}}</div>
            </div>
            {{if it1.canConvert}}
            <div w-class="btn-exchange" on-tap="convertCurrencyClick"><pi-ui-lang>{"zh_Hans":"换币","zh_Hant":"換幣","en":""}</pi-ui-lang></div>
            {{end}}
        </div>
        <div w-class="nav">
            {{: tabs = [
                {"zh_Hans":"全部","zh_Hant":"全部","en":""},
                {"zh_Hans":"转账","zh_Hant":"轉賬","en":""},
                {"zh_Hans":"收款","zh_Hant":"收款","en":""}] }}

            {{for i,v of it1.tabs}} {{let isActive = i===it1.activeNum}}
            <div w-class="nav-item {{isActive ? 'is-active' : ''}}" on-tap="tabsChangeClick({{i}})">
                <pi-ui-lang>{{tabs[i]}}</pi-ui-lang>
            </div>
            {{end}}
        </div>
    </div>
    <div w-class="show-container">
        <div w-class="quotes"><pi-ui-lang>{"zh_Hans":"行情","zh_Hant":"行情","en":""}</pi-ui-lang>&nbsp;{{it1.currencyUnitSymbol}}{{it1.rate}}/{{it.currencyName}}</div>
        {{if it1.redUp}}
        <div w-class="{{it.gain >= 0 ? 'up' : 'down'}}"><pi-ui-lang>{"zh_Hans":"今日","zh_Hant":"今日","en":""}</pi-ui-lang>&nbsp;{{it.gain >= 0 ? '+' : ''}}{{it.gain}}%</div>
        {{else}}
        <div w-class="{{it.gain >= 0 ? 'down' : 'up'}}"><pi-ui-lang>{"zh_Hans":"今日","zh_Hant":"今日","en":""}</pi-ui-lang>&nbsp;{{it.gain >= 0 ? '+' : ''}}{{it.gain}}%</div>
        {{end}}
    </div>
    <div w-class="body">
        <div w-class="tx-list-container">
            {{if it1.txList.length === 0}}
            <div w-class="no-recode">
                <img src="../../../res/image/dividend_history_none.png" w-class="no-recode-icon"/>
                <div w-class="no-recode-text"><pi-ui-lang>{"zh_Hans":"还没有记录哦","zh_Hant":"還沒有記錄哦","en":""}</pi-ui-lang></div>
            </div>
            {{end}}
            <div w-class="tx-list">
                {{for i,v of it1.tabs[it1.activeNum].list}}
                <div on-tap="txListItemClick(e,{{i}})">  
                    <app-components-fourParaImgItem-fourParaImgItem>{"name":{{v.txTypeShow}},"data":{{v.pay%1===0?v.pay.toFixed(2):v.pay}},"time":{{v.TimeShow}},"describe":{{v.statusShow}},img:"../../res/image/{{v.txType === 2 ? "receive_icon.png" : "transfer_icon.png"}}"}</app-components-fourParaImgItem-fourParaImgItem>
                </div>
                {{end}}
            </div>
        </div>
    </div>
    <div w-class="operating">
        <div w-class="operating-item" on-tap="doTransferClick"><img src="../../../res/image/transfer.png" w-class="icon"/>
            <span><pi-ui-lang>{"zh_Hans":"转账","zh_Hant":"轉賬","en":""}</pi-ui-lang></span>
        </div>
        <div w-class="line"></div>
        <div w-class="operating-item" on-tap="doReceiptClick" style="background: #318DE6;"><img src="../../../res/image/19.png" w-class="icon"/>
            <span><pi-ui-lang>{"zh_Hans":"收款","zh_Hant":"收款","en":""}</pi-ui-lang></span>
        </div>
    </div>
</div>