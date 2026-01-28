import { definePreset, type StyleOptions } from '@primeng/themes';
import Aura from '@primeng/themes/aura';

export const MyPreset = definePreset(Aura, {
  components: {
    button: {
      extend: {
        accent: {
          color: '#3b82f6',
          inverseColor: '#ffffff',
        },
      },
      css: ({ dt }: StyleOptions) => {
        const bg = dt('button.accent.color') ?? '#3b82f6';
        const fg = dt('button.accent.inverse.color') ?? '#ffffff';
        const speed = dt('my.transition.fast') ?? '0.25s';
        return `
          .p-button-accent {
            background: ${bg};
            color: ${fg};
            transition-duration: ${speed};
          }
        `;
      },
    },
    splitbutton: {
      extend: {
        accent: {
          color: '#2563eb',
          inverseColor: '#ffffff',
        },
      },
      css: ({ dt }: StyleOptions) => {
        const bg = dt('splitbutton.accent.color') ?? '#2563eb';
        const fg = dt('splitbutton.accent.inverse.color') ?? '#ffffff';
        return `
          .p-splitbutton-accent {
            background: ${bg};
            color: ${fg};
            border: none;
          }

          .p-splitbutton-accent:hover {
            background: #1d4ed8;
          }
        `;
      },
    },
  },
  extend: {
    my: {
      transition: {
        slow: '0.75s',
        normal: '0.5s',
        fast: '0.25s',
      },
      imageDisplay: 'block',
    },
  },
  css: ({ dt }: StyleOptions) => `
    img {
      display: ${dt('my.imageDisplay') ?? 'block'};
    }
  `,
});
