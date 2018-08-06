/**
 * send red-envelope
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { CurrencyType, RedEnvelopeType, requestLogined, sharePerUrl } from '../../../store/conMgr';
import { redEnvelopeSupportCurrency } from '../../../utils/constants';
import { getByteLen, largeUnit2SmallUnit, openBasePage } from '../../../utils/tools';

interface Props {
    balance:any;
}
export class SendRedEnvelope extends Widget {
    public ok:() => void;
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        this.init();
    }

    public init() {
        this.state = {
            itype:0,// 0 等额红包  1 拼手气红包
            balance:this.getBalance(redEnvelopeSupportCurrency[0]),
            currencyName:redEnvelopeSupportCurrency[0],
            singleAmount:0,
            redEnvelopeNumber:0,
            totalAmount:0,
            leaveMessage:'恭喜发财  万事如意',
            leaveMessageMaxLen:20
        };
    }

    public backPrePage() {
        this.ok && this.ok();
    }
    
    // 获取余额
    public getBalance(currencyName:string) {
        return this.props.balance[currencyName];
    }
    // 单个金额改变
    public singleAmountInputChange(e:any) {
        const amount = Number(e.value);
        this.state.singleAmount = amount;
        this.state.totalAmount = amount * this.state.redEnvelopeNumber;
        this.paint();
    }
    // 红包个数改变
    public redEnvelopeNumberChange(e:any) {
        const num = Number(e.value);
        this.state.redEnvelopeNumber = num;
        if (this.state.itype === 0) {
            this.state.totalAmount = num * this.state.singleAmount;
        }
        this.paint();
    }
    // 总金额改变
    public totalAmountInputChange(e:any) {
        this.state.totalAmount = Number(e.value);
        this.paint();
    }
    // 红包类型切换
    public redEnvelopeTypeSwitchClick() {
        this.state.itype = this.state.itype === 0 ? 1 : 0;
        this.state.singleAmount = 0;
        this.state.redEnvelopeNumber = 0;
        this.state.totalAmount = 0;
        this.paint();
    }
    public leaveMessageChange(e:any) {
        this.state.leaveMessage = e.value;
    }

    // 发送
    public async sendRedEnvelopeClick() {
        if (this.state.itype === 0 && this.state.singleAmount <= 0) {
            popNew('app-components-message-message',{ itype:'error',content:'请输入要发送的单个红包金额',center:true });

            return;
        }
        if (this.state.itype !== 0 && this.state.totalAmount <= 0) {
            popNew('app-components-message-message',{ itype:'error',content:'请输入要发送的红包总金额',center:true });

            return;
        }
        if (this.state.redEnvelopeNumber <= 0) {
            popNew('app-components-message-message',{ itype:'error',content:'请输入要发送红包数量',center:true });

            return;
        }
        if (this.state.totalAmount > this.state.balance) {
            popNew('app-components-message-message',{ itype:'error',content:'余额不足',center:true });

            return;
        }
        if (getByteLen(this.state.leaveMessage) > this.state.leaveMessageMaxLen * 2) {
            popNew('app-components-message-message',{ itype:'error',content:`留言最多${this.state.leaveMessageMaxLen}个字`,center:true });
            this.state.leaveMessage = '';
            this.paint();

            return;
        }
        const close = popNew('pi-components-loading-loading',{ text:'加载中...' });
        const res = await this.sendRedEnvlope();
        close.callback(close.widget);
        if (res.result === 1) {
            popNew('app-view-redEnvelope-send-shareRedEnvelope',{
                rid:res.value,
                leaveMessage:this.state.leaveMessage,
                currencyName:this.state.currencyName
            });
            // tslint:disable-next-line:max-line-length
            console.log('url',`${sharePerUrl}?type=${RedEnvelopeType.Normal}&rid=${res.value}&lm=${(<any>window).encodeURIComponent(this.state.leaveMessage)}`);
        } else {
            popNew('app-components-message-message',{ itype:'error',content:'出错啦,请重试',center:true });
        }
        
    }
    
    // 红包记录
    public redEnvelopeRecordsClick() {
        popNew('app-view-redEnvelope-send-redEnvelopeRecord');
        
    }
    // 选择要发红包的货币
    public async chooseCurrencyClick() {
        // tslint:disable-next-line:max-line-length
        const index = await openBasePage('app-components-chooseCurrency-chooseCurrency',{ currencyList:redEnvelopeSupportCurrency,balance:this.props.balance });
        this.state.currencyName = redEnvelopeSupportCurrency[index];
        this.state.balance = this.getBalance(redEnvelopeSupportCurrency[index]);
        this.paint();
    }

    public async sendRedEnvlope() {
        // 发红包
        const msgSendRedEnvelope = {
            type:'emit_red_bag',
            param:{
                type:this.state.itype,
                priceType:CurrencyType[this.state.currencyName],
                totalPrice:largeUnit2SmallUnit(this.state.currencyName,this.state.totalAmount),
                count:this.state.redEnvelopeNumber,
                desc:this.state.leaveMessage
            }
        };
        // tslint:disable-next-line:no-unnecessary-local-variable
        const res = await requestLogined(msgSendRedEnvelope);
        console.log('emit_red_bag',res);

        return res;
    }
}