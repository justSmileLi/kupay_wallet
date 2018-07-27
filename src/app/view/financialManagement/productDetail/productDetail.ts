/**
 * 理财产品详情页面
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
export class ProductDetail extends Widget {
    public ok: () => void;
    constructor() {
        super();
    }
    public setProps(props: any, oldProps: any) {
        super.setProps(props,oldProps);
        this.init();
    }
    public init() {
        this.state = {};  
    }
    public goBackPage() {
        this.ok && this.ok();
    }
    public buyClicked() {
        popNew('app-view-financialManagement-purchase-purchase');
        this.ok && this.ok();
    }
}