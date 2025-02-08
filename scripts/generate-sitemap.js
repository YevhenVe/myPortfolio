import { SitemapStream, streamToPromise } from "sitemap";
import { createWriteStream } from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

// Эмулируем __dirname для ES-модулей
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const generateSitemap = async () => {
    const sitemap = new SitemapStream({ hostname: "https://yevhen-portfolio-page.web.app" });

    const urls = [
        { url: "/", changefreq: "daily", priority: 1.0 },
        { url: "/about", changefreq: "monthly", priority: 0.8 },
        { url: "/contacts", changefreq: "monthly", priority: 0.8 },
        { url: "/projects", changefreq: "weekly", priority: 0.9 },
        { url: "/blog", changefreq: "daily", priority: 1.0 },
        { url: "/auth", changefreq: "monthly", priority: 0.9 },
    ];

    for (const url of urls) {
        sitemap.write(url);
    }
    sitemap.end();

    const sitemapPath = resolve(__dirname, "../public/sitemap.xml");
    const writeStream = createWriteStream(sitemapPath);
    const sitemapContent = await streamToPromise(sitemap);

    writeStream.write(sitemapContent.toString());
    writeStream.end();

    console.log("Sitemap generated at:", sitemapPath);
};

generateSitemap().catch((err) => {
    console.error("Error generating sitemap:", err);
});
