import fs from 'fs';
import path from 'path';

const toolsDir = 'tools';
const outputFile = 'tools.json';
const sitemapFile = 'sitemap.xml';
const baseUrl = 'https://toolshub365.com';

try {
    // Check if the tools directory exists
    if (!fs.existsSync(toolsDir)) {
        console.warn(`Warning: Directory '${toolsDir}' not found. Creating empty files.`);
        fs.writeFileSync(outputFile, JSON.stringify([], null, 2));
        process.exit(0);
    }

    console.log(`Scanning directory: ${toolsDir}`);
    const files = fs.readdirSync(toolsDir).filter(file => file.endsWith('.html'));
    
    if (files.length === 0) {
        console.warn(`Warning: No HTML files found in '${toolsDir}'. Creating empty files.`);
        fs.writeFileSync(outputFile, JSON.stringify([], null, 2));
        process.exit(0);
    }

    console.log(`Found ${files.length} HTML tool files.`);

    const toolsData = files.map(file => {
        const filePath = path.join(toolsDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        
        // 1. Extract tool name from the <title> tag
        const titleMatch = content.match(/<title>(.*?)<\/title>/i);
        const name = titleMatch ? titleMatch[1].trim() : 'Unnamed Tool';

        // 2. Extract category from the specific comment format
        const categoryMatch = content.match(/<!--\s*Category:\s*(.*?)\s*-->/i);
        const category = categoryMatch ? categoryMatch[1].trim() : 'Utility';

        // 3. Use the filename (without .html) as the unique ID
        const id = path.basename(file, '.html');
        
        return { id, Name: name, Category: category };
    });

    // Sort tools alphabetically
    toolsData.sort((a, b) => a.Name.localeCompare(b.Name));
    
    // 1. Write tools.json
    fs.writeFileSync(outputFile, JSON.stringify(toolsData, null, 2));
    
    // 2. Generate Sitemap XML
    const currentDate = new Date().toISOString();
    let sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`;

    toolsData.forEach(tool => {
        // XML Escape utility (basic)
        const safeId = tool.id.replace(/&/g, '&amp;').replace(/'/g, '&apos;').replace(/"/g, '&quot;').replace(/>/g, '&gt;').replace(/</g, '&lt;');
        sitemapContent += `
  <url>
    <loc>${baseUrl}/tool/${safeId}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    });

    sitemapContent += `\n</urlset>`;
    fs.writeFileSync(sitemapFile, sitemapContent);

    console.log(`✅ Successfully generated ${outputFile} and ${sitemapFile} with ${toolsData.length} tools.`);

} catch (error) {
    console.error('❌ Error generating files:', error);
    process.exit(1);
}
