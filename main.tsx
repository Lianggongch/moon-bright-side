import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Image } from './index';

// 渲染主组件
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <Image />
  </StrictMode>
);

