import { useRef, useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { alpha,styled} from '@mui/material/styles';

const HighlightWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  '& p': {
    fontSize: '1.1rem',
    lineHeight: 1.8,
    marginBottom: theme.spacing(3),
    position: 'relative',
    transition: 'all 0.3s ease',
    padding: theme.spacing(1),
    borderRadius: theme.spacing(1),

    [theme.breakpoints.down('md')]: {
      fontSize: '1rem',
      padding: theme.spacing(0.5),
      marginBottom: theme.spacing(2),
    }
  },
  '& h2': {
    fontSize: '1.8rem',
    fontWeight: 600,
    marginTop: theme.spacing(6),
    marginBottom: theme.spacing(3),

    [theme.breakpoints.down('md')]: {
      fontSize: '1.5rem',
      marginTop: theme.spacing(4),
      marginBottom: theme.spacing(2),
    }
  },
  '& img': {
    width: '100%',
    borderRadius: theme.spacing(2),
    marginBottom: theme.spacing(3),
  },
  '& .read-text': {
    color: theme.palette.text.secondary,
    opacity: 0.7,
  },
  '& .current-paragraph': {
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
    borderLeft: `4px solid ${theme.palette.primary.main}`,
  }
}));

interface HighlightedContentProps {
  content: string;
  currentPosition: number;
  isPlaying: boolean;
  fontSize: number;
}

interface TextNode {
  node: Node;
  start: number;
  end: number;
  text: string;
}

export function HighlightedContent({ 
  content, 
  currentPosition, 
  isPlaying,
  fontSize 
}: HighlightedContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [textNodes, setTextNodes] = useState<TextNode[]>([]);
  const lastScrollTime = useRef(0);
  const scrollThreshold = 100; // ms between scrolls

  // Thu thập các text node khi content thay đổi
  useEffect(() => {
    if (!contentRef.current) return;

    const nodes: TextNode[] = [];
    let totalLength = 0;

    function walkTextNodes(node: Node) {
      if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
        const text = node.textContent;
        nodes.push({
          node,
          start: totalLength,
          end: totalLength + text.length,
          text
        });
        totalLength += text.length;
      }
      node.childNodes.forEach(walkTextNodes);
    }

    walkTextNodes(contentRef.current);
    setTextNodes(nodes);
  }, [content]);

  // Cập nhật style cho text đã đọc và đang đọc
  useEffect(() => {
    if (!contentRef.current || !isPlaying || textNodes.length === 0) return;

    const currentNode = textNodes.find(node => 
      currentPosition >= node.start && currentPosition <= node.end
    );

    if (!currentNode) return;

    try {
      // Cập nhật style cho các đoạn văn
      textNodes.forEach(node => {
        const parentElement = node.node.parentElement;
        if (!parentElement) return;

        if (node.end < currentPosition) {
          // Đoạn văn đã đọc xong
          parentElement.classList.add('read-text');
          parentElement.classList.remove('current-paragraph');
        } else if (node === currentNode) {
          // Đoạn văn đang đọc
          parentElement.classList.add('current-paragraph');
          parentElement.classList.remove('read-text');

          // Scroll to current paragraph with throttling
          const now = Date.now();
          if (now - lastScrollTime.current > scrollThreshold) {
            parentElement.scrollIntoView({
              behavior: 'smooth',
              block: 'center'
            });
            lastScrollTime.current = now;
          }
        } else {
          // Đoạn văn chưa đọc
          parentElement.classList.remove('read-text', 'current-paragraph');
        }
      });
    } catch (error) {
      console.error('Error updating text styles:', error);
    }
  }, [currentPosition, isPlaying, textNodes]);

  // Reset styles when stopped
  useEffect(() => {
    if (!isPlaying && contentRef.current) {
      Array.from(contentRef.current.getElementsByTagName('*'))
        .forEach(element => {
          element.classList.remove('read-text', 'current-paragraph');
        });
    }
  }, [isPlaying]);

  return (
    <HighlightWrapper 
      ref={contentRef}
      sx={{
        '& p': {
          fontSize: `${1.1 * fontSize}rem`,
        },
        '& h2': {
          fontSize: `${1.8 * fontSize}rem`,
        }
      }}
    >
      <div 
        dangerouslySetInnerHTML={{ __html: content }} 
        aria-label="Blog content"
      />
    </HighlightWrapper>
  );
} 