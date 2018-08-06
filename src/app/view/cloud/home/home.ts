/**
 * 云端首页
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { 
    CurrencyType, 
    CurrencyTypeReverse, 
    getAllBalance, 
    getAward, 
    getInviteCode, 
    getInviteCodeDetail } from '../../../store/conMgr';
import { kpt2kt, wei2Eth } from '../../../utils/tools';
export class Home extends Widget {
    constructor() {
        super();
    }
    public create() {
        super.create();
        this.init();
    }
    public init(): void {
        this.state = {
            balance:{
                KT:0.00,
                ETH:0.00
            },
            ktBalance: 0.00,// kt余额
            ethBalance: 0.00,// eth余额
            bonus: 0.00// 累计分红
        };

        this.initDate();
    }

    /**
     * 点击云端账户
     */
    public async cloudAccountClicked() {
        popNew('app-view-cloud-cloudAccount-cloudAccount', { ktBalance: this.state.ktBalance, ethBalance: this.state.ethBalance });
    }

    /**
     * 点击发红包
     */
    public packetsClicked() {
        // TODO
        popNew('app-view-redEnvelope-send-sendRedEnvelope',{ balance:this.state.balance });    }

    /**
     * 点击兑换领奖
     */
    public awardsClicked() {
        // TODO
        popNew('app-view-redEnvelope-receive-convertRedEnvelope');
    }
    /**
     * 领分红
     */
    public bonusClicked() {
        // TODO
        popNew('app-view-mine-dividend-dividend');
    }
    /**
     * 点击邀请好友
     */
    public friendsClicked() {
        // TODO
    }
    public toTradingPlaces() {
        // TODO
    }
    /**
     * 显示挖矿详情
     */
    public mining() {
        popNew('app-view-mine-dividend-mining');
    }
    /**
     * 挖矿
     */
    public async doPadding() {
        const r = await getAward();
        if (r.result !== 1) {
            popNew('app-components-message-message', { itype: 'outer', center: true, content: `挖矿失败(${r.result})` });

            return;
        }
        popNew('app-components-message-message', { itype: 'outer', center: true, content: '挖矿成功' });
    }
    /**
     * 邀请红包
     */
    public async inviteRedEnvelopeClick() {
        const inviteCodeInfo = await getInviteCode();
        const inviteCodeDetailInfo = await getInviteCodeDetail();
        if (inviteCodeInfo.result !== 1 || inviteCodeDetailInfo.result !== 1) return;
        popNew('app-view-redEnvelope-send-inviteRedEnvelope', {
            inviteCode: inviteCodeInfo.cid, inviteCodeDetailInfo: inviteCodeDetailInfo.value
        });
    }

    private async initDate() {
        const balanceInfo = await getAllBalance();
        for (let i = 0; i < balanceInfo.value.length; i++) {
            const each = balanceInfo.value[i];
            const CurrencyName = CurrencyTypeReverse[each[0]];
            if (each[0] === CurrencyType.KT) {
                this.state.ktBalance = kpt2kt(each[1]);
                this.state.balance[CurrencyName] = kpt2kt(each[1]);
            } else if (each[0] === CurrencyType.ETH) {
                this.state.ethBalance = wei2Eth(each[1]);
                this.state.balance[CurrencyName] = wei2Eth(each[1]);
            }
        }
        this.paint();
    }
}