'use client';

import { useEffect } from 'react';

export default function CodeCopyInstaller() {
  useEffect(() => {
    const preBlocks = document.querySelectorAll('.markdown-body pre');

    preBlocks.forEach((pre) => {
      // Prevent duplicate wrappers if re-rendered
      if (pre.parentElement?.classList.contains('code-block-wrapper')) return;

      // Create a wrapper container
      const wrapper = document.createElement('div');
      wrapper.className = 'code-block-wrapper';

      // Insert wrapper before pre
      pre.parentNode?.insertBefore(wrapper, pre);
      // Move pre into wrapper
      wrapper.appendChild(pre);

      // Create Copy Button
      const copyBtn = document.createElement('button');
      copyBtn.className = 'code-copy-btn';
      copyBtn.type = 'button';
      copyBtn.innerHTML = `
        <span class="copy-icon">📋</span>
        <span class="copy-text">Copy</span>
      `;

      // Add to wrapper
      wrapper.appendChild(copyBtn);

      // Event listener
      copyBtn.addEventListener('click', async () => {
        const codeElement = pre.querySelector('code');
        const codeText = codeElement?.innerText || '';

        try {
          await navigator.clipboard.writeText(codeText);

          // Show feedback
          copyBtn.classList.add('copied');
          copyBtn.innerHTML = `
            <span class="copy-icon">✅</span>
            <span class="copy-text">Copied!</span>
          `;

          setTimeout(() => {
            copyBtn.classList.remove('copied');
            copyBtn.innerHTML = `
              <span class="copy-icon">📋</span>
              <span class="copy-text">Copy</span>
            `;
          }, 2000);
        } catch (err) {
          console.error('Failed to copy code block content: ', err);
        }
      });
    });
  }, []);

  return null;
}
