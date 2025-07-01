'use client'
import React, {Fragment} from "react";
import '@ant-design/v5-patch-for-react-19';
import {NextPage} from "next";
import {Button} from "antd";
import NiceModal from "@ebay/nice-modal-react";
import {MyAntdModal} from "@/app/modal/modalA";



const Test: NextPage<never> = () => {
    const onButtonClick = () => {
        console.log(123123)
        NiceModal.show(MyAntdModal).then(r => console.log(r,111)).catch((error)=>{
            console.log(error)})
    }

    return (
        <NiceModal.Provider>
        <Fragment>
<Button type={'primary'} onClick={onButtonClick}>
    打开弹窗A
</Button>
        </Fragment>
    </NiceModal.Provider>
    );
}
export default Test