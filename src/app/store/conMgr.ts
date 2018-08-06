/**
 * 连接管理
 */
import { closeCon, open, request, setUrl } from '../../pi/net/ui/con_mgr';
import { EthWallet } from '../core/eth/wallet';
import { sign } from '../core/genmnemonic';
import { GlobalWallet } from '../core/globalWallet';
import { getCurrentWallet, getLocalStorage, openBasePage } from '../utils/tools';
import { dataCenter } from './dataCenter';

// 枚举登录状态
export enum LoginState {
    init = 0,
    logining,
    logined,
    relogining,
    logouting,
    logouted,
    logerror
}
// 货币类型
export enum CurrencyType {
    KT = 100,
    ETH
}

// 枚举货币类型
export const CurrencyTypeReverse = {
    100: 'KT',
    101: 'ETH'
};

// 红包类型
export enum RedEnvelopeType {
    Normal = '01',
    Invite = '02'
}
export const conIp = '127.0.0.1';
export const conPort = '80';
// 分享链接前缀
export const sharePerUrl = `http://${conIp}:${conPort}/wallet/app/boot/share.html`;
/**
 * 登录状态
 */
let loginState: number = LoginState.init;

// 查询历史记录时一页的数量
const recordNumber = 10;
// 设置登录状态
const setLoginState = (s: number) => {
    if (loginState === s) {
        return;
    }
    loginState = s;
};
/**
 * 通用的异步通信
 */
export const requestAsync = async (msg: any): Promise<any> => {
    return new Promise((resolve, reject) => {
        request(msg, (resp: any) => {
            if (resp.type) {
                console.log(`错误信息为${resp.type}`);
                reject(resp);
            } else if (resp.result !== undefined) {
                resolve(resp);
            }
        });
    });
};
/**
 * 验证登录的异步通信
 */
export const requestLogined = async (msg: any) => {
    if (loginState === LoginState.logined) {
        return requestAsync(msg);
    } else {
        const wallets = getLocalStorage('wallets');
        const wallet = getCurrentWallet(wallets);
        let passwd = '';
        if (!dataCenter.getHash(wallet.walletId)) {
            passwd = await openBasePage('app-components-message-messageboxPrompt', {
                title: '输入密码', content: '', inputType: 'password'
            });
        }
        const wlt: EthWallet = await GlobalWallet.createWlt('ETH', passwd, wallet, 0);
        const signStr = sign(dataCenter.getConRandom(), wlt.exportPrivateKey());
        const msgLogin = { type: 'login', param: { sign: signStr } };
        setLoginState(LoginState.logining);
        const res: any = await requestAsync(msgLogin);
        if (res.result === 1) {
            setLoginState(LoginState.logined);

            return requestAsync(msg);
        }
        setLoginState(LoginState.logerror);

        return;
    }

};

/**
 * 开启连接并获取验证随机数
 */
export const openAndGetRandom = async () => {
    const wallets = getLocalStorage('wallets');
    const wallet = getCurrentWallet(wallets);
    if (!wallet) return;
    const oldUser = dataCenter.getUser();
    if (oldUser === wallet.walletId) return;
    const gwlt = GlobalWallet.fromJSON(wallet.gwlt);
    if (oldUser) {
        closeCon();
        setLoginState(LoginState.init);
        dataCenter.setUser(wallet.walletId);
        dataCenter.setUserPublicKey(gwlt.publicKey);

        return;
    }

    setUrl(`ws://${conIp}:2081`);
    dataCenter.setUser(wallet.walletId);
    dataCenter.setUserPublicKey(gwlt.publicKey);

    return new Promise((resolve, reject) => {
        open(() => {
            // 连接打开后开始设置账号缓存
            const msg = { type: 'get_random', param: { account: dataCenter.getUser().slice(2), pk: `04${dataCenter.getUserPublicKey()}` } };
            request(msg, (resp) => {
                if (resp.type) {
                    console.log(`错误信息为${resp.type}`);
                    reject(resp.type);
                } else if (resp.result !== undefined) {
                    dataCenter.setConRandom(resp.rand);
                    resolve(resp);
                }
            });
        }, (result) => {
            console.log(`open错误信息为${result}`);
            reject(result);
        }, () => {
            // 连接打开后开始设置账号缓存
            const msg = { type: 'get_random', param: { account: dataCenter.getUser().slice(2), pk: `04${dataCenter.getUserPublicKey()}` } };
            request(msg, (resp) => {
                if (resp.type) {
                    console.log(`错误信息为${resp.type}`);
                    reject(resp.type);
                } else if (resp.result !== undefined) {
                    dataCenter.setConRandom(resp.rand);
                    resolve(resp);
                }
            });
        });
    });

};

/**
 * 获取所有的货币余额
 */
export const getAllBalance = async () => {
    const msg = { type: 'wallet/account@get', param: { list: `[${CurrencyType.KT}, ${CurrencyType.ETH}]` } };

    return requestAsync(msg);
};

/**
 * 获取指定类型的货币余额
 */
export const getBalance = async (currencyType: CurrencyType) => {
    const msg = { type: 'wallet/account@get', param: { list: `[${currencyType}]` } };

    return requestAsync(msg);
};

/**
 * 获取分红信息
 */
export const getDividend = async () => {
    const msg = { type: 'wallet/cloud@get_bonus_info', param: {} };

    return requestAsync(msg);
};

/**
 * 获取挖矿总信息
 */
export const getMining = async () => {
    const msg = { type: 'wallet/cloud@get_mine_total', param: {} };

    return requestAsync(msg);
};

/**
 * 获取邀请红包码
 */
export const getInviteCode = async () => {
    const msg = { type: 'wallet/cloud@get_invite_code', param: {} };

    return requestAsync(msg);
};

/**
 * 兑换邀请红包
 */
export const inputInviteCdKey = async (code) => {
    const msg = { type: 'wallet/cloud@input_cd_key', param: { code: code } };

    return requestLogined(msg);
};

/**
 * 获取邀请红包领取明细
 */
export const getInviteCodeDetail = async () => {
    const msg = { type: 'wallet/cloud@get_invite_code_detail', param: {} };

    return requestAsync(msg);
};

/**
 * 兑换红包
 */
export const convertRedBag = async (cid) => {
    const msg = { type: 'convert_red_bag', param: { cid: cid } };

    return requestLogined(msg);
};

/**
 * 获取红包留言
 * @param cid 兑换码
 */
export const queryRedBagDesc = async (cid: string) => {
    const msg = {
        type: 'query_red_bag_desc',
        param: {
            cid
        }
    };

    return requestAsync(msg);
};

/**
 * 查询发送红包记录
 */
export const querySendRedEnvelopeRecord = async (start?:string) => {
    let msg;
    if (start) {
        msg = {
            type:'query_emit_log',
            param:{
                start,
                count:recordNumber
            }
        };
    } else {
        msg = {
            type:'query_emit_log',
            param:{
                count:recordNumber
            }
        };
    }
    
    return requestAsync(msg);
};

/**
 * 查询红包兑换记录
 */
export const queryConvertLog = async (count) => {
    const msg = { type: 'query_convert_log', param: { count: count } };

    return requestAsync(msg);
};

/**
 * 挖矿
 */
export const getAward = async () => {
    const msg = { type: 'wallet/cloud@get_award', param: {} };

    return requestAsync(msg);
};