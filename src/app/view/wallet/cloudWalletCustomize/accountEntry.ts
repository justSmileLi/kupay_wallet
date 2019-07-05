/**
 * 入账
 */
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { getRealNode } from '../../../../pi/widget/painter';
import { Widget } from '../../../../pi/widget/widget';
import { callGetAccountDetail } from '../../../middleLayer/wrap';
import { CloudCurrencyType } from '../../../publicLib/interface';
import { getModulConfig } from '../../../publicLib/modulConfig';
import { timestampFormat } from '../../../publicLib/tools';
import { getCloudWallets, registerStoreData } from '../../../viewLogic/common';
// ===================================================== 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
interface Props {
    currencyName:string;
    isActive:boolean;
}
export class AccountEntry extends Widget {
    public props:any;
    public create() {
        super.create();
        this.props = {
            ...this.props,
            recordList:[],
            nextStart:'',
            canLoadMore:false,
            isRefreshing:false
        };
    }
    public setProps(props:Props,oldProps:Props) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props,oldProps);
        this.init();
    }
    public init() {
        getCloudWallets().then(cloudWallets => {
            const allLogs = cloudWallets.get(<any>CloudCurrencyType[this.props.currencyName]);
            this.props.recordList = this.parseRecordList(allLogs.rechargeLogs.list);
            this.props.nextStart = allLogs.otherLogs.start;
            this.props.canLoadMore = allLogs.otherLogs.canLoadMore;
            this.paint();
        });
    }
    /**
     * 更新props数据
     */
    public updateRecordList() {
        if (!this.props) return;
        getCloudWallets().then(cloudWallets => {
            const allLogs = cloudWallets.get(<any>CloudCurrencyType[this.props.currencyName]);
            this.props.recordList = this.parseRecordList(allLogs.rechargeLogs.list);
            this.props.nextStart = allLogs.otherLogs.start;
            this.props.canLoadMore = allLogs.otherLogs.canLoadMore;
            this.paint();
        });
        this.props.isRefreshing = false;
    }

    // tslint:disable-next-line:typedef
    /**
     * 处理充值列表
     * @param list 充值列表 
     */
    public parseRecordList(list:any) {
        // tslint:disable-next-line:max-line-length
        const titleShow = this.props.currencyName === CloudCurrencyType[CloudCurrencyType.SC] ? getModulConfig('SC_SHOW') : getModulConfig('KT_SHOW');
        list.forEach((item) => {
            item.amountShow = `+${item.amount} ${titleShow}`;
            item.timeShow = timestampFormat(item.time).slice(5);
            item.iconShow = item.behaviorIcon;
        });

        return list;
    }

    public loadMore() {
        callGetAccountDetail(this.props.currencyName,0,this.props.nextStart);
    }
    public getMoreList() {
        const h1 = getRealNode((<any>this.tree).children[0]).offsetHeight; 
        const h2 = getRealNode((<any>this.tree).children[0].children[0]).offsetHeight; 
        const scrollTop = getRealNode((<any>this.tree).children[0]).scrollTop; 
        if (this.props.canLoadMore && !this.props.isRefreshing && (h2 - h1 - scrollTop) < 20) {
            this.props.isRefreshing = true;
            this.paint();
            console.log('加载中，请稍后~~~');
            this.loadMore();
        } 
    }
    public recordListItemClick(e:any,index:number) {
        const item = this.props.recordList[index];
        if (this.props.currencyName === CloudCurrencyType[CloudCurrencyType.SC] && item.oid) {
            popNew('app-view-wallet-cloudWalletCustomize-transactionDetails',{ 
                oid:item.oid,
                itype:item.itype,
                ctype:item.amount >= 0 ? 1 : 2 
            });
        }
    }
}

registerStoreData('cloud/cloudWallets', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updateRecordList();
    }
});
