'use client'
import '@ant-design/v5-patch-for-react-19';
import {Button, Modal} from "antd";
import NiceModal, {useModal} from "@ebay/nice-modal-react";
import React, {useCallback} from "react";
import {MyAntdModal} from "@/app/modal/modalA";

export const ModalB = NiceModal.create(() => {
    const modal = useModal();
    const onButtonClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
        NiceModal.show(MyAntdModal)
    }, []);
    return (
        <Modal
            title="Hello Antd"
            onOk={modal.hide}
            onCancel={modal.hide}
            afterClose={modal.remove}
        >
           <h1>BBBBB</h1>
            <Button type={'primary'} onClick={onButtonClick}>
                打开弹窗A
            </Button>
        </Modal>
    );
});