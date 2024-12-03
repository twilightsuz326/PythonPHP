import React from 'react';

function CodeElement({ attributes, children }) {
    return (
        <pre {...attributes}>
            <code>{children}</code>
        </pre>
    );
};

export default CodeElement;