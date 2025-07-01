export interface TextSelection {
  text: string;
  startOffset: number;
  endOffset: number;
  containerElement: Element;
}

export const getTextSelection = (): TextSelection | null => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    return null;
  }

  const range = selection.getRangeAt(0);
  const selectedText = selection.toString().trim();
  
  if (!selectedText) {
    return null;
  }

  const container = range.commonAncestorContainer;
  const containerElement = container.nodeType === Node.TEXT_NODE 
    ? container.parentElement 
    : container as Element;

  if (!containerElement) {
    return null;
  }

  const textContent = containerElement.textContent || '';
  const beforeRange = document.createRange();
  beforeRange.setStart(containerElement, 0);
  beforeRange.setEnd(range.startContainer, range.startOffset);
  const startOffset = beforeRange.toString().length;
  const endOffset = startOffset + selectedText.length;

  return {
    text: selectedText,
    startOffset,
    endOffset,
    containerElement
  };
};

// シンプルなハイライト関数
export const highlightTextInElement = (
  element: Element,
  startOffset: number,
  endOffset: number,
  className: string,
  annotationId: string
): void => {
  const textContent = element.textContent || '';
  const beforeText = textContent.substring(0, startOffset);
  const highlightText = textContent.substring(startOffset, endOffset);
  const afterText = textContent.substring(endOffset);

  const newHTML = `${beforeText}<span class="${className}" data-annotation-id="${annotationId}" style="cursor: pointer;" title="クリックで削除">${highlightText}</span>${afterText}`;
  
  if (element instanceof HTMLElement) {
    element.innerHTML = newHTML;
  }
};

export const removeHighlight = (annotationId: string): void => {
  const highlightElements = document.querySelectorAll(`[data-annotation-id="${annotationId}"]`);
  highlightElements.forEach(element => {
    const parent = element.parentNode;
    if (parent) {
      parent.replaceChild(document.createTextNode(element.textContent || ''), element);
      parent.normalize();
    }
  });
};
