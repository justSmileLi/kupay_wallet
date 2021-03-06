/**
 * create a wallet by image
 */
import { popNew } from '../../../../pi/ui/root';
import { getLang } from '../../../../pi/util/lang';
import { Widget } from '../../../../pi/widget/widget';
import { CreateWalletType } from '../../../logic/localWallet';
import { selectImage } from '../../../logic/native';
import { findModulConfig } from '../../../modulConfig';
import { pswEqualed } from '../../../utils/account';

export class CreateWalletByImage extends Widget {
    public ok: () => void;
    public language:any;
    public create() {
        super.create();
        this.init();
    }
    public init() {
        this.language = this.config.value[getLang()];
        this.state = {
            chooseImage:false,
            imageBase64:'',
            imageHtml:'',
            imagePsw:'',
            imagePswAvailable:false,
            imgagePswConfirm:'',
            pswEqualed:false,
            walletName:findModulConfig('WALLET_NAME')
        };
    }
    public backPrePage() {
        this.ok && this.ok();
    }
    public selectImageClick() {
        selectImage((width, height, base64) => {
            this.state.chooseImage = true;
            // tslint:disable-next-line:max-line-length
            this.state.imageHtml = `<div style="background-image: url(${base64});width: 100%;height: 100%;position: absolute;top: 0;background-size: cover;background-position: center;background-repeat: no-repeat;"></div>`;
            this.state.imageBase64 = base64;
            console.log(base64);
            this.paint();
        });
    }

    public imagePswClick() {
        // 防止事件冒泡  on-tap事件已经处理
    }

    public imagePswChange(e:any) {
        this.state.imagePsw = e.value;
        this.state.imagePswAvailable = this.state.imagePsw.length > 0;
        this.state.pswEqualed = pswEqualed(this.state.imagePsw, this.state.imgagePswConfirm);
        this.paint();
    }

    public imagePswConfirmChange(e:any) {
        this.state.imgagePswConfirm = e.value;
        this.state.pswEqualed = pswEqualed(this.state.imagePsw, this.state.imgagePswConfirm);
        this.paint();
    }

    public nextClick() {
        if (!this.state.chooseImage) {
            popNew('app-components1-message-message', { content: this.language.tips[0] });

            return;
        }
        if (!this.state.pswEqualed) {
            popNew('app-components1-message-message', { content: this.language.tips[1] });

            return;
        }
        // tslint:disable-next-line:max-line-length
        popNew('app-view-wallet-create-createWallet',{ itype:CreateWalletType.Image,imageBase64:this.state.imageBase64,imagePsw:this.state.imagePsw });
        this.ok && this.ok();
    }
}