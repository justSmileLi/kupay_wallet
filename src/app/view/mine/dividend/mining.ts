/**
 * 分红统计页面 
 * isOpen 是否展开详细描述
 * isComplete 是否已完成该挖矿步骤
 * 
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { getMining } from '../../../store/conMgr';

interface Items {
    isOpen:boolean;   
    isComplete:boolean;
    itemImg:string;
    itemName:string;
    itemNum:string;
    itemDetail:any;
    itemBtn:string;
    itemJump:string;
}

export class Dividend extends Widget {
    public ok: () => void;
    public state: {data:Items[]};
    constructor() {
        super();
    }

    public create() {
        this.state = {
            data:[
                {
                    isOpen:false,
                    isComplete:true,
                    itemImg:'../../../res/image/btn_back.png',
                    itemName:'创建钱包',
                    itemNum:'300.00',
                    itemDetail:`<div>1、创建钱包送300KT，每个APP最多创建10个钱包。</div>`,
                    itemBtn:'已创建',
                    itemJump:''
                },{
                    isOpen:false,
                    isComplete:true,
                    itemImg:'../../../res/image/btn_back.png',
                    itemName:'验证手机号',
                    itemNum:'2,500.00',
                    itemDetail:`<div>1、验证手机号，送2500KT。</div>
                    <div>2、一个钱包只能验证一个手机号。</div>`,
                    itemBtn:'已验证',
                    itemJump:''
                },{
                    isOpen:false,
                    isComplete:false,
                    itemImg:'../../../res/image/btn_back.png',
                    itemName:'存币送ETH',
                    itemNum:'200.00',
                    itemDetail:`<div>1、存币到自己的钱包地址上，存一个ETH送2000KT。</div>
                    <div>2、首次存币额外赠送1000KT。</div>
                    <div>3、1个BTC等于10个ETH。</div>`,
                    itemBtn:'去存币',
                    itemJump:''
                },{
                    isOpen:false,
                    isComplete:false,
                    itemImg:'../../../res/image/btn_back.png',
                    itemName:'与好友分享',
                    itemNum:'65,650,900.00',
                    itemDetail:`<div>1、系统赠送邀请红包限量1个，内含0.5ETH，分成单个0.015ETH等额红包。</div>
                    <div>2、每成功邀请一人获得500KT和0.01ETH。</div>
                    <div>3、成功邀请的标准是对方曾经达到1000KT</div>`,
                    itemBtn:'去分享',
                    itemJump:''
                },{
                    isOpen:false,
                    isComplete:false,
                    itemImg:'../../../res/image/btn_back.png',
                    itemName:'购买理财',
                    itemNum:'8,000.00',
                    itemDetail:`<div>1、每购买1ETH等价的理财产品每天送100KT。</div>
                    <div>2、购买当日额外赠送500KT。</div>
                    <div>3、首次购买额外赠送1500KT。</div>
                    <div>4、购买理财不会降低矿山</div>`,
                    itemBtn:'去购买',
                    itemJump:''
                },{
                    isOpen:false,
                    isComplete:false,
                    itemImg:'../../../res/image/btn_back.png',
                    itemName:'聊天',
                    itemNum:'300.00',
                    itemDetail:`<div>1、首次参与聊天赠送700。</div>`,
                    itemBtn:'去聊天',
                    itemJump:''
                }
            ]
        };

        getMining();
    }

    public backPrePage() {
        this.ok && this.ok();
    }

    /**
     * 查看挖矿记录
     */
    public goHistory() {
        popNew('app-view-mine-dividend-dividendHistory',2);
    }

    /**
     * 切换详情的展示与隐藏
     * @param ind 挖矿项目参数
     */
    public goToggle(ind:number) {
        this.state.data[ind].isOpen = !this.state.data[ind].isOpen;
        this.paint();
    }

    /**
     * 查看总排名情况
     */
    public goRank() {
        popNew('app-view-mine-dividend-dividendRank');
    }
    /**
     * 挖矿项目跳转
     * @param ind 挖矿项目参数
     */
    public goDetail(ind:number) {
        if (!this.state.data[ind].isComplete) {
            console.log(this.state.data[ind].itemBtn);
            // popNew(this.state.data[ind].itemJump);
        }
    }
}