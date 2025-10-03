import type { BoxProps } from '@mui/material/Box';

import { forwardRef } from 'react';

import Box from '@mui/material/Box';

import { RouterLink } from 'src/routes/components';

import { logoClasses } from './classes';

// ----------------------------------------------------------------------

export type LogoProps = BoxProps & {
  href?: string;
  isSingle?: boolean;
  disableLink?: boolean;
};

export const Logo = forwardRef<HTMLDivElement, LogoProps>(
  (
    { width, href = '/', height, isSingle = true, disableLink = false, className, sx, ...other },
    ref
  ) => {
    
    // Đường dẫn tới file PNG
    const singleLogoSrc = '/assets/logo/logo.png';
    const fullLogoSrc = '/assets/logo/logo.png';

    // Component cho logo đơn
    const singleLogo = (
      <Box
        alt="Single logo"
        component="img"
        src={singleLogoSrc}
        width="100%"
        height="100%"
      />
    );

    // Component cho logo đầy đủ
    const fullLogo = (
      <Box
        alt="Full logo"
        component="img"
        src={fullLogoSrc}
        width="100%"
        height="100%"
      />
    );
    
    const baseSize = {
      width: width ?? 250,
      height: height ?? 50,
      ...(!isSingle && {
        width: width ?? 102,
        height: height ?? 36,
      }),
    };

    return (
      <Box
        ref={ref}
        component={RouterLink}
        href={href}
        className={logoClasses.root.concat(className ? ` ${className}` : '')}
        aria-label="Logo"
        sx={{
          ...baseSize,
          flexShrink: 0,
          display: 'inline-flex',
          verticalAlign: 'middle',
          ...(disableLink && { pointerEvents: 'none' }),
          ...sx,
        }}
        {...other}
      >
        {isSingle ? singleLogo : fullLogo}
      </Box>
    );
  }
);