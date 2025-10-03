import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineSeparator } from '@mui/lab';
import { Box, Container, Typography } from '@mui/material'; 
import { Iconify } from 'src/components/iconify';
import { weddingStyles } from './styles';

const RootStyle = styled('div')(({ theme }) => ({
  ...weddingStyles.components.section(theme),
  background: weddingStyles.colors.background,
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
    background: `url('/assets/images/wedding/love-pattern.png')`,
    opacity: 0.03,
    pointerEvents: 'none',
  }
}));

const StoryCard = styled(motion.div)(({ theme }) => ({
  background: 'rgba(255,255,255,0.95)',
  borderRadius: theme.spacing(3),
  padding: theme.spacing(3),
  boxShadow: '0 8px 32px rgba(0,0,0,0.03)',
  border: `1px solid ${weddingStyles.colors.secondary}`,
  position: 'relative',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 48px rgba(0,0,0,0.06)',
    border: `1px solid ${weddingStyles.colors.primary}`,
  }
}));

const StoryImage = styled('img')(({ theme }) => ({
  width: '100%',
  height: 200,
  objectFit: 'cover',
  borderRadius: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const stories = [
  {
    date: '14.02.2020',
    title: 'Lần Đầu Gặp Gỡ',
    description: 'Chúng tôi gặp nhau lần đầu tại một quán cafe nhỏ. Đó là một ngày Valentine đáng nhớ...',
    image: '/assets/images/wedding/story/first-meet.jpg',
    icon: 'mdi:coffee'
  },
  {
    date: '20.07.2021',
    title: 'Hẹn Hò Chính Thức',
    description: 'Sau thời gian tìm hiểu, chúng tôi quyết định hẹn hò và bắt đầu chặng đường yêu thương...',
    image: '/assets/images/wedding/story/dating.jpg',
    icon: 'mdi:heart'
  },
  {
    date: '25.12.2023',
    title: 'Cầu Hôn Lãng Mạn',
    description: 'Dưới ánh đèn Giáng sinh lung linh, anh đã ngỏ lời cầu hôn và em đã nói "Đồng ý"...',
    image: '/assets/images/wedding/story/proposal.jpg',
    icon: 'mdi:ring'
  },
  {
    date: '22.03.2025',
    title: 'Ngày Cưới',
    description: 'Và rồi chúng tôi quyết định về chung một nhà, cùng viết tiếp câu chuyện tình yêu của mình...',
    image: '/assets/images/wedding/story/wedding.jpg',
    icon: 'mdi:church-heart'
  }
];

export function LoveStorySection() {
  return (
    <RootStyle id="story">
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Typography
              variant="h2"
              sx={{
                ...weddingStyles.typography.h2,
                mb: 2,
                background: `linear-gradient(45deg, ${weddingStyles.colors.text}, ${weddingStyles.colors.primary})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Chuyện Tình Yêu
            </Typography>
            <Typography
              sx={{
                color: weddingStyles.colors.text,
                opacity: 0.8,
                maxWidth: 600,
                mx: 'auto',
              }}
            >
              Hành trình yêu thương của chúng tôi
            </Typography>
          </motion.div>
        </Box>

        <Timeline position="alternate">
          {stories.map((story, index) => (
            <TimelineItem key={index}>
              <TimelineSeparator>
                <TimelineDot
                  sx={{
                    bgcolor: weddingStyles.colors.primary,
                    boxShadow: `0 0 0 4px ${weddingStyles.colors.secondary}`,
                  }}
                >
                  <Iconify icon={story.icon} width={24} height={24} />
                </TimelineDot>
                <TimelineConnector sx={{ bgcolor: weddingStyles.colors.secondary }} />
              </TimelineSeparator>

              <TimelineContent>
                <motion.div
                  initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <StoryCard>
                    <StoryImage src={story.image} alt={story.title} />
                    <Typography
                      variant="caption"
                      sx={{
                        color: weddingStyles.colors.primary,
                        fontWeight: 600,
                        mb: 1,
                        display: 'block',
                      }}
                    >
                      {story.date}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: "'Playfair Display', serif",
                        mb: 1,
                      }}
                    >
                      {story.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: weddingStyles.colors.text,
                        opacity: 0.8,
                        lineHeight: 1.8,
                      }}
                    >
                      {story.description}
                    </Typography>
                  </StoryCard>
                </motion.div>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </Container>
    </RootStyle>
  );
} 