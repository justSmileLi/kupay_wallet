<div w-class="basicInput" style="{{it.style}}">
    <span w-class="prepend">
    {{if it.isShowPin}}<span w-class="other">{{it1.cfgData.pin}}</span>{{end}}
    <pi-ui-lang>{{it.prepend}}</pi-ui-lang>    
    </span>
    <span style="flex: 1;height: 100%;"><app-components1-input-input>{placeHolder: {{it.placeholder?it.placeholder:""}},style:"text-align: right;",itype:{{it.itype?it.itype:"text"}},input:{{it.input?it.input:''}} }</app-components1-input-input></span>
    {{if it.append && it.append!=""}}
    <span w-class="append">
        <pi-ui-lang>{{it.append}}</pi-ui-lang></span>
    {{end}}
</div>