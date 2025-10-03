import type { Theme, SxProps, Breakpoint } from '@mui/material/styles';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { useTheme, useMediaQuery } from '@mui/material'; // Import useMediaQuery

import { _langs, _notifications } from 'src/_mock';

import { Iconify } from 'src/components/iconify';

import { Main } from './main';
import { layoutClasses } from '../classes';
import { NavMobile, NavDesktop } from './nav';
import { navData } from '../config-nav-dashboard';
import { Searchbar } from '../components/searchbar';
import { _workspaces } from '../config-nav-workspace';
import { MenuButton } from '../components/menu-button';
import { LayoutSection } from '../core/layout-section';
import { HeaderSection } from '../core/header-section';
import { AccountPopover } from '../components/account-popover';
import { LanguagePopover } from '../components/language-popover';
import { NotificationsPopover } from '../components/notifications-popover';

// ----------------------------------------------------------------------

export type DashboardLayoutProps = {
  sx?: SxProps<Theme>;
  children: React.ReactNode;
  header?: {
    sx?: SxProps<Theme>;
  };
};

export function DashboardLayout({ sx, children, header }: DashboardLayoutProps) {
  const theme = useTheme();

  const [navOpen, setNavOpen] = useState(false);

  const layoutQuery: Breakpoint = 'lg';
  const isDesktop = useMediaQuery(theme.breakpoints.up(layoutQuery)); // Khai báo useMediaQuery để kiểm tra

  return (
    <LayoutSection
      /** **************************************
       * Header
       *************************************** */
      headerSection={
        !isDesktop ? ( // Sử dụng toán tử 3 ngôi để hiển thị có điều kiện
          <HeaderSection
            layoutQuery={layoutQuery}
            slotProps={{
              container: {
                maxWidth: false,
                sx: { px: { [layoutQuery]: 5 } },
              },
            }}
            sx={header?.sx}
            slots={{
              leftArea: (
                <>
                  <MenuButton
                    onClick={() => setNavOpen(true)}
                    sx={{
                      ml: -1,
                      [theme.breakpoints.up(layoutQuery)]: { display: 'none' },
                    }}
                  />
                  <NavMobile
                    data={navData}
                    open={navOpen}
                    onClose={() => setNavOpen(false)}
                  />
                </>
              ),
               rightArea: (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0, sm: 0.75 } }}>
          {/** @slot Searchbar */}
          {/* <Searchbar /> */}
          {/** @slot Notifications popover */}
          <NotificationsPopover data={_notifications} />

          {/** @slot Account drawer */}
          {/* <AccountPopover /> */}
        </Box>
      ),
            }}
          />
        ) : null
      }
      /** **************************************
       * Sidebar
       *************************************** */
      sidebarSection={
        <NavDesktop data={navData} layoutQuery={layoutQuery} />
      }
      /** **************************************
       * Footer
       *************************************** */
      footerSection={null}
      /** **************************************
       * Style
       *************************************** */
      cssVars={{
        '--layout-nav-vertical-width': '300px',
        '--layout-dashboard-content-pt': theme.spacing(1),
        '--layout-dashboard-content-pb': theme.spacing(8),
        '--layout-dashboard-content-px': theme.spacing(5),
      }}
      sx={{
        [`& .${layoutClasses.hasSidebar}`]: {
          [theme.breakpoints.up(layoutQuery)]: {
            pl: 'var(--layout-nav-vertical-width)',
          },
        },
        ...sx,
      }}
    >
      <Main>{children}</Main>
    </LayoutSection>
  );
}