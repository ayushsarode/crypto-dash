// styles/fonts.js
import { Poppins } from '@next/font/google';

const poppins = Poppins({
  subsets: ['latin'],  // specify the subsets you need
  weight: ['400', '500', '600', '700'],  // specify the weights you want
  style: 'normal',  // specify the style, 'normal' or 'italic'
});

export default poppins;
