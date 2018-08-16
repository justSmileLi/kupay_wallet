/**
 * 充值记录
 */
// ===============================================导入
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { getRechargeLogs } from '../../../net/pull';
import { RechargeWithdrawalLog } from '../../../store/interface';
import { register } from '../../../store/store';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

export class Charge extends Widget {
    constructor() {
        super();
    }
    public create() {
        super.create();
        this.init();
    }
    public async init() {
        this.state = { 
            infoList: []

        };
        getRechargeLogs();
    }
    public updateRechargeLogs(rechargeLogs:RechargeWithdrawalLog[]) {
        this.state.infoList = rechargeLogs;
        this.paint();
    }
}

// ==================本地
register('rechargeLogs',(rechargeLogs:RechargeWithdrawalLog[]) => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updateRechargeLogs(rechargeLogs);
    }
});