<div w-class="asset-container">
    <div w-class="total-asset-container">
        <div w-class="total-asset"><pi-ui-lang>{"zh_Hans":"本地资产：≈","zh_Hant":"本地資產：≈","en":""}</pi-ui-lang>{{it1.currencyUnitSymbol}}{{it1.totalAsset}}</div>
        <img src="../../../res/image1/add.png" w-class="add-asset" on-tap="addAssetClick"/>
    </div>
    <div w-class="asset-list" ev-item-click="itemClick">
        <app-components1-walletAssetList-walletAssetList>{ assetList:{{it1.assetList}},redUp:{{it1.redUp}},currencyUnitSymbol:{{it1.currencyUnitSymbol}} }</app-components1-walletAssetList-walletAssetList>
    </div>
</div>