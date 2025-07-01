'use client'
import React, {useState} from "react";
import {useClipboard} from "../hooks/useClipboard";
import {Button} from "antd";

const ClipboardExample: React.FC = () => {
  const {copyToClipboard,pasteFromClipboard  } = useClipboard();
  const [pastedData, setPastedData] = useState<any>(null);
  const [content, setContent] = useState('');

  const readFromClipboard = async () => {
    try {
      // 检查API可用性
      if (!navigator.clipboard || !navigator.clipboard.readText) {
        throw new Error('浏览器不支持Clipboard API');
      }

     return await navigator.clipboard.readText();

    } catch (err) {
      console.log(`错误: ${err}`);
      setContent('');
    }
  };
  // 复制操作
  const handleCopy =async () => {
    const displayText = "React 对象1"; // 外部显示的文本
    const dataToCopy = { name: "React 对象", value: 123, description: "这是一个测试对象" }; // 要存储的数据
    await copyToClipboard(displayText, dataToCopy);
  };
  const handleCopyFromSystem =async () => {
     readFromClipboard().then( async (content)=>{
       const displayText = "React 对象11"; // 外部显示的文本
       console.log('[page]>>handleCopyFromSystem>>readFromClipboard:', content)
       await copyToClipboard(displayText, content);
     })

  };

  // 粘贴操作
  const handlePaste = async () => {
    const data = await pasteFromClipboard();
    setPastedData(data);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>剪贴板示例</h2>
      <Button onClick={handleCopy}>复制到剪贴板</Button>
      <Button onClick={handleCopyFromSystem}>复制到剪贴板</Button>
      <Button onClick={handlePaste}>从剪贴板粘贴</Button>

      {pastedData && (
        <div>
          <h3>粘贴内容:</h3>
          <pre>{JSON.stringify(pastedData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default ClipboardExample;