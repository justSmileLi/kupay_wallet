/**
 * 基础列表项组件
 * {"name":"拼手气红包","describe":"手气最好",img:"../../res/image/cloud_icon_cloud.png","rank":"001"}
 * img:图片路径
 * name:标题
 * rank:排名
 * describe：描述，可选
 */
// ================================ 导入
import { notify } from '../../../pi/widget/event';
import { Widget } from '../../../pi/widget/widget';

interface Props {
    img:string;
    name:string;
    rank:string;
    describe?:string;
}
// ================================ 导出

export class ImgAndBtnItem extends Widget {
    public props:Props;
    public ok: () => void;
    constructor() {
        super();
    }

    public backPrePage() {
        this.ok && this.ok();
    }

    public doTap(event:any) {
        notify(event.node,'ev-btn-tap',{});
    }
}