import React, { useMemo, useCallback } from 'react';
import { createEditor, Text } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import Prism from 'prismjs';
import 'prismjs/components/prism-python';
import 'prismjs/themes/prism-twilight.css';

const CodeEditor = ({ code, onChange }) => {
    const editor = useMemo(() => withReact(createEditor()), []);

    // 装飾関数
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

    // Leafレンダリング
    const renderLeaf = useCallback(({ attributes, children, leaf }) => {
        return (
            <span {...attributes} className={leaf.token ? `token ${leaf.token}` : ''}>
                {children}
            </span>
        );
    }, []);

    // Slateのキーをcodeの値に基づいて更新
    const editorKey = useMemo(() => JSON.stringify(code), [code]);

    return (
        <Slate key={editorKey} editor={editor} initialValue={code} onChange={onChange}>
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

export default CodeEditor;
