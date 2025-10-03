// src/sections/album/components/PhotoFrame.tsx
import { motion } from 'framer-motion';
import { Box, Typography } from '@mui/material';
import { Download, Share, X, Heart, MessageCircle, Camera } from "lucide-react";
import { weddingData } from 'src/sections/wedding/weddingData';

const randomPosts = [
  { text: "Mỗi nụ cười hôm nay là một lời chúc phúc. Cảm ơn bạn đã đến!", hashtags: ["#WeddingDay", "#HappyTogether"] },
  { text: "Hôm nay là ngày hạnh phúc nhất của chúng tôi. Cảm ơn vì tất cả!", hashtags: ["#ForeverLove", "#JustMarried"] },
  { text: "Chúng ta mãi là gia đình. Cảm ơn mọi người đã đến và chung vui!", hashtags: ["#MrAndMrs", "#WeddingVibes"] },
  { text: "Một ngày đáng nhớ, một tình yêu trọn vẹn. Xin cảm ơn tất cả!", hashtags: ["#JustMarried", "#TheBestDay"] },
  { text: "Đây là một ngày thật ý nghĩa. Cảm ơn vì sự hiện diện của mọi người!", hashtags: ["#ForeverLove", "#WeddingDay"] },
  { text: "Chúng tôi biết ơn tất cả mọi người vì đã chung vui cùng trong ngày hôm nay. Tình yêu thật tuyệt vời!", hashtags: ["#HanhPhuc", "#LoveIsBeautiful"] },
  { text: "Tình yêu này được trân trọng và gìn giữ. Cảm ơn các bạn đã đến và làm ngày này trọn vẹn hơn!", hashtags: ["#ForeverTogether", "#WeddingBliss"] },
  { text: "Được làm vợ chồng là niềm hạnh phúc lớn lao. Cảm ơn tất cả mọi người đã cùng chúng tôi trong ngày đặc biệt này.", hashtags: ["#HappyTogether", "#LoveIsPatient"] },
  { text: "Hôm nay thật vui! Cảm ơn mọi người đã dành thời gian đến chung vui, chúng tôi sẽ mãi nhớ những khoảnh khắc này!", hashtags: ["#WeddingDay", "#ThankYou"] },
  { text: "Tất cả mọi người đều thật dễ thương. Cảm ơn các bạn rất nhiều vì đã đến!", hashtags: ["#SoCute", "#LoveYouAll"] },
];

interface PhotoFrameProps {
  src: string;
  frameType?: 'instagram' | 'stories';
  rotation?: number;
  size?: 'small' | 'medium' | 'large' |'super_small';
  delay?: number;
  style?: React.CSSProperties;
  user?: string;
  avatar?: string;
}

const PhotoFrame: React.FC<PhotoFrameProps> = ({
  src,
  frameType = 'instagram',
  rotation = 0,
  size = 'medium',
  delay = 0,
  style = {},
 user = `${weddingData.groom.nameShort} & ${weddingData.bride.nameShort}`,
  avatar = weddingData.images.mobilePhoto,
}) => {
  const sizeMap = {
    super_small: { width: 120, photoHeight: 100, padding: 4, iconSize: 10, textSize: '0.4rem', captionSize: '0.4rem' },
    small: { width: 220, photoHeight: 200, padding: 8, iconSize: 16, textSize: '0.8rem', captionSize: '0.7rem' },
    medium: { width: 300, photoHeight: 280, padding: 12, iconSize: 20, textSize: '0.9rem', captionSize: '0.8rem' },
    large: { width: 380, photoHeight: 360, padding: 16, iconSize: 24, textSize: '1rem', captionSize: '0.9rem' },
  };

  const { width, photoHeight, padding, iconSize, textSize, captionSize } = sizeMap[size];
  const randomIndex = Math.floor(Math.random() * randomPosts.length);
  const randomPost = randomPosts[randomIndex];

  const getFrameStyle = () => {
    switch (frameType) {
      case 'instagram':
        return {
          background: 'white',
          border: '1px solid #e6e6e6',
          borderRadius: 12,
          padding,
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
        };
      case 'stories':
        return {
          background: 'black',
          borderRadius: 8,
        };
      default:
        return {};
    }
  };

  const renderInstagramLayout = () => (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, px: 1 }}>
        <img
          src={avatar}
          alt={`${user} avatar`}
          style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}
        />
        <Typography variant="body1" sx={{ fontWeight: 'bold', ml: 1, fontSize: textSize }}>
          {user}
        </Typography>
      </Box>

      <Box sx={{ width: '100%', height: photoHeight, borderRadius: 1, overflow: 'hidden' }}>
        <img
          src={src}
          alt="Wedding moment"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </Box>

      <Box sx={{ mt: 1, px: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Heart size={iconSize} style={{ color: '#d32f2f' }} fill="#d32f2f" />
          <MessageCircle size={iconSize} style={{ color: '#555' }} />
          <Share size={iconSize} style={{ color: '#555' }} />
        </Box>

        <Box sx={{ mt: 1 }}>
          <Typography variant="body2" sx={{ fontSize: captionSize, whiteSpace: 'pre-wrap' }}>
            <span style={{ fontWeight: 'bold' }}>dattienwedding</span>{' '}
            {randomPost.text}
          </Typography>
          <Typography variant="caption" sx={{ color: '#00376b', mt: 0.5, display: 'block', fontSize: captionSize }}>
            {randomPost.hashtags.map((tag, index) => (
              <span key={index} style={{ marginRight: 4 }}>{tag}</span>
            ))}
          </Typography>
        </Box>
      </Box>
    </>
  );

  const renderStoriesLayout = () => (
    <Box sx={{
      position: 'relative',
      width: '100%',
      height: '100%',
    }}>
      <img
        src={src}
        alt="Wedding moment"
        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }}
      />

      <Box sx={{
        position: 'absolute',
        top: 8,
        left: 8,
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 20,
        p: 0.5,
      }}>
        <img
          src={avatar}
          alt={`${user} avatar`}
          style={{ width: 24, height: 24, borderRadius: '10%', objectFit: 'cover' }}
        />
        <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'white', ml: 1, mr: 1, fontSize: captionSize }}>
          {user}
        </Typography>
      </Box>

      <Box sx={{
        position: 'absolute',
        bottom: 8,
        left: 8,
        right: 8,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 8,
        p: 1,
      }}>
        <Typography variant="caption" sx={{ color: 'white', display: 'block', fontSize: captionSize }}>
          {randomPost.text}
        </Typography>
        <Typography variant="caption" sx={{ color: '#00376b', mt: 0.5, display: 'block', fontSize: captionSize }}>
          {randomPost.hashtags.map((tag, index) => (
            <span key={index} style={{ marginRight: 4 }}>{tag}</span>
          ))}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7, rotate: rotation }}
      animate={{ opacity: 1, scale: 1, rotate: rotation }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ duration: 1, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        position: 'relative',
        width,
        // Loại bỏ chiều cao cố định
        // height: height, 
        transform: `rotate(${rotation}deg)`,
        transformOrigin: 'center center',
        display: 'flex',
        flexDirection: 'column',
        ...getFrameStyle(),
        ...style,
      }}
      whileHover={{ 
        scale: 1.05, 
        rotate: rotation * 0.7,
        transition: { duration: 0.3 }
      }}
    >
      {frameType === 'instagram' ? renderInstagramLayout() : renderStoriesLayout()}
    </motion.div>
  );
};

export default PhotoFrame;