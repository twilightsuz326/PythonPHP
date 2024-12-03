import React, { useMemo, useState, useCallback } from 'react';
import { createEditor, Range } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import Prism from 'prismjs';
import 'prismjs/components/prism-python';
import 'prismjs/themes/prism-twilight.css';

// 初期値
const initialValue = [
    {
        type: 'code',
        children: [{ text: '# Pythonコードをここに入力してください' }],
    },
];

const PythonEditor = () => {
    const editor = useMemo(() => withReact(createEditor()), []);
    const [value, setValue] = useState(initialValue);

    // 装飾関数の定義
    const decorate = useCallback(([node, path]) => {
        const ranges = [];
        if (node.text) {
            const tokens = Prism.tokenize(node.text, Prism.languages.python);
            let start = 0;

            for (const token of tokens) {
                const length = typeof token === 'string' ? token.length : token.content.length;

                if (typeof token !== 'string') {
                    ranges.push({
                        anchor: { path, offset: start },
                        focus: { path, offset: start + length },
                        className: `token ${token.type}`,
                    });
                }
                start += length;
            }
        }
        return ranges;
    }, []);

    // カスタムLeafレンダリング
    const renderLeaf = useCallback(({ attributes, children, leaf }) => {
        return (
            <span {...attributes} className={leaf.className || ''}>
                {children}
            </span>
        );
    }, []);

    // ノードのカスタムレンダリング
    const renderElement = useCallback(({ attributes, children, element }) => {
        switch (element.type) {
            case 'code':
                return (
                    <pre {...attributes} style={{ background: '#282c34', padding: '3px', margin: '0px', color: 'white'}}>
                        <code>{children}</code>
                    </pre>
                );
            default:
                return <p {...attributes}>{children}</p>;
        }
    }, []);

    return (
        <Slate editor={editor} initialValue={value} onChange={setValue}>
            <Editable
                renderElement={renderElement}
                renderLeaf={renderLeaf}
                decorate={decorate}
                placeholder="Pythonコードを入力してください..."
                onKeyDown={(event) => {
                    if (event.key === 'Tab') {
                        event.preventDefault();
                        editor.insertText('  ');
                    }
                }}
                spellCheck={false}
                autoCorrect="off"
                autoCapitalize="off"
            />
        </Slate>
    );
};

export default PythonEditor;
