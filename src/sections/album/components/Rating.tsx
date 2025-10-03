// components/Rating.tsx
import React, { useState } from 'react';
import { Box, IconButton } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

interface RatingProps {
    initialRating: number;
    onRate: (rating: number) => void;
}

const Rating: React.FC<RatingProps> = ({ initialRating, onRate }) => {
    const [hoverRating, setHoverRating] = useState<number>(0);

    return (
        <Box sx={{ display: 'flex' }}>
            {[1, 2, 3, 4, 5].map((star) => (
                <IconButton
                    key={star}
                    size="small"
                    onClick={() => onRate(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    sx={{ color: star <= (hoverRating || initialRating) ? '#FFD700' : 'grey.600', padding: 0 }}
                >
                    {star <= (hoverRating || initialRating) ? <StarIcon /> : <StarBorderIcon />}
                </IconButton>
            ))}
        </Box>
    );
};

export default Rating;