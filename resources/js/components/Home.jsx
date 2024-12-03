import React, { useMemo, useState, useCallback } from 'react';
import { createEditor, Text } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import Prism from 'prismjs';
import 'prismjs/components/prism-python';
import 'prismjs/themes/prism-twilight.css';

// 初期値
const initialValue = [
    {
        type: 'code',
        children: [{ text: '# Pythonコードをここに入力してください\nprint("Hello")' }],
    },
];

const Home = () => {
    const editor = useMemo(() => withReact(createEditor()), []);
    const [value, setValue] = useState(initialValue);

    // 装飾関数の定義
    const decorate = useCallback(([node, path]) => {
        const ranges = [];
        if (!Text.isText(node)) {
            return ranges;
        }
        const tokens = Prism.tokenize(node.text, Prism.languages.python);
        let start = 0;
        for (const token of tokens) {
            const length = token.length;
            const end = start + length;
            if (typeof token !== 'string') {
                ranges.push({
                    anchor: { path, offset: start },
                    focus: { path, offset: end },
                    token: token.type,
                });
            }
            start = end;
        }
        return ranges;
    }, []);

    // カスタムLeafレンダリング
    const renderLeaf = useCallback(({ attributes, children, leaf }) => {
        return (
            <span {...attributes} className={leaf.token ? `token ${leaf.token}` : ''}>
                {children}
            </span>
        );
    }, []);

    return (
        <Slate editor={editor} initialValue={value} onChange={setValue}>
            <pre style={{ padding: '10px', background: '#282c34', color: 'white' }}>
            <Editable
                renderLeaf={renderLeaf}
                decorate={decorate}
                placeholder="Pythonコードを入力してください..."
            />
            </pre>
        </Slate>
    );
};

export default Home;
