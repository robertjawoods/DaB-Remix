import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';
import type { ColorScheme } from '@mantine/core';
import { MantineProvider, ColorSchemeProvider } from '@mantine/core';
import { StylesPlaceholder } from '@mantine/remix';
import { Navbar } from './components/Navbar';
import { useLocalStorage } from '@mantine/hooks';
import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { rootAuthLoader } from "@clerk/remix/ssr.server";
import { ClerkApp } from "@clerk/remix";
import { ClerkCatchBoundary } from "@clerk/remix";

export const loader: LoaderFunction = (args) =>  rootAuthLoader(args, { loadUser: true });


export const links: LinksFunction = () => {
    return [ 
      {
        rel: 'icon',
        href: '/favicon.ico',
        type: 'image/ico'
      }
    ]
}

const COLOR_SCHEME_KEY = 'mantine-color-scheme'

const darkColours: any = [
  '#d5d7e0',
  '#acaebf',
  '#8c8fa3',
  '#666980',
  '#4d4f66',
  '#34354a',
  '#2b2c3d',
  '#1d1e30',
  '#0c0d21',
  '#01010a',
]

function App() {
  const [colourScheme, setColourScheme] = useLocalStorage<ColorScheme>({
    key: COLOR_SCHEME_KEY,
    defaultValue: 'light',
    getInitialValueInEffect: true,
  });

  const toggleColourScheme = (value?: ColorScheme) =>
    setColourScheme(value || (colourScheme === 'dark' ? 'light' : 'dark'));

  return (
    <ColorSchemeProvider colorScheme={colourScheme} toggleColorScheme={toggleColourScheme}>
      <MantineProvider withGlobalStyles withNormalizeCSS theme={{
        colorScheme: colourScheme,
        colors: {
          // override dark colors to change them for all components
          dark: darkColours
        },
      }}>
        <html lang="en">
          <head>
            <Meta />
            <Links />
            <StylesPlaceholder />
          </head>
          <body>
            <Navbar />
            <Outlet />
            <ScrollRestoration />
            <Scripts />
            <LiveReload />
          </body>
        </html>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

// const getClerkTheme = () => {
//   const colorScheme = typeof window !== 'undefined' ? localStorage.getItem(COLOR_SCHEME_KEY) ?? 'light' : 'light';

//   console.log(colorScheme)

//   return colorScheme === 'light'
//     ? {
//       general: {
//         fontColor: '#000' as any
//       }
//     }
//     : {
//       general: {
//         backgroundColor: '#333',
//         fontColor: '#fff' as any
//       }
//     }
// }

// withSentry(App, {
//   wrapWithErrorBoundary: false
// })

export default ClerkApp(App);

export const CatchBoundary = ClerkCatchBoundary();