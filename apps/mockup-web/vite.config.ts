import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isLovable = process.env.VITE_LOVABLE === '1'

  return {
    server: {
      host: "::",
      port: 7777,
    },
    plugins: [
      react(),
      mode === 'development' && componentTagger(),
      {
        name: 'lovable-toggle',
        transformIndexHtml(html) {
          if (!isLovable) return html

          const relaxedCsp = "default-src 'self'; base-uri 'self'; frame-ancestors 'self' https://lovable.dev; form-action 'self'; img-src 'self' data: https://lovable.dev; object-src 'none'; script-src 'self' https://cdn.gpteng.co; style-src 'self' 'unsafe-inline'; connect-src 'self' ws: wss: https://lovable.dev https://cdn.gpteng.co; font-src 'self' data:; media-src 'self'; worker-src 'self' blob:"

          let out = html
          const cspMetaRegex = /<meta\s+http-equiv=\"Content-Security-Policy\"[^>]*>/i
          const newMeta = `<meta http-equiv="Content-Security-Policy" content="${relaxedCsp}" />`

          if (cspMetaRegex.test(out)) {
            out = out.replace(cspMetaRegex, newMeta)
          } else {
            out = out.replace('</head>', `  ${newMeta}\n  </head>`)
          }

          if (!/cdn\.gpteng\.co\/gptengineer\.js/.test(out)) {
            out = out.replace('</body>', `    <script src=\"https://cdn.gpteng.co/gptengineer.js\" type=\"module\"></script>\n  </body>`)
          }

          return out
        },
      },
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  }
});
