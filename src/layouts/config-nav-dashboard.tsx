import { Label } from 'src/components/label';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
);

export const navData = [
  {
    title: 'Quản Lý Khách Mời',
    path: '/link-generator',
    icon: icon('ic-user'),
  },
   {
    title: 'Sổ Lời Chúc',
    path: '/guestbook',
    icon: icon('ic-blog'),
  },
     {
    title: 'Xác nhận khách mời',
    path: '/rsvp',
    icon: icon('ic-analytics'),
  },
  {
   title: 'Album Ảnh',
    path: '/album?mode=couple',
   icon: icon('ic-album'),
    info: (
      <Label color="success" sx={{ px: 0.5 }}>
        Dùng thử
      </Label>
    ),
 },
 {
   title: 'Slide ảnh',
   path: '/slide-wedding',
   icon: icon('ic-video'),
    info: (
      <Label color="success" sx={{ px: 0.5 }}>
       Dùng thử
      </Label>
    ),
 },
  
];
