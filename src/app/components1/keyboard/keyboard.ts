/**
 * pasword screen
 */
import { Json } from '../../../pi/lang/type';
import { Widget } from '../../../pi/widget/widget';

interface Props {
    title: string;
    closePage?:boolean;
}

export class KeyBoard extends Widget {
    public props: Props;
    public ok:(value:string) => void;
    public cancel:() => void;
    constructor() {
        super();
    }

    public setProps(oldProps:Json,props:Json) {
        super.setProps(oldProps,props);
        this.init();
    }

    public init() {
        this.state = {
            defArr:[1,2,3,4,5,6],
            numbers:[1,2,3,4,5,6,7,8,9,'',0,'x'],
            pswArr:[],
            closePage:this.props.closePage ? false :true
        };
    }

    /**
     * 键盘点击事件处理
     */
    public boardItemClick(ind:number) {
        const val = this.state.numbers[ind];

        if (val !== '' && val !== 'x') {
            this.state.pswArr.push(val);
            this.paint();
        } else if (val === 'x') {
            this.clearClick();
        } else {
            return;
        }

        if (this.state.pswArr.length === 6) {
            setTimeout(() => {
                this.ok && this.ok(this.state.pswArr.join(''));
            }, 100);
        }
    }

    /**
     * 清除输入数据
     */
    public clearClick() {
        if (this.state.pswArr.length === 0) return;
        this.state.pswArr.pop();
        this.paint();
    }

    public close() {
        this.cancel && this.cancel();
    }

}
