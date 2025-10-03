import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { Box, Container, Typography } from '@mui/material';
import { weddingData } from './weddingData';

const palePink = '#fdcdddff';
const goldGradient = 'linear-gradient(100deg, #C62828, #f3e5a4ff, #C62828)';
const RootStyle = styled('div')(({ theme }) => ({
    height: '97vh',
    display: 'flex',
    // backgroundImage: `url('/assets/images/wedding/hoahongnhe.png')`,
    backgroundSize: 'cover',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    '&::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(to top, rgba(255,255,255,1), rgba(255,255,255,0.1), rgba(255,255,255,1))',
        backdropFilter: 'blur(3px)',
        zIndex: 1,
    },
}));

const InvitationCard = styled(motion.div)(({ theme }) => ({
    width: '100%',
    maxWidth: 800,
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: theme.spacing(8, 1),
    position: 'relative',
    zIndex: 5,
    [theme.breakpoints.up('md')]: {
        padding: theme.spacing(8, 6),
    },
}));

const Quote = styled(motion.div)(({ theme }) => ({
    textAlign: 'center',
    marginBottom: theme.spacing(4),
    fontFamily: "'Lora', serif",
    fontSize: '1rem',
    color: '#000',
    letterSpacing: '0.05em',
    lineHeight: 1.5,
    [theme.breakpoints.down('sm')]: {
        fontSize: '0.9rem',
    },
    '& .verse': {
        fontFamily: "'Lora', serif",
        marginTop: theme.spacing(1),
        fontSize: '0.8rem',
        fontStyle: 'italic',
        color: '#000',
    },
    '& .quote-text': {
        fontFamily: "'SVN-Gotham', serif",
        fontSize: '1rem',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        [theme.breakpoints.down('sm')]: {
            whiteSpace: 'normal',
            fontSize: '0.8rem',
        }
    }
}));

const TopCurveTransition = styled('div')(({ theme }) => ({
    position: 'absolute',
    top: -1,
    left: 0,
    width: '100%',
    height: '120px',
    zIndex: 5,
    overflow: 'hidden',
    transform: 'rotate(180deg)',
    '& svg': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        fill: theme.palette.background.paper,
        filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.02))',
    }
}));

const NamesWrapper = styled(Box)(({ theme }) => ({
    position: 'relative',
    textAlign: 'center',
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(8),
}));
// const SaveTheDate = styled(Typography)(({ theme }) => ({
//     textAlign: 'center',
//     fontFamily: "'SVN-Gotham', serif",
//     fontSize: '1.8rem',
//     fontWeight: 600,
//     textTransform: 'uppercase',
//     letterSpacing: '0.25em',
//     marginBottom: theme.spacing(1),
//     background: 'linear-gradient(90deg, #928362, #ffffff, #928362)',
//     backgroundSize: '200% auto',
//     WebkitBackgroundClip: 'text',
//     WebkitTextFillColor: 'transparent',
//     animation: 'shine 2s linear infinite',
//     '@keyframes shine': {
//         to: {
//             backgroundPosition: '200% center',
//         },
//     },
// }));
const SaveTheDate = styled(Typography)(() => ({
    textAlign: 'center',
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.3rem',
    fontWeight: 400,
    letterSpacing: '0.3em',
    marginBottom: '1rem',
    color: "#C62828",
    // lineHeight: 1.2,
    background: goldGradient,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textShadow: '0 2px 4px rgba(0,0,0,0.03)',
    backgroundSize: '200% auto',
    animation: 'shine 4s linear infinite',
    '@keyframes shine': {
        to: {
            backgroundPosition: '200% center',
        },
    },

}));

const WeddingDate = styled(Typography)(({ theme }) => ({
    textAlign: 'center',
    fontFamily: "'TPLeMajor', cursive",
    fontSize: '1rem',
    color: '#000',
    fontWeight: 600,
    letterSpacing: '0.25em',
    marginBottom: theme.spacing(3),
    textShadow: '0 1px 2px rgba(0,0,0,0.1)',
}));

const Names = styled('div')(({ theme }) => ({
    position: 'relative',
    textAlign: 'center',
    zIndex: 1,
    '& .name': {
        fontFamily: "'Oooh Baby', cursive",
        fontSize: '3rem',
        letterSpacing: '0.08em',
        fontWeight: 400,
      color: "#C62828",
    // lineHeight: 1.2,
    background: goldGradient,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textShadow: '0 2px 4px rgba(0,0,0,0.03)',
    backgroundSize: '200% auto',
    animation: 'shine 4s linear infinite',
    '@keyframes shine': {
        to: {
            backgroundPosition: '200% center',
        },
    },
        // background: goldGradient,
        // WebkitBackgroundClip: 'text',
        // WebkitTextFillColor: 'transparent',
        lineHeight: 1.2,
        [theme.breakpoints.down('md')]: {
            fontSize: '3rem',
        },
        //       backgroundSize: '200% auto',
        //   animation: 'shine 4s linear infinite',
        //   '@keyframes shine': {
        //     to: {
        //       backgroundPosition: '200% center',
        //     },
        //   },
    },
    '& .divider-decor': {
        position: 'relative',
        height: '40px',
        width: '40px',
        margin: '25px auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '& .line': {
            position: 'absolute',
            width: '1px',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.08)',
            left: '50%',
            transform: 'translateX(-50%)',
        },
        '& .leaf-icon': {
            position: 'absolute',
            width: '20px',
            height: '20px',
            backgroundColor: palePink,
            borderRadius: '0 50% 50% 50%',
            transform: 'rotate(45deg)',
            boxShadow: '0 0 6px rgba(253,205,221,0.8)',
            animation: 'glow 3s ease-in-out infinite alternate',
            '&.top': { top: '5px' },
            '&.bottom': { bottom: '5px', transform: 'rotate(-135deg)' },
        },
        '@keyframes glow': {
            from: { opacity: 0.6 },
            to: { opacity: 1 },
        },
    },
}));


// const WeddingDate = styled(Typography)(({ theme }) => ({
//     textAlign: 'center',
//     fontFamily: "'Lora', serif",
//     fontSize: '1rem',
//     color: '#666',
//     letterSpacing: '0.15em',
//     marginBottom: theme.spacing(6),
//     [theme.breakpoints.down('sm')]: {
//         fontSize: '0.9rem',
//     }
// }));

// const Names = styled('div')(({ theme }) => ({ // Thay đổi thành div thông thường
//     position: 'relative',
//     zIndex: 1,
//     '& .name': {
//         fontFamily: "'TPLeMajor', cursive",
//         fontSize: '3.5rem',      // tăng chút
//         letterSpacing: '0.05em', // cho thoáng hơn
//         color: '#928362',
//         fontWeight: 400,
//         lineHeight: 1.2,
//         textShadow: '1px 1px 2px rgba(0,0,0,0.05)',
//         [theme.breakpoints.down('md')]: {
//             fontSize: '2.5rem',
//         },
//     },
//     '& .divider-decor': {
//         position: 'relative',
//         height: '40px',
//         width: '40px',
//         margin: '25px auto',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         pointerEvents: 'none',
//         '& .line': {
//             position: 'absolute',
//             width: '1px',
//             height: '100%',
//             backgroundColor: 'rgba(0,0,0,0.1)',
//             top: 0,
//             left: '50%',
//             transform: 'translateX(-50%)',
//         },
//         '& .leaf-icon': {
//             position: 'absolute',
//             width: '20px',
//             height: '20px',
//             backgroundColor: palePink,
//             borderRadius: '0 50% 50% 50%',
//             transform: 'rotate(45deg)',
//             opacity: 0.7,
//             '&.top': {
//                 top: '5px',
//             },
//             '&.bottom': {
//                 bottom: '5px',
//                 transform: 'rotate(-135deg)',
//             }
//         }
//     }
// }));

const InvitationWrapper = styled(Box)({
    textAlign: 'center',
    marginTop: '2rem',
});

const InvitationText = styled(Typography)(({ theme }) => ({
    fontFamily: "'Playfair Display', sans-serif",
    fontSize: '0.8rem',
    color: '#000',
    letterSpacing: '0.25em',
    textTransform: 'uppercase',
    position: 'relative',
    padding: theme.spacing(2, 0),
    '&::before, &::after': {
        content: '""',
        position: 'absolute',
        backgroundColor: 'rgba(0,0,0,0.1)',
        top: '50%',
        transform: 'translateY(-50%)',
    },
    '&::before': { left: 'calc(50% - 100px)' },
    '&::after': { right: 'calc(50% - 100px)' },
}));

// Các component mới để xử lý việc xuống dòng và căn chỉnh
const GuestNameContainer = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    width: '100%',
});

const GuestLine = styled(Box)({
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    marginBottom: '10px', // Khoảng cách giữa các dòng
});

const GuestText = styled(Typography)({
    position: 'relative',
    fontFamily: "'Oooh Baby', cursive",
    fontSize: '2rem',
    color: '#000',
    lineHeight: 1,
    zIndex: 2,
    marginBottom: '-8px', // Sử dụng margin âm để kéo text xuống
});

const DottedLine = styled('div')({
    width: '80%',
    borderBottom: '2px dotted #000',
    position: 'relative',
    zIndex: 1,
});

export function BibleSection() {
    const [guestName, setGuestName] = useState<string | null>(null);
    const [nameLines, setNameLines] = useState<string[]>([]);

  useEffect(() => {
  let nameFromUrl = null;

  // Thử lấy bằng URLSearchParams trước
  const params = new URLSearchParams(window.location.search);
  nameFromUrl = params.get("name");

  // Nếu bị Messenger cắt cụt (chỉ còn "Đỗ"), thử lấy từ href
  if (!nameFromUrl && typeof window !== "undefined") {
    const href = decodeURIComponent(window.location.href);
    const match = href.match(/name=(.*)/); // lấy mọi thứ sau "name="
    if (match) {
      nameFromUrl = match[1].trim();
    }
  }

  if (nameFromUrl) {
    // Chuẩn hóa khoảng trắng
    const normalizedName = nameFromUrl.replace(/\s+/g, " ").trim();
    setGuestName(normalizedName);
  }
}, []);


    useEffect(() => {
        if (guestName) {
            const words = guestName.split(' ');
            let lines: string[] = [];
            let currentLine = '';
            const maxCharsPerLine = 25;

            words.forEach(word => {
                if ((currentLine + ' ' + word).trim().length <= maxCharsPerLine) {
                    currentLine = (currentLine + ' ' + word).trim();
                } else {
                    if (currentLine) {
                        lines.push(currentLine);
                    }
                    currentLine = word;
                }
            });
            if (currentLine) {
                lines.push(currentLine);
            }
            setNameLines(lines);
        }
    }, [guestName]);

    return (
        <RootStyle>
            <TopCurveTransition>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1440 320"
                    preserveAspectRatio="none"
                    fill='#333'
                >
                    <path
                        d="M0,64L60,80C120,96,240,128,360,138.7C480,149,600,139,720,122.7C840,107,960,85,1080,90.7C1200,96,1320,128,1380,144L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
                    />
                </svg>
            </TopCurveTransition>
            <Container
                maxWidth="lg"
                sx={{
                    position: 'relative',
                    zIndex: 10,
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <InvitationCard
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    viewport={{ once: true, amount: 0.8 }}
                >
                   
                    <SaveTheDate>
                        THIỆP THÀNH HÔN
                    </SaveTheDate>
                    <WeddingDate>12 . 10 . 2025</WeddingDate>
                    <NamesWrapper>
                        <Names>
                            <Typography className="name">
                                Hữu Tâm
                            </Typography>
                            <Box className="divider-decor">
                                <div className="line" />
                                <div className="leaf-icon top" />
                                <div className="leaf-icon bottom" />
                            </Box>
                            <Typography className="name">
                               Nguyễn Hồng
                            </Typography>
                        </Names>
                    </NamesWrapper>
                    <InvitationWrapper>
                        <InvitationText>Trân Trọng Kính Mời</InvitationText>
                        {guestName && (
                            <GuestNameContainer>
                                {nameLines.map((line, index) => (
                                    <GuestLine key={index}>
                                        <GuestText>{line}</GuestText>
                                        <DottedLine />
                                    </GuestLine>
                                ))}
                            </GuestNameContainer>
                        )}
                    </InvitationWrapper>
                </InvitationCard>
            </Container>
        </RootStyle>
    );
}