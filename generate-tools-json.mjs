// generate-tools-json.mjs (NEW AND IMPROVED VERSION)

// Part 1: Getting our tools from the toolbox.
// 'fs' lets us read and write files. 'path' helps us deal with file paths.
import fs from 'fs';
import path from 'path';

// Part 2: Setting up our workspace.
// We tell the script where to find the folder with all your tool files.
const toolsDirectory = path.join(process.cwd(), 'tools');
// And we tell it where to save the final list.
const outputFilePath = path.join(process.cwd(), 'tools.json');

console.log('Starting to build the tool list...');

// Part 3: The main work, wrapped in a safety net.
try {
    // Read all the filenames inside the '/tools/' directory.
    const filenames = fs.readdirSync(toolsDirectory);
    
    // From that list, we only want the files that end in '.html'.
    const htmlFiles = filenames.filter(file => file.endsWith('.html'));
    
    console.log(`Found ${htmlFiles.length} HTML tool files.`);

    // Go through each HTML filename, one by one, and gather all its details.
    const toolsData = htmlFiles.map(filename => {
        const filePath = path.join(toolsDirectory, filename);
        
        // --- NEW FEATURE: Get file creation time ---
        // This gives us information about the file, including when it was created.
        const stats = fs.statSync(filePath);
        // We get the creation time as a timestamp (a large number).
        const creationTime = stats.birthtimeMs; 

        // Read the first 5 lines of the HTML file to find its category.
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const firstLines = fileContent.split('\n').slice(0, 5).join('\n');
        
        // Look for the special comment, e.g., <!-- Category: Health -->
        const categoryMatch = firstLines.match(/<!--\s*Category:\s*([^>]+?)\s*-->/);
        // If a category is found, use it. If not, default to 'Utility'.
        const category = categoryMatch ? categoryMatch[1].trim() : 'Utility'; 

        // Create the tool's ID and Name from its filename.
        const id = filename.replace('.html', '');
        const name = id.replace(/-/g, ' ');

        // Return a neat object with all the details, including the new creation date.
        return {
            id: id,
            Name: name,
            Category: category,
            createdAt: creationTime // NEW: Add the creation timestamp to our data
        };
    });

    // --- NEW SORTING LOGIC ---
    // Instead of sorting alphabetically, we sort by the creation timestamp.
    // `b.createdAt - a.createdAt` sorts from the biggest number (newest) to the smallest (oldest).
    toolsData.sort((a, b) => b.createdAt - a.createdAt);

    // Finally, we take our complete, sorted list (newest first) and write it into the 'tools.json' file.
    fs.writeFileSync(outputFilePath, JSON.stringify(toolsData, null, 2));
    
    console.log(`Success! The 'tools.json' file was created with ${toolsData.length} tools, sorted by newest first.`);

} catch (error) {
    // This is our safety net. If anything goes wrong, this code will run.
    console.error('An error happened while creating the tool list:', error);
    process.exit(1); // This stops the deployment to prevent a broken site from going live.
}
